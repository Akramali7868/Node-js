import dgram from "node:dgram"; // UDP
import { createReadStream } from "node:fs";

const socket = dgram.createSocket("udp4");

socket.on("message", (message, remoteAddress) => {
  console.log(message.toString());
  console.log(remoteAddress);
  socket.close();
});

const readStream = createReadStream("C:\\Users\\deepak\\Desktop\\num.txt", {
  highWaterMark: 1000,
});

readStream.on("data", (chunk) => {
  socket.send(chunk, 4000, "192.168.0.210", () => {
    console.log("Message sent");
  });
});

readStream.on("end", () => {
  socket.send('EOF', 4000, "192.168.0.210", () => {
    console.log("Message sent");
  });
});
