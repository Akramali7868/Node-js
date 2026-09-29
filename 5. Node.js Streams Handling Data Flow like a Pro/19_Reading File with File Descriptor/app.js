import fs from "fs";

const fd = fs.openSync("text.txt");

const readBuffer = Buffer.alloc(10);

fs.read(
  fd,
  { buffer: readBuffer, position: 2, length: 5, offset: 2 },
  (err, bytesRead, buffData) => {
    console.log(err);
    console.log(bytesRead);
    console.log(buffData.toString());
  },
);
