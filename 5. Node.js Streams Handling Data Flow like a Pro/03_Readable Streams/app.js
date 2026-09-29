// import fs from "fs/promises";
import fs from "fs";

// const fileBuff = await fs.readFile('chars.txt')
console.time();
// Time 2.5s
// Memory 1888 MB
// CPU 4%
// const fileBuff = await fs.readFile("C:\\Users\\deepak\\Desktop\\base64.mp4");
// await fs.writeFile("base64.mp4", fileBuff);

// Time 6s
// Memory 50 MB
// CPU 12%
let readCount = 0;
const readStream = fs.createReadStream(
  "C:\\Users\\deepak\\Desktop\\base64.mp4",
  { highWaterMark: 1 * 1024 * 1024 },
);
readStream.on("data", (chunkBuffer) => {
    readCount++
  fs.appendFileSync("base.mp4", chunkBuffer);
});

readStream.on("end", () => {
  console.log({ readCount });
  console.timeEnd();
});
