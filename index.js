/**
 * This is the main entry point of the Express.js application. It sets up the server, configures middleware, and defines the API routes for handling user data.
 *
 * The application loads environment variables from a file, imports required modules, and creates an instance of the Express.js application.
 *
 * The application uses middleware to parse JSON request bodies, log requests to the console, and log request details to a log file.
 *
 * The application defines the following API routes:
 * - GET /: Responds with the "Hello World!" message.
 * - GET /api/users: Responds with the list of all users.
 * - GET /api/users/:id: Responds with the details of a specific user by ID.
 * - POST /api/users: Creates a new user and adds it to the users.json file.
 *
 * The application starts the server and listens for incoming requests on the specified port.
 */

// Load environment variables from a file
process.loadEnvFile();

// Import required modules
import express from "express"; // Express.js for creating the web server
import fs from "fs"; // File system module for reading and writing files

// Create an instance of the Express.js application
const app = express();
// Set the port number to either the value of the PORT environment variable or 3000 if not set
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Read and parse user data from the users.json file
const users = JSON.parse(fs.readFileSync("./users.json"));

// Define route to handle root endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Middleware to log requests to the console after each request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware to log request details to a log file
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\nDate :${Date.now()}, IP: ${req.ip}, Method: ${req.method}, URL: ${
      req.url
    }`,
    (err) => {
      if (err) throw err;
      next();
    }
  );
});

// Define route to get all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Define route to get a specific user by ID
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id); // Convert the ID parameter to a number
  const user = users.find((user) => user.id === id); // Find the user with the specified ID
  res.json(user); // Send the user data as JSON response
});

// Define route to create a new user
app.post("/api/users", (req, res) => {
  const newUser = req.body; // Get the new user data from the request body
  users.push({ id: users.length + 1, ...newUser }); // Add the new user to the users array with a new ID
  fs.writeFile("./users.json", JSON.stringify(users), (err) => {
    if (err) throw err;
    res.json({
      status: "success",
      message: `User ${newUser.first_name} added successfully`,
    });
  });
});

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
