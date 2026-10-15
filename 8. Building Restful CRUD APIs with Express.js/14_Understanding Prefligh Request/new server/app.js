import express from "express";

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
  // const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:5500"];
  // if (allowedOrigins.includes(req.headers.origin)) {
  //   res.set("Access-Control-Allow-Origin", req.headers.origin);
  // }
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "PUT, DELETE");
  res.set("Access-Control-Allow-Headers", "content-type");

  next();
});
app.get("/api", (req, res) => {
  res.json({ message: "Hello, world get!" });
});
app.post("/api", (req, res) => {
  res.json({ message: "Hello, world post!" });
});
app.put("/api", (req, res) => {
  res.json({ message: "Hello, world put!" });
});
app.delete("/api", (req, res) => {
  res.json({ message: "Hello, world delete!" });
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:4000/");
});
