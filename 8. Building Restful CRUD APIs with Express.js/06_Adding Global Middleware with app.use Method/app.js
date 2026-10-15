import express from "express";
const app = express();
const port = 4000;

// Parsing JSON Body (Custom Middleware)
app.use((req, res, next) => {
  req.on("data", (chunk) => {
    const reqBody = JSON.parse(chunk.toString());
    req.body = reqBody;
    next();
  });
});

app.use(express.json())

app.get("/", (req, res) => {
  console.log(req.url);
  console.log(req.route.path);
  res.end("Home Route");
});

// Login
app.get("/user", (req, res) => {
  console.log(req.url);
  console.log(req.body);
  res.end("ProCodrr");
});
app.post("/user", (req, res) => {
  console.log(req.url);
  res.end("Post ProCodrr");
});

app.get("/login", (req, res) => {
  // Request Handler Middlewares -3 Params
  console.log("Running Error Middleware");
  console.log(req.url);
  res.end("Logged Route");
});

app.listen(4000, () => {
  console.log(`Example app listening on port ${port}`);
});
