// Load environment variables from a file
process.loadEnvFile();

import { Router } from "express";
import fs from "fs/promises"; // File system module for reading and writing files (with promises)
import { validateUser } from "../validation.js"; // Import user validation function

// Supabase

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const router = Router();

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
router.get("/api/users", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * !Define route to get a specific user by ID
 */

router.get("/api/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return res
      .status(500)
      .json({ error: `Failed to fetch user with ID ${id}` });
  }

  if (!data) {
    return res.status(404).json({ error: "Failed to fetch user" });
  }

  res.json(data);
});

/**
 * !Define route to create a new user
 */

router.post("/api/users", async (req, res) => {
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
router.delete("/api/users/:id", async (req, res) => {
  const id = Number(req.params.id);

  // Check if the user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching user:", fetchError);
    return res.status(500).json({ error: "User not found" });
  }

  if (!existingUser) {
    return res.status(404).json({ error: "User not found" });
  }

  // Delete the user from the Supabase table
  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Error deleting user:", deleteError);
    return res.status(500).json({ error: "Failed to delete user" });
  }

  res.json({
    status: "success",
    message: `User named ${existingUser.first_name} deleted successfully`,
  });
});

export default router;
