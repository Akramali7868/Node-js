import { createReadStream, createWriteStream } from "node:fs";
import net from "node:net";

// process.stdin.on("data", (input) => {
//   const inputString = input.toString();

//   if (inputString === "send") {
//     const readStream = createReadStream(
//       "C:\\Users\\deepak\\Desktop\\streams.mp4",
//     );

//     readStream.pipe(socket);
//     readStream.on("end", () => {
//       console.log("File ended");
//     });
//   }
// });

const socket = net.createConnection({ host: "192.168.0.210", port: 4000 });

const writeStream = createWriteStream(
  "C:\\Users\\deepak\\Desktop\\my-story.mp4",
);

// readStream.pipe(socket);
// readStream.on("end", () => {
//   console.log("File ended");
// });

socket.on("error", () => {
  console.log("Server lost");
});

socket.on("data", (chunk) => {
  writeStream.write(chunk);
});
