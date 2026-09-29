import fs from "fs/promises";

const a = await fs.readFile("D:\\_Getintopc.com_Microsoft_Office_2019_Pro_Plus_16.0.10375.20036.rar");

console.log(a.byteLength);
console.log('end');