import fs from "fs/promises";

const fileHandle = await fs.open("text.txt", "w+");
const { buffer, bytesRead } = await fileHandle.read({
  buffer: Buffer.alloc(10),
});

const { buffer: writtenBuffer, bytesWritten } = await fileHandle.write(
  Buffer.from("hi"),
);

console.log(writtenBuffer);
console.log(bytesWritten);

fileHandle.close()