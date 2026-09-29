// import fs from "node:fs";
import fs from "node:fs/promises";

// const content = fs.readFileSync("./index.html",'utf-8');

//  fs.readFile("./index.html", (err, data) => {
//   const content = data.toString();
//   console.log(content);
// });
console.time()
let i = 0;
const timerID = setInterval(() => {
  console.log(i++);
  if (i === 15) {
    clearInterval(timerID);
    console.timeEnd()
  }
}, 5);

const a = await fs.readFile("./npx-searching-step.txt");
console.log("reading done");

console.log("end");
