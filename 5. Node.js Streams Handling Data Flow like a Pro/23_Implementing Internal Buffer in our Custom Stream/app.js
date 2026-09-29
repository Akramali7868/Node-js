import fs from "fs";

console.time();

const buff = Buffer.allocUnsafe(4);

const fd = fs.openSync("numbers.txt", "w");
let totalBytesWrittenInBuffer = 0;
let remainingStr = "";
const str = `${i}, `;

for (let i = 1; i <= 10; i++) {
  const bytesWritten = buff.write(
    remainingStr + str,
    totalBytesWrittenInBuffer,
  );
  const writtenBytesDiff = str.length - bytesWritten;
  if (writtenBytesDiff !== 0) {
    remainingStr += str.slice(bytesWritten);
  }
  totalBytesWrittenInBuffer += bytesWritten;
  if (totalBytesWrittenInBuffer === Buffer.length) {
    fs.writeSync(fd, buff);
    totalBytesWrittenInBuffer = 0;
  }
}

fs.closeSync(fd);
console.timeEnd();
