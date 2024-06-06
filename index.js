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

// Supabase

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)




// Import required modules
import express from "express"; // Express.js for creating the web server
import fs from "fs/promises"; // File system module for reading and writing files (with promises)
import { validateUser } from "./validation.js"; // Import user validation function

// Create an instance of the Express.js application
const app = express();
// Set the port number to either the value of the PORT environment variable or 3000 if not set
const port = process.env.PORT || 3000;

/**
 * !Middleware to parse JSON request bodies
 */
app.use(express.json());





// Define route to handle root endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});


/**
 * !Middleware to log requests to the console after each request
 */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});



/**
 * !Middleware to log request details to a log file
 */

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



/**
 * !Define route to get all users
 */
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(data);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});




/**
 * !Define route to get a specific user by ID
 */

app.get('/api/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: `Failed to fetch user with ID ${id}` });
  }

  if (!data) {
    return res.status(404).json({ error: 'Failed to fetch user' });
  }

  res.json(data);
});


/**
 * !Define route to create a new user
 */

app.post("/api/users", async (req, res) => {
  const newUser = req.body;

  // Validate user input
  const { error } = validateUser(newUser);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check if user already exists
  const { data: existingUsers, error: existingError } = await supabase
    .from("users")
    .select("*")
    .eq("email", newUser.email);

  if (existingError) {
    console.error("Error checking existing users:", existingError);
    return res.status(500).json({ error: "Failed to check existing users" });
  }

  if (existingUsers.length > 0) {
    return res
      .status(400)
      .json({ error: `User with email ${newUser.email} already exists` });
  }

  const { data: allUsers, error: allError } = await supabase
    .from("users")
    .select("*");
  const newId = allUsers.length + 1;

  // Insert the new user into the Supabase table
  const { data, error: insertError } = await supabase.from("users").insert({
    id: newId,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    email: newUser.email,
    gender: newUser.gender,
  });

  if (insertError) {
    console.error("Error inserting user:", insertError);
    return res.status(500).json({ error: "Failed to save user" });
  }

  res.json({
    status: "success",
    message: `User ${newUser.first_name} added successfully`,
  });
});


/**
 * !Define route to delete a user by ID
 */
app.delete('/api/users/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Check if the user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching user:', fetchError);
    return res.status(500).json({ error: 'User not found' });
  }

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Delete the user from the Supabase table
  const { error: deleteError } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Error deleting user:', deleteError);
    return res.status(500).json({ error: 'Failed to delete user' });
  }

  res.json({
    status: "success",
    message: `User named ${existingUser.first_name} deleted successfully`,
  });
});

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
