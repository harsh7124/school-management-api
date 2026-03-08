const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// helper to calculate distance in kilometers between two coords
function haversine(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST /addSchool
router.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // basic validation
  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (typeof name !== 'string' || typeof address !== 'string') {
    return res
      .status(400)
      .json({ error: 'Name and address must be strings.' });
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (isNaN(lat) || isNaN(lng)) {
    return res
      .status(400)
      .json({ error: 'Latitude and longitude must be numbers.' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, lat, lng]
    );
    res.status(201).json({ id: result.insertId, name, address, latitude: lat, longitude: lng });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// GET /listSchools?lat=...&lng=...
router.get('/listSchools', async (req, res) => {
  const { lat, lng } = req.query;
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ error: 'Invalid or missing coordinates.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM schools');
    const schools = rows.map((s) => {
      const distance = haversine(userLat, userLng, s.latitude, s.longitude);
      return { ...s, distance };
    });
    schools.sort((a, b) => a.distance - b.distance);
    res.json(schools);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

module.exports = router;
