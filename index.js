// Load environment variables
process.loadEnvFile();

// Import required modules
import express from "express";
import { readFileSync } from "fs";

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// Read and parse JSON data from a file
const users = JSON.parse(readFileSync("./users.json"));

// Define route to handle root endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Define route to get all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Define route to get a specific user by ID
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  res.json(user);
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
