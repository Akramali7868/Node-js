import { Buffer } from "node:buffer";
import fs from "fs/promises";

// const nodeBuffer = Buffer.from("abc");
const nodeBuffer = Buffer.from("Hello world!");

// console.log(nodeBuffer);


// // console.log(nodeBuffer.toString("latin1"));

// const nodeBuffer = Buffer.alloc(8)

// nodeBuffer.write("abc",)
// console.log(nodeBuffer.toString());
// console.log(nodeBuffer.toJSON());

console.log(nodeBuffer.includes('wo'));