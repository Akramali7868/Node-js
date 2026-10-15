import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.end("Hello World");
});

const port = 4000;
app.listen(4000, () => {
  console.log(`Example app listening on port ${port}`);
});
