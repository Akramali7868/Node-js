import { Buffer, constants } from "node:buffer";

const a = Buffer.alloc(4);
const z = Buffer.alloc(4);
const b = Buffer.allocUnsafe(8);
const c = Buffer.allocUnsafe(4);
const d = Buffer.from("abc");
const joinBuffer = Buffer.concat([a, z]);

b[2] = 97;
c[0] = 101;

// console.log(a.byteLength);
// console.log(b.byteLength);
// console.log('********************');

// console.log(a.buffer.byteLength);
// console.log(b.buffer.byteLength);

console.log(b.buffer === c.buffer);
