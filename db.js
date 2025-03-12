const sql = require("mssql");

// Database configuration
const config = {
  user: "Lekhan", // Replace with your DB username
  password: "Lekhan@2003", // Replace with your DB password
  server: "localhost", // Example: "localhost" or "192.168.1.100"
  database: "Authentication", // Replace with your DB name
  options: {
    encrypt: true, // Use encryption for Azure SQL
    trustServerCertificate: true, // Set to true for local development
  },
};

// Function to connect to SQL Server
async function connectDB() {
  try {
    let pool = await sql.connect(config);
    console.log("Connected to SQL Server");
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

module.exports = { connectDB, sql };
