import { createReadStream } from "fs";
import http from "http";

const server = http.createServer(async (req, res) => {
  console.log(req.url);
  if (req.url == "/") {
    const readStream = createReadStream("./public/html");
    readStream.pipe(res);
  } else {
    const readStream = createReadStream(`./public${req.url}`);
    readStream.on("error", (err) => {
      res.end("Not Found");
      console.log(err.message);
    });
    readStream.pipe(res);
  }
});

server.listen(4000, "192.168.0.210", () => {
  console.log("Server Started");
});
