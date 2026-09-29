// const a = new ArrayBuffer(4);
// const uint8Array = new Uint8Array(a)

// const uint8Array = new Uint8Array(4)

// Uint8Array[0] = 0xfe;
// Uint8Array[1] = 0xee;
// Uint8Array[2] = 0x3a;
// Uint8Array[3] = 0x8a;

// const uint8Array = new Uint8Array([0xfe,0xee,0,0x8a])

const uint8Array = new Uint8Array(1.9 * 1024 * 1024 * 1024);


console.log(uint8Array.buffer);
