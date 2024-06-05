process.loadEnvFile();
import express from "express";
import { readFileSync } from "fs";

const app = express();
const port = process.env.PORT || 3000;

// parse json data
const users = JSON.parse(readFileSync("./users.json"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// make api calls sending json data

app.get("/users", (req, res) => {
  res.json(users);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
