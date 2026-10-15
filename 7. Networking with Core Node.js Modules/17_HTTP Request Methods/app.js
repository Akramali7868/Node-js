import http from "node:http";

const server = http.createServer((request, response) => {
  console.log("Got the request");
  response.setHeader("Content-Length", "22");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.write("Hello from http server");
  console.log(request.headers);
  request.on("data", (chunk) => {
    console.log(chunk.toString());
  });
  // response.end();
});


server.listen(4000, "0.0.0.0", () => {
  console.log("Server Started");
});
