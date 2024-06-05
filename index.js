process.loadEnvFile();
import express from "express";
const app = express();
const port = process.env.PORT || 3000;

console.log("PORT", process.env.PORT);

app.get("/", (req, res) => {
  res.send("Home");
});

app.get("/about", (req, res) => {
  res.send(`name ${process.env.USER_NAME}`);
});

app.post("/post", (req, res) => {
  res.send("Got a POST request");
});

app.put("/user", (req, res) => {
  res.send("Got a PUT request at /user");
});

app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
