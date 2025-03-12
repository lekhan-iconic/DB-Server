const express = require("express");
const cors = require("cors");
const { connectDB, sql } = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Parse JSON requests

connectDB().then((pool) => {
  if (pool) {
    app.post("/login", async (req, res) => {
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          return res
            .status(400)
            .json({ message: "Username and password required" });
        }

        const result = await pool
          .request()
          .input("username", sql.VarChar, username)
          .input("password", sql.VarChar, password)
          .query(
            "SELECT * FROM Login WHERE username = @username AND password = @password"
          );

        if (result.recordset.length > 0) {
          res.json({ success: true, message: "✅ Login Successful!" });
        } else {
          res.status(401).json({
            success: false,
            message: "❌ Invalid Username or Password",
          });
        }
      } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "❌ Internal Server Error" });
      }
    });

    app.get("/data", async (req, res) => {
      try {
        const result = await pool
          .request()
          .query("SELECT name, username, password FROM Login"); // Ensure only necessary fields

        res.json({ success: true, logins: result.recordset });
      } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "❌ Internal Server Error" });
      }
    });

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  }
});
