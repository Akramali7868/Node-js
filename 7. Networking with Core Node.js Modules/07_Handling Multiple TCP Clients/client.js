

import net from "node:net";

process.stdin.on("data", (input) => {
socket.write(input)
});

const socket = net.createConnection({ host: "192.168.0.210", port: 4000 });

socket.on("error", () => {
  console.log("Server lost");
});

socket.on("data", (chunk) => {
  console.log(chunk.toString());
});


