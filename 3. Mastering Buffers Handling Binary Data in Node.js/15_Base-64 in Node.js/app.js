import fs from "fs/promises";

// btoa()
const bufferContent1 = await fs.readFile("favicon/favicon-16x16.png");
const a1 = bufferContent1.toString("base64");
// // atob()
fs.writeFile("new-file.txt", a1);

// btoa()
const bufferContent2 = await fs.readFile("new-file.txt", "utf-8");
const a2 = bufferContent2.toString("base64");

// // atob()
fs.writeFile("a.png", a2, "base64");`

const bufferContent3 = await fs.readFile("script.js");
const a2 = bufferContent.toString("base64");
fs.writeFile("script.txt", a2)