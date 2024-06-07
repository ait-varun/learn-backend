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
 * - DELETE /api/users/:id: Deletes a user by ID.
 *
 * The application starts the server and listens for incoming requests on the specified port.
 */

// Load environment variables from a file
process.loadEnvFile();



import express from "express";
import fs from "fs/promises";
import usersRouter from "./routes/users.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(async (req, res, next) => {
  try {
    await fs.appendFile(
      "log.txt",
      `\nDate :${Date.now()}, IP: ${req.ip}, Method: ${req.method}, URL: ${
        req.url
      }`
    );
    next();
  } catch (err) {
    console.error("Error writing to log file:", err);
    next(err);
  }
});

// Mount the users router on /api/users
app.use("/", usersRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
