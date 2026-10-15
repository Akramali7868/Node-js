import net from "node:net"; // TCP

const server = net.createServer((socket) => {
  socket.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  socket.write('HTTP\n\n"Got your message');
  socket.on("close", () => {
    console.log(socket.remoteAddress, "Client disconnected");
  });
  socket.on("error", () => {
    console.log("client lost");
  });
  console.log("Client Connected");
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on Port 4000");
});
