import { Router } from "express";
import fs from "fs/promises"; // File system module for reading and writing files (with promises)
import { validateUser } from "../validation.js"; // Import user validation function

const router = Router();

/**
 * !Read and parse user data from the users.json file
 */
let users = [];
try {
  const usersData = await fs.readFile("./users.json", "utf8");
  users = JSON.parse(usersData);
} catch (err) {
  console.error("Error reading users.json:", err);
}

// Define route to handle root endpoint
router.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * !Middleware to log requests to the console after each request
 */
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/**
 * !Middleware to log request details to a log file
 */

router.use(async (req, res, next) => {
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

/**
 * !Define route to get all users
 */
router.get("/api/users", (req, res) => {
  res.json(users);
});

/**
 * !Define route to get a specific user by ID
 */

router.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id); // Convert the ID parameter to a number
  const user = users.find((user) => user.id === id); // Find the user with the specified ID
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user); // Send the user data as JSON response
});

/**
 * !Define route to create a new user
 */

router.post("/api/users", async (req, res) => {
  const newUser = req.body; // Get the new user data from the request body

  // Validate user input
  const { error } = validateUser(newUser);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check if user already exists
  const existingUser = users.find((user) => user.email === newUser.email);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: `User with email ${newUser.email} already exists` });
  }

  // Add the new user to the users array

  const id = users.length + 1;
  users.push({ id, ...newUser }); // Add the new user to the users array with a new ID

  try {
    await fs.writeFile("./users.json", JSON.stringify(users));
    res.json({
      status: "success",
      message: `User ${newUser.first_name} added successfully`,
    });
  } catch (err) {
    console.error("Error writing to users.json:", err);
    res.status(500).json({ error: "Failed to save user" });
  }
});

/**
 * !Define route to delete a user by ID
 */
router.delete("/api/users/:id", async (req, res) => {
  const id = Number(req.params.id); // Convert the ID parameter to a number
  const userIndex = users.findIndex((user) => user.id === id); // Find the index of the user with the specified ID

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  // Remove the user from the users array
  const deletedUser = users.splice(userIndex, 1)[0];

  try {
    await fs.writeFile("./users.json", JSON.stringify(users));
    res.json({
      status: "success",
      message: `User ${deletedUser.first_name} deleted successfully`,
    });
  } catch (err) {
    console.error("Error writing to users.json:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
