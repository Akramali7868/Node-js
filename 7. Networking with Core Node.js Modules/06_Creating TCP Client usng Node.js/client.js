import net from "node:net";

const socket = net.createConnection({ host: "192.168.0.210", port: 4000 });

setTimeout(() => {
  socket.write("Hii");
  socket.end()
}, 2000);
socket.on("error", () => {
  console.log("Server lost");
});

// socket.on("data", (chunk) => {
//   console.log(chunk.toString());
// });
