import fs from "fs";

const writeStream = fs.createWriteStream("file.txt", { highWaterMark: 4 });

let i = 1;
while (i <= 100) {
  console.log(writeStream.writableLength);
  let isEmpty = writeStream.write("a");
  i++;
  if (!isEmpty) {
    break;
  }
  console.log(isEmpty);
}

writeStream.on("drain", () => {
  console.log(writeStream.writableLength);

  while (i <= 100) {
    console.log(writeStream.writableLength);
    let isEmpty = writeStream.write("a");
    i++;

    if (!isEmpty) {
      break;
    }
    console.log(isEmpty);
    i++;
  }
});
