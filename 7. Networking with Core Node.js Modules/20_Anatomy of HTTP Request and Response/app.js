import http from "node:http";

const server = http.createServer((request, response) => {
  console.log(request.method);
  response.statusCode = 200;
  response.setHeader("Content-Length", "23");
  response.write("Hello from http Server");
});

server.on("connection", (socket) => {
  socket.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});
server.listen(4000, "0.0.0.0", () => {
  console.log("Server Started");
});
