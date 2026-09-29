import fs from "fs";

const fd1 = fs.openSync("text.txt");
const fd2 = fs.openSync("num.txt");
const fd3 = fs.openSync("package.json");


console.log(fd1);
console.log(fd2);
console.log(fd3);
