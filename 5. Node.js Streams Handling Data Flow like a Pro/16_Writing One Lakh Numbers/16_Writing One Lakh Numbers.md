# 📌 Node.js — `writeFileSync()` vs `createWriteStream()`

Is example mein hum **1 se 5000 numbers** ko file mein write kar rahe hain.

---

# 1️⃣ Method 1 — `writeFileSync()` + `appendFileSync()`

```js
for (let i = 1; i <= 5000; i++) {

  if (i === 1) {
    fs.writeFileSync("numbers.txt", `${i}, `);
  } else {
    fs.appendFileSync("numbers.txt", `${i}, `);
  }

}
```

Is method mein har iteration par filesystem operation synchronously ho raha hai.

```text
1  → File operation
2  → File operation
3  → File operation
4  → File operation
...
5000 → File operation
```

### 🔴 Problem

`Sync` ka matlab hai:

> Jab tak current file operation complete nahi hota, JavaScript execution next operation par nahi jaata.

Isliye bahut saare individual filesystem operations hone se total time badh sakta hai.

Aapke test mein approximately:

```text
⏱️ ~1 second
```

---

# 2️⃣ Method 2 — `createWriteStream()`

```js
const writeStream = fs.createWriteStream("streamNumbers.txt");

for (let i = 1; i <= 5000; i++) {
  writeStream.write(`${i}, `);
}

writeStream.end();

writeStream.on("finish", () => {
  console.timeEnd();
});
```

Yahan hum **Writable Stream** use kar rahe hain.

```text
JavaScript
   ↓
write()
   ↓
Internal Buffer
   ↓
File
```

Har `write()` par alag-alag synchronous filesystem call karne ke bajay data stream ke through buffer/OS ko diya jata hai.

Isliye ye approach large/sequential data writing ke liye efficient hoti hai.

Aapke test mein approximately:

```text
⏱️ ~30 ms
```

---

# 🔥 Main Difference

### `writeFileSync()` / `appendFileSync()`

```text
Loop
 ↓
File operation
 ↓
Wait
 ↓
Next iteration
 ↓
File operation
 ↓
Wait
 ↓
...
```

### `WriteStream`

```text
Loop
 ↓
write()
 ↓
Buffer
 ↓
write()
 ↓
Buffer
 ↓
write()
 ↓
...
 ↓
end()
 ↓
File writing complete
```

---

# 🧠 `writeStream.write()` ka Important Point

```js
writeStream.write(`${i}, `);
```

`write()` ka matlab ye nahi hai ki **har call par immediately disk पर data physically write ho gaya**.

Data Writable Stream ke internal buffering mechanism se process hota hai.

Isi wajah se:

```text
5000 × individual file operations
```

ke comparison mein:

```text
5000 × stream.write()
```

generally much more efficient ho sakta hai.

---

# 🔹 `end()`

```js
writeStream.end();
```

`end()` stream ko batata hai:

> Ab aur data write nahi karna hai.

Uske baad remaining buffered data ko finish kiya jata hai.

---

# 🔹 `finish` Event

```js
writeStream.on("finish", () => {
  console.timeEnd();
});
```

`finish` event tab fire hota hai jab Writable Stream ka data successfully finish/flush ho chuka ho.

Isliye timing ke liye:

```js
writeStream.end();

writeStream.on("finish", () => {
  console.timeEnd();
});
```

use karna useful hai.

---

# ⚠️ Important: Stream hamesha faster nahi hoti

Aapke test mein:

```text
Sync methods   → ~1 sec
WriteStream    → ~30 ms
```

lekin iska matlab ye nahi ki **WriteStream hamesha exactly 30 ms aur Sync hamesha 1 sec lega**.

Actual time depend karta hai:

```text
File size
Disk speed
Operating System
Filesystem
Hardware
Buffering
System load
```

Aapka example primarily ye demonstrate karta hai ki **bahut saare individual synchronous file operations ke comparison mein stream-based writing efficient ho sakti hai**.

---

# ⭐ Quick Revision

```text
writeFileSync()
→ File ko synchronously write karta hai.

appendFileSync()
→ Existing file mein synchronously data append karta hai.

createWriteStream()
→ Writable Stream create karta hai.

write()
→ Data ko stream mein write/queue karta hai.

end()
→ Writing complete hone ka signal deta hai.

finish
→ Writable Stream ka writing process complete hone par fire hota hai.
```

### 🔥 One-Line Memory Trick

```text
writeFileSync / appendFileSync
→ Har operation par file-system call + blocking

WriteStream
→ Data → Stream Buffer → File
→ Continuous writing ke liye efficient
```
