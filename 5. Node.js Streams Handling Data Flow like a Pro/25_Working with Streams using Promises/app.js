import fs from "fs/promises";

const readfileHandle = await fs.open("C:\\Users\\deepak\\Desktop\\streams.mp4");

const writefileHandle = await fs.open("streams.mp4", "w");

const readStream = readfileHandle.createReadStream();
const writeStream = writefileHandle.createWriteStream();

readStream.pipe(writeStream)