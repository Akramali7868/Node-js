import express from "express";
import { createWriteStream } from "node:fs";
import { readdir, rm, rename } from "fs/promises";

const app = express();
app.use(express.json());

// Enabling CORS (Cross-ORigin Resource Sharing)
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
  });
  next();
});
// Create
app.post("/:filename", (req, res) => {
  const writeStream = createWriteStream(`./storage/${req.params.filename}`);
  req.pipe(writeStream);
  req.on("end", () => {
    res.json({ message: "File Uploaded" });
  });
});

// Read
app.get("/", async (req, res) => {
  const fileList = await readdir("./storage");
  res.json(fileList);
});
app.get("/:filename", (req, res) => {
  const { filename } = req.params;
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  res.sendFile(`${import.meta.dirname}/storage/${filename}`);
});
// Delete
app.delete("/:filename", async (req, res) => {
  const { filename } = req.params;
  const filePath = `./storage/${filename}`;
  try {
    await rm(filePath);
    res.json({ message: "File Deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: "File Does not found" });
  }
});

// Update
app.patch("/:filename", async (req, res) => {
  const { filename } = req.params;
  const { newFileName } = req.body;
  await rename(`./storage/${filename}`, `./storage/${newFileName}`);
  res.json({ message: "Renamed" });
});

app.listen(4000, () => {
  console.log(`Server Started`);
});
