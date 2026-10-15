import express from "express";
const app = express();

app.get("/", (req, res) => {
  // Request Handler Middlewares -3 Params
  console.log("Running Error Middleware");
  res.end("Home Route");
});
app.get("/login", (req, res) => {
  // Request Handler Middlewares -3 Params
  console.log("Running Error Middleware");
  res.end("Logged Route");
});

app.post("/", (req, res) => {
  res.end("Post Home Route");
});
app.put("/", (req, res) => {
  res.end("Put Home Route");
});
app.patch("/", (req, res) => {
  res.end("Patch Home Route");
});
app.delete("/", (req, res) => {
  res.end("delete Home Route");
});

const port = 4000;
app.listen(4000, () => {
  console.log(`Example app listening on port ${port}`);
});
