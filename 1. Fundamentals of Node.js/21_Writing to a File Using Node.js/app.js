import { appendFile, readFile, writeFile } from "node:fs/promises";

// fs.writeFile('file-1.txt', '\ni am akram')

// const contentBuffer = await readFile("C:\\Users\\deepak\\Desktop\\file-1.txt", 'utf-8');

try {
  const contentBuffer = await readFile("./imagefs.png");
  writeFile("C:\\Users\\deepak\\Desktop\\newImages.png", contentBuffer);
} catch (error) {
  appendFile(
    "error.log",
    `${new Date().toLocaleTimeString()}\n${error.message} \n ${error.stack}`,
  );
  console.log(error);
  console.log(`To see full error message go to error.log file`);
}
// writeFile("file-1.txt", contentBuffer);

// setInterval(() => {
//   writeFile("file-1.text", new Date().toLocaleTimeString());
// }, 500);
