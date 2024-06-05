// Load environment variables
process.loadEnvFile();

// Import required modules
import express from "express";
import fs from "fs";

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Read and parse JSON data from a file
const users = JSON.parse(fs.readFileSync("./users.json"));

// Define route to handle root endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Middleware to log requests console.log after each request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  res.json(user);
});



// Create new user
app.post("/api/users", (req, res) => {
  const newUser = req.body;
  users.push({ id: users.length + 1, ...newUser });
  fs.writeFile("./users.json", JSON.stringify(users), (err) => {
    if (err) throw err;
    res.json({
      status: "success",
      message: `User ${newUser.first_name} added successfully`,
    });
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
