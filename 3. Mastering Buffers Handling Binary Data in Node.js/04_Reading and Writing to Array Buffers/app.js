const a = new ArrayBuffer(4)
const view = new DataView(a)
view.setInt8(0, 80)
view.setInt8(1, 0b1010000)
view.setInt8(2, 0x50)
view.setInt8(3, 0o120)

// getInt8 Reads value as signed
console.log(view.getInt8(0));


// getUint8 Reads value as unsigned
console.log(view.getUint8(0));
