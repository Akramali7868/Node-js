import net from "node:net"; // TCP

const clientsList = [];
process.stdin.on("data", (input) => {
  const inputStr = input.toString();
  const [clientIndex] = inputStr.split(" ");

  if (typeof parseInt(clientIndex) === "number") {
    clientsList[parseInt(clientIndex)].write(inputStr.substring(1));
  } else {
    clientsList.forEach((socket) => {
      socket.write(input);
    });
  }
});
const server = net.createServer((socket) => {
  clientsList.push(socket);
  console.log(clientsList.length);
  socket.on("data", (chunk) => {
    console.log(chunk.toString());
    clientsList.forEach((socket) => {
      socket.write(chunk);
    });
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
