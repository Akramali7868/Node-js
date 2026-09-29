import fs from "fs/promises";

const a = await fs.readFile("C:\\Users\\deepak\\Desktop\\App.png");

console.log(a.byteLength);