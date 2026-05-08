const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());


// ======================================
// NEON DATABASE CONNECTION
// ======================================

const pool = new Pool({

  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false
  }

});


// ======================================
// HOME ROUTE
// ======================================

app.get("/", (req, res) => {

  res.send("AttendIQ Backend Running 🚀");

});


// ======================================
// GET ALL STUDENTS
// ======================================

app.get("/students", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM students ORDER BY student_no DESC"
    );

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// ======================================
// ADD STUDENT
// ======================================

app.post("/students", async (req, res) => {

  try {

    const {
      name,
      email,
      attendance,
      cgpa,
      fees,
      percentage
    } = req.body;


    const result = await pool.query(

      `
      INSERT INTO students
      (
        name,
        email,
        attendance,
        cgpa,
        fees,
        percentage
      )

      VALUES ($1,$2,$3,$4,$5,$6)

      RETURNING *
      `,

      [
        name,
        email,
        attendance,
        cgpa,
        fees,
        percentage
      ]

    );

    res.json({
      success: true,
      student: result.rows[0]
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// ======================================
// DELETE STUDENT
// ======================================

app.delete("/students/:id", async (req, res) => {

  try {

    const id = req.params.id;

    await pool.query(

      "DELETE FROM students WHERE student_no = $1",

      [id]

    );

    res.json({
      success: true,
      message: "Student deleted"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// ======================================
// SERVER START
// ======================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
