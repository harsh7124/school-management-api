# School Management API

This repository contains a Node.js/Express application that provides two endpoints for managing schools stored in a MySQL database:

- `POST /addSchool` – add a new school record
- `GET /listSchools` – retrieve all schools sorted by proximity to supplied coordinates

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/harsh7124/school-management-api.git
   cd school-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create MySQL database and table**
   - Run the SQL script in `scripts/create_table.sql` or execute manually:
     ```sql
     CREATE DATABASE IF NOT EXISTS schooldb;
     USE schooldb;

     CREATE TABLE IF NOT EXISTS schools (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       address VARCHAR(255) NOT NULL,
       latitude FLOAT NOT NULL,
       longitude FLOAT NOT NULL
     );
     ```

4. **Configuration**
   - Copy `.env.example` to `.env` and update values with your MySQL credentials:
     ```ini
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=schooldb
     PORT=3000
     ```

5. **Run the application**
   ```bash
   npm run dev # for development with nodemon
   npm start   # to run once
   ```

6. **Testing**
   - Import the Postman collection located at `postman/SchoolManagement.postman_collection.json` and execute the requests.

## API Endpoints

### Add School

- `POST /addSchool`
- Body JSON:
  ```json
  {
    "name": "My School",
    "address": "123 Main St",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
  ```

### List Schools

- `GET /listSchools?lat=40.7128&lng=-74.0060`

Returns a JSON array of schools ordered by distance from the provided coordinates.

## Deployment

Deploy to a hosting provider that supports Node.js (e.g., Heroku, Render, AWS Elastic Beanstalk). Ensure environment variables are set for database connection. The code is ready for deployment out of the box.

---

`SchoolManagement.postman_collection.json` contains sample requests for easy testing.