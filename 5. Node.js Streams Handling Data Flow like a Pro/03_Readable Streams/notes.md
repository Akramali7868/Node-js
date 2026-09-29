# 📌 Node.js Readable Stream — `fs.createReadStream()`

## 🔹 What is `createReadStream()`?

`fs.createReadStream()` ka use **large file ko ek saath memory mein load karne ke bajay chunks mein read karne** ke liye hota hai.

```js
const readStream = fs.createReadStream("base64.mp4");
```

### ✅ Advantage

Large file ko chunks mein process karne ki wajah se **memory usage kam** hota hai.

---

## 🔹 `highWaterMark`

```js
const readStream = fs.createReadStream("base64.mp4", {
  highWaterMark: 1 * 1024 * 1024,
});
```

`highWaterMark` batata hai ki stream **approximately kitne bytes ka chunk** read kare.

```text
1 * 1024 * 1024
= 1,048,576 Bytes
= 1 MB
```

So:

```js
highWaterMark: 1 * 1024 * 1024;
```

➡️ Approximately **1 MB ke chunks** mein data read hoga.

⚠️ `highWaterMark` ka matlab poori file ka size nahi hai.
Ye **chunk size** ko control karta hai.

---

## 🔹 `"data"` Event

```js
readStream.on("data", (chunkBuffer) => {
  console.log(chunkBuffer);
});
```

Jab stream ko ek chunk milta hai, `"data"` event fire hota hai.

```text
File
 ↓
Chunk 1 → "data" event
 ↓
Chunk 2 → "data" event
 ↓
Chunk 3 → "data" event
 ↓
...
```

### `chunkBuffer`

`chunkBuffer` mein **currently read kiya gaya chunk** hota hai.

Ye Node.js ka **Buffer object** hota hai.

Example:

```js
readStream.on("data", (chunkBuffer) => {
  console.log(chunkBuffer);
});
```

---

## 🔹 `readCount`

```js
let readCount = 0;

readStream.on("data", (chunkBuffer) => {
  readCount++;
});
```

Har baar `"data"` event fire hoga:

```js
readCount++;
```

isliye count increase hoga.

Example:

```text
1st chunk → readCount = 1
2nd chunk → readCount = 2
3rd chunk → readCount = 3
...
```

---

## 🔹 `"end"` Event

```js
readStream.on("end", () => {
  console.log("File completely read");
});
```

Jab **poori file read ho jaati hai**, `"end"` event fire hota hai.

---

# 🔥 Complete Example

```js
const fs = require("fs");

let readCount = 0;

const readStream = fs.createReadStream(
  "C:\\Users\\deepak\\Desktop\\base64.mp4",
  {
    highWaterMark: 1 * 1024 * 1024,
  },
);

readStream.on("data", (chunkBuffer) => {
  readCount++;

  fs.appendFileSync("base.mp4", chunkBuffer);
});

readStream.on("end", () => {
  console.log({ readCount });
});
```

---

# 🧠 Complete Flow

```text
Large File
    ↓
createReadStream()
    ↓
highWaterMark = 1 MB
    ↓
File is divided/read in chunks
    ↓
Chunk Buffer
    ↓
"data" event
    ↓
Callback executes
    ↓
Next chunk
    ↓
"data" event
    ↓
...
    ↓
Entire file read
    ↓
"end" event
```

### ⭐ Remember

```text
createReadStream()
→ Large file ko chunks mein read karta hai

highWaterMark
→ Ek chunk ka approximate size specify karta hai

"data"
→ Har chunk available hone par fire hota hai

chunkBuffer
→ Current chunk ka Buffer data

"end"
→ Jab poori file read ho jaati hai
```
