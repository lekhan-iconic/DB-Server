const sql = require("mssql");

// Function to connect to SQL Server dynamically
async function connectDB(user, password, server, database) {
  const config = {
    user,
    password,
    server,
    database,
    options: {
      encrypt: true, // Use encryption for Azure SQL
      trustServerCertificate: true, // Set to true for local development
    },
  };

  try {
    let pool = await sql.connect(config);
    console.log("Connected to SQL Server");
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
    return null;
  }
}

module.exports = { connectDB, sql };
