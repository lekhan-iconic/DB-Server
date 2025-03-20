const express = require("express");
const cors = require("cors");
const { connectDB, sql } = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Parse JSON requests

let dbPool = null;

// API to connect to the database dynamically
app.post("/connect-db", async (req, res) => {
  const { user, password, server, database } = req.body;

  if (!user || !password || !server || !database) {
    return res.status(400).json({ message: "❌ Missing database credentials" });
  }

  dbPool = await connectDB(user, password, server, database);
  if (dbPool) {
    res.json({ success: true, message: "✅ Connected to SQL Server" });
  } else {
    res.status(500).json({ message: "❌ Failed to connect to the database" });
  }
});

// Login API
app.post("/login", async (req, res) => {
  console.log("Received login request:", req.body);

  if (!dbPool) {
    console.log("❌ Database not connected");
    return res.status(500).json({ message: "❌ Database not connected" });
  }

  try {
    const { username, password } = req.body;
    console.log(`Checking login for user: ${username}`);

    const result = await dbPool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .query(
        "SELECT * FROM Login WHERE username = @username AND password = @password"
      );

    if (result.recordset.length > 0) {
      console.log("✅ Login Successful!");
      res.json({ success: true, message: "✅ Login Successful!" });
    } else {
      console.log("❌ Invalid Credentials");
      res
        .status(401)
        .json({ success: false, message: "❌ Invalid Username or Password" });
    }
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

// Get Data API
app.get("/data", async (req, res) => {
  if (!dbPool) {
    return res.status(500).json({ message: "❌ Database not connected" });
  }

  try {
    const result = await dbPool
      .request()
      .query("SELECT name, username, password FROM Login");
    res.json({ success: true, logins: result.recordset });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
