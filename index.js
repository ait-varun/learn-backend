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
import usersRouter from "./routes/users.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Mount the users router on /api/users
app.use("/", usersRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
