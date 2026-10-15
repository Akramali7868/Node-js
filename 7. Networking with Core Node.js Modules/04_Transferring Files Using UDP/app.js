import dgram from "node:dgram"; // UDP
import { createWriteStream } from "node:fs";

const socket = dgram.createSocket("udp4");

const writeStream = createWriteStream("numbers.txt");
socket.on("message", async (message, remoteAddress) => {
  if (message.toString() === "EOF") {
    socket.send(
      "File Uploaded Successfully on the server",
      remoteAddress.port,
      remoteAddress.address,
    );
  } else {
    writeStream.write(message);
  }
});

socket.bind({ port: 4000 }, () => {
  const address = socket.address();
  console.log(`listening on port ${address.port}`);
  console.log(address);
});
