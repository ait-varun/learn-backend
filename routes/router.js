import { Router } from "express";
import usersRouter from "./users.js";
import customersRouter from "./customers.js";
import countriesRouter from "./countries.js";

const router = Router();

// Root route
router.get("/", (req, res) => {
  res.send("Hello World!");
});

// Mount routers
router.use("/api/users", usersRouter);
router.use("/api/customers", customersRouter);
router.use("/api/countries", countriesRouter);

// Middleware to log requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

export default router;
