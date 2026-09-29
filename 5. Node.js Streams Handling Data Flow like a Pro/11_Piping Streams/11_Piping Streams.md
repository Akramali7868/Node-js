# 📌 Node.js Streams — Manual Backpressure Handling

## 🔹 Goal

Large file ko:

```text
Readable Stream
      ↓
Writable Stream
      ↓
Destination File
```

copy karna aur **Backpressure ko properly handle karna**.

---

# 1️⃣ Readable Stream

```js
const readStream = fs.createReadStream(
  "C:\\Users\\deepak\\Desktop\\streams.mp4",
  {
    highWaterMark: 1 * 1024 * 1024
  }
);
```

`createReadStream()` large file ko **chunks mein read** karta hai.

```text
1 × 1024 × 1024
= 1,048,576 Bytes
= 1 MB
```

So approximately **1 MB chunks** read honge.

---

# 2️⃣ Writable Stream

```js
const writeStream = fs.createWriteStream("streams.mp4");
```

Ye destination file ke liye **Writable Stream** create karta hai.

```text
Source File
    ↓
readStream
    ↓
writeStream
    ↓
streams.mp4
```

---

# 3️⃣ `pipe()` aur `unpipe()`

Code mein:

```js
readStream.pipe(writeStream);

readStream.unpipe(writeStream);
```

### `pipe()`

Normally:

```js
readStream.pipe(writeStream);
```

Readable ko Writable se connect karta hai aur data transfer + backpressure automatically handle kar sakta hai.

### `unpipe()`

```js
readStream.unpipe(writeStream);
```

Readable aur Writable ke beech pipe connection **remove** kar deta hai.

### Is code mein kyun?

Yahan `pipe()` ke baad immediately `unpipe()` kiya gaya hai taaki hum **manual stream handling** kar sakein:

```text
pipe()
  ↓
Connect
  ↓
unpipe()
  ↓
Connection remove
  ↓
Manual data handling
```

⚠️ Practical application mein agar manual handling nahi karni hai, to `pipe()` ke baad `unpipe()` nahi karna chahiye.

---

# 4️⃣ `"data"` Event

```js
readStream.on("data", (chunk) => {
```

Jab Readable Stream se chunk available hota hai, `"data"` event fire hota hai.

```text
File
 ↓
1 MB chunk
 ↓
"data"
 ↓
chunk
```

`chunk` mein current data hota hai.

---

# 5️⃣ `write(chunk)`

```js
const isEmpty = writeStream.write(chunk);
```

Ye chunk ko Writable Stream mein write/queue karta hai.

`write()` boolean return karta hai:

```text
true
false
```

---

# 6️⃣ `true` ka matlab

```js
writeStream.write(chunk);
```

Agar:

```js
true
```

return hua:

```text
Writable buffer
      ↓
Abhi manageable
      ↓
Continue writing
```

Readable ko pause karne ki zarurat nahi.

---

# 7️⃣ `false` ka matlab — Backpressure

Agar:

```js
writeStream.write(chunk);
```

return kare:

```js
false
```

to Writable Stream ka internal buffer high level par pahunch gaya hai.

Isko **Backpressure** kehte hain.

```text
Readable
   ↓
Fast data
   ↓
Writable Buffer
   ↓
Buffer filling
   ↓
write() → false
```

Ab hume Readable ko temporarily stop karna chahiye.

---

# 8️⃣ `readStream.pause()`

```js
if (!isEmpty) {
  readStream.pause();
}
```

Jab `write()` false return kare:

```text
write() → false
      ↓
pause()
      ↓
Readable temporarily stop
```

Isse Writable buffer ko data process karne ka time milta hai.

---

# 9️⃣ `drain` Event

```js
writeStream.on("drain", () => {
  readStream.resume();
});
```

Jab Writable Stream ka buffer sufficiently clear ho jata hai, `"drain"` event fire hota hai.

```text
write() → false
      ↓
pause()
      ↓
Buffer data process
      ↓
drain
      ↓
resume()
```

---

# 🔟 `resume()`

```js
readStream.resume();
```

`resume()` Readable Stream ko dobara data flow karne deta hai.

```text
Paused
   ↓
resume()
   ↓
Flowing
   ↓
Next chunk
```

---

# 🔥 Complete Backpressure Flow

```text
                 Readable Stream
                       ↓
                    chunk
                       ↓
                write(chunk)
                       ↓
                ┌──────┴──────┐
                ↓             ↓
              true          false
                ↓             ↓
          Continue         pause()
          reading             ↓
                         Wait for buffer
                            to clear
                              ↓
                           drain
                              ↓
                           resume()
                              ↓
                       Continue reading
```

---

# 1️⃣1️⃣ `"end"` Event

```js
readStream.on("end", () => {
  console.timeEnd();
});
```

`"end"` tab fire hota hai jab Readable Stream ka **saara data consume ho chuka ho**.

⚠️ Agar aapko specifically confirm karna hai ki destination file mein writing complete ho gayi hai, to Writable Stream ka `"finish"` event zyada appropriate hai:

```js
writeStream.on("finish", () => {
  console.timeEnd();
});
```

---

# 🧠 Backpressure ki zarurat kyun?

Suppose:

```text
Readable → 500 MB/s
Writable → 100 MB/s
```

Agar Readable continuously data deta rahe:

```text
500 MB/s
   ↓
Writable
   ↓
100 MB/s
```

To baaki data internal buffers mein accumulate hoga.

Eventually:

```text
Buffer
 ↓
Full
 ↓
Memory pressure
```

Backpressure is problem ko control karta hai:

```text
Writable slow
     ↓
write() → false
     ↓
Readable pause
     ↓
Writable catches up
     ↓
drain
     ↓
Readable resume
```

---

# ⭐ Important Concepts

```text
createReadStream()
→ Large file ko chunks mein read karta hai.

createWriteStream()
→ Data ko file mein stream ke through write karta hai.

highWaterMark
→ Stream ke buffering behavior ka threshold/configuration.

write()
→ Data ko Writable Stream mein write/queue karta hai.

write() → true
→ Continue writing.

write() → false
→ Backpressure; temporarily pause reading.

pause()
→ Readable Stream ko temporarily stop karta hai.

drain
→ Writable Stream dobara data accept karne ke liye ready hai.

resume()
→ Readable Stream ko dobara continue karta hai.

end
→ Readable ka saara data consume ho gaya.

finish
→ Writable Stream ka saara data successfully flush/write ho gaya.
```

# 🚀 `pipe()` vs Manual Backpressure

### Manual

```js
readStream.on("data", (chunk) => {
  const canContinue = writeStream.write(chunk);

  if (!canContinue) {
    readStream.pause();
  }
});

writeStream.on("drain", () => {
  readStream.resume();
});
```

### Automatic

```js
readStream.pipe(writeStream);
```

`pipe()` internally data flow aur backpressure ko handle karne ke liye designed hai.

### Isliye practical file-copy ke liye:

```js
const readStream = fs.createReadStream("input.mp4");
const writeStream = fs.createWriteStream("output.mp4");

readStream.pipe(writeStream);
```

**Manual code learning ke liye useful hai**, kyunki isse samajh aata hai ki `pipe()` ke peeche backpressure ka concept kaise kaam karta hai.
