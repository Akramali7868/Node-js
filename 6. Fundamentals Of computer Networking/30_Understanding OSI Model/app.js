const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end('{"message:": "Hello, Procoderrs"}');
});

server.listen(4000, () => {
  console.log("HTTP server is running on http://localhost:4000");
  console.log(server.address());
});
