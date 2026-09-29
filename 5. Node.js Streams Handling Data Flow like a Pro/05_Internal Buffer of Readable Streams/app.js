import fs from "fs";

const readStream = fs.createReadStream("chars.txt", { highWaterMark: 4 });

readStream.on("data", (chunk) => {
  console.log(chunk);
});

//YE TAB FIRE HOGA JB INTERNAL BUFFER READY HOGYA HOGA
readStream.on("readable", () => {
  console.log(readStream.readableLength);
  console.log(readStream.read());
});
