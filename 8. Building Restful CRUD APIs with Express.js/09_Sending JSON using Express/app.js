import express from "express";
import { open } from "fs/promises";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  // res.setHeader("Content-Type", "application/json")
  // res.end(JSON.stringify({ message: "Hello World" }));
  res.status(201).json({ message: "Hello World" });
});

app.listen(4000, () => {
  console.log(`Example app listening on port ${port}`);
});
