import express from "express";
const app = express();
const port = 4000;

app.use(express.json());

app.use("/admin", (req, res, next) => {
  console.log(req.url);
  if (req.body.password === "secret") {
    next();
  } else {
    res.end("Invalid Credentials");
  }
});

app.post("/admin", (req, res) => {
  res.end("Hello Admin");
});

app.listen(4000, () => {
  console.log(`Example app listening on port ${port}`);
});
