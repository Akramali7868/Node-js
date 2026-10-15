import express from "express";
const app = express();

app.get(
  "/",
  (req, res, next) => {
    // Request Handler Middlewares -3 Params
    try {
      console.log("Running Middleware 1");
      throw new Error("Error Occurred");
      res.end("Hi");
    } catch (err) {
      next('');
    }
  },
  (err, req, res, next) => {
    console.log({ err: err.message });
    // Error Handler Middlewares -4 Params
    console.log("Running Error Middleware");
    res.end("Error Found");
  },
  (req, res) => {
    // Request Handler Middlewares -2 Params
    console.log("Running Middleware 2");
    res.end("Hello world 2");
  },
);

const port = 4000;
app.listen(4000, () => {
  console.log(`Example app listening on port ${port}`);
});
