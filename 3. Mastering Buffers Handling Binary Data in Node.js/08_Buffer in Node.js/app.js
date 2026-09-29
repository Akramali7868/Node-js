import { Buffer } from "node:buffer";
// const nodeBuffer = Buffer.alloc(4)
const a = new ArrayBuffer(4);
const nodeBuffer = Buffer.from(a);
const uint8Array = new Uint8Array(a);

uint8Array[0] = 97;
uint8Array[1] = 98;
uint8Array[2] = 99;
uint8Array[3] = 100;

console.log(nodeBuffer.toString());
