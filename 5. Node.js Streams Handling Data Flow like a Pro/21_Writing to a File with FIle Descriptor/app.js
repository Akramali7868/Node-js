import fs from "fs";

const fd = fs.openSync("text.txt", "w");
// const buff = Buffer.from("123");

fs.write(fd, '😍', (err, bytesWritten, writtenData) => {
  console.log(bytesWritten);
  console.log(writtenData);
});
