const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end('{"message:": "Hello, Procoderrs"}');
});

server.listen(3000, () => {
  console.log("HTTP server is running on http://localhost:3000");
  console.log(server.address());
});
