import { createReadStream } from "node:fs";
import { open } from "node:fs/promises";
import net from "node:net";

const server = net.createServer(async (socket) => {
  const fileHandle = await open("numbers.txt");
  const { size } = await fileHandle.stat();
  const readStream = fileHandle.createReadStream({ highWaterMark: 32 });

  socket.write("HTTP/1.1 200 Okay\n");
  socket.write("Access-Control-Allow-Origin:*\n\n");
  // socket.write("Access-Control-Expose-Headers:*\n");
  // socket.write("content-Type: text/txt; charset=utf-8\n");
  // socket.write("content-Type: video/mp4\n");
  // socket.write("content-Type: application/pdf\n");
  // socket.write("Content-Disposition: attachment; filename=streams.mp4");
  // socket.write(`Content-Length: 3\n`);
  socket.write("\n\n");

  readStream.on("data", (chunk) => {
    socket.write(chunk);

    readStream.pause();

    setTimeout(() => {
      readStream.resume();
    }, 500);
  });

  // readStream.pipe(socket);

  socket.on("close", () => {
    console.log(socket.remoteAddress, ": Client disconnected");
  });

  socket.on("error", () => {
    console.log("Client Lost");
  });
  console.log("Client Connected", socket.remoteAddress);
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
