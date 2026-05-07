const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
          }
          });

          app.get("/", (req, res) => {
            res.send("AttendIQ Backend Running 🚀");
            });

            app.get("/students", async (req, res) => {
              try {
                  const result = await pool.query(
                        "SELECT * FROM students"
                            );

                                res.json(result.rows);

                                  } catch (err) {
                                      res.status(500).json({
                                            error: err.message
                                                });
                                                  }
                                                  });

                                                  const PORT = process.env.PORT || 3000;

                                                  app.listen(PORT, () => {
                                                    console.log(`Server running on ${PORT}`);
                                                    });