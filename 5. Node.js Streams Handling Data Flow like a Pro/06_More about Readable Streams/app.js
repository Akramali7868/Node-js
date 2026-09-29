import fs from "fs";

const readStream = fs.createReadStream("chars.txt", { highWaterMark: 4 });
readStream.setEncoding("utf-8");

readStream.on("data", (chunk) => {
  console.log(chunk);
});

readStream.on("close", () => {
  console.log("Closed");
});

readStream.on("end", () => {
  console.log("End");
});

readStream.destroy('Err');

readStream.on('error', (err)=>{
console.log(err);
})

readStream.on('open', (data)=>{
console.log("Opened", data);
})
readStream.on('ready', (data)=>{
console.log("ready", data);
})

