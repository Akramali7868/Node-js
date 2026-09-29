const a = new ArrayBuffer(4);
const view = new DataView(a);

// view.setInt16(0, 260);
// view.setInt16(2, 260);

// console.log(view.getInt16(0));
// console.log(view.getInt16(2, true));


view.setInt32(0, 0x7823e324)

console.log(view.getInt16(0));