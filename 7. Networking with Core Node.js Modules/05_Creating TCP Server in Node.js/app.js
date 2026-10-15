import net from "node:net"; // TCP

const server = net.createServer();
server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on Port 4000");
});

server.on("connection", (socket) => {
  socket.on("data", (chunk) => {
    console.log(chunk.toString());
    socket.write("Got your message");
  });

  socket.on("close", () => {
    console.log(socket.remoteAddress, "Client disconnected");
  });

  console.log(socket.address());
  console.log(socket.remoteAddress);
  console.log(socket.remotePort);
  console.log(socket.remoteFamily);
  console.log("Client Connected");
});
