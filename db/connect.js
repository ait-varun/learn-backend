import mysql from "mysql";

/**
 * ! Connect to the database
 */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bodyandfragrance-app",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

// db.query("SELECT * FROM countries", (err, rows) => {
//   if (err) throw err;
//   console.log(rows);
// });

export default db;
