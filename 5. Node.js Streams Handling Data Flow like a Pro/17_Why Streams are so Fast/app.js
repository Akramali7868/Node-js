import fs from "fs";

console.time();

// Time 1 second
for (let i = 1; i <= 5000; i++) {
  if (i === 1) {
    fs.writeFileSync("numbers.txt", `${i}, `);
  } else {
    fs.appendFileSync("numbers.txt", `${i}, `);
  }
}

// Time 30ms
const writeStream = fs.createWriteStream("streamNumbers.txt");
for (let i = 1; i <= 5000; i++) {
  writeStream.write(`${i}, `);
}

writeStream.end();

writeStream.on("finish", () => {
  console.timeEnd();
});
