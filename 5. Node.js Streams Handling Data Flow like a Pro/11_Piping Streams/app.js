import fs from "fs";

console.time();
const readStream = fs.createReadStream(
  "C:\\Users\\deepak\\Desktop\\streams.mp4",
  { highWaterMark: 1 * 1024 * 1024 },
);

const writeStream = fs.createWriteStream("streams.mp4");

readStream.pipe(writeStream);

// readStream.unpipe(writeStream);

// readStream.on("data", (chunk) => {
//   const isEmpty = writeStream.write(chunk);
//   if(!isEmpty){
//     readStream.pause()
//   }
// });

// writeStream.on('drain',()=>{
//   readStream.resume()
// })

readStream.on("end", () => {
  console.timeEnd();
});
