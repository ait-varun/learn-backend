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
