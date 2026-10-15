import { createReadStream } from "node:fs";
import net from "node:net";

const server = net.createServer((socket) => {
  // socket.write(
  //   "HTTP/1.1 200 Okay\nAccess-Control-Allow-Origin:*\nAccess-Control-Expose-Headers:*\n\n",
  // );
  // socket.end();
  // const readStream = createReadStream("river.webp");
  // const readStream = createReadStream("num.txt");
  // const readStream = createReadStream("numbers.txt");

  socket.write("HTTP/1.1 200 Okay\n");
  socket.write("Access-Control-Allow-Origin:*\n");
  socket.write("Access-Control-Expose-Headers:*\n");
  socket.write("hello:word");
  

  const readStream = createReadStream(
    "C:\\Users\\deepak\\Desktop\\streams.mp4",
  );
  // readStream.pipe(socket);
  readStream.on("end", () => {
    console.log("File ended");
  });
  socket.on("data", (chunk) => {
    console.log(chunk.toString());
  });

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
