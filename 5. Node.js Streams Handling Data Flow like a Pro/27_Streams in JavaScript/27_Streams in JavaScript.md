# 📌 How Browsers Use Streams

Browser ko server se large file bhejne ke liye **HTTP Response Stream** ka use kiya ja sakta hai.

---

# 🔹 Basic Flow

```text
Server
  ↓
File Read Stream
  ↓
HTTP Response (res)
  ↓
Network
  ↓
Browser
```

Server file ko ek saath poora memory mein load nahi karta, balki **chunks mein browser ko send** karta hai.

---

# 1️⃣ HTTP Server

```js
const server = http.createServer(async (req, res) => {
```

Ye HTTP server create karta hai.

Browser jab request karta hai:

```text
Browser
   ↓ HTTP Request
Server
```

Server response ke through file data bhejta hai.

---

# 2️⃣ Content-Type

```js
res.setHeader("Content-Type", "image/webp");
```

Ye browser ko batata hai ki response mein **WebP image data** aa raha hai.

```text
Content-Type
     ↓
Browser ko data ka type pata chalta hai
```

---

# 3️⃣ File Open Karna

```js
const fileHandle = await fs.open("river.webp");
```

`fs.open()` file ko open karta hai aur **FileHandle** return karta hai.

---

# 4️⃣ Read Stream Create Karna

```js
const readStream = fileHandle.createReadStream({
  highWaterMark: 1000,
});
```

Yahan file ke liye Readable Stream create ki gayi hai.

```text
highWaterMark = 1000
```

Stream approximately **1000 bytes ke chunks** ke around data process karegi.

---

# 5️⃣ `"data"` Event

```js
readStream.on("data", (chunk) => {
  res.write(chunk);
```

Jab file se chunk read hota hai:

```text
File
 ↓
Read Stream
 ↓
chunk
 ↓
res.write(chunk)
 ↓
Browser
```

`res.write()` HTTP response mein chunk bhejne/queue karne ke liye use hota hai.

---

# 6️⃣ `pause()`

```js
readStream.pause();
```

Har chunk ke baad Readable Stream ko temporarily pause kiya ja raha hai.

```text
chunk
 ↓
res.write()
 ↓
pause()
```

Iska purpose yahan **reading speed ko intentionally control/slow karna** hai.

---

# 7️⃣ `resume()`

```js
setTimeout(() => {
  readStream.resume();
}, 10);
```

10 milliseconds ke baad stream dobara resume hoti hai.

```text
pause()
   ↓
10ms wait
   ↓
resume()
   ↓
next chunk
```

Isliye file chunks mein slowly browser ko send hoti hai.

---

# 🔥 Complete Flow

```text
             Server
                ↓
          river.webp
                ↓
          Read Stream
                ↓
             chunk
                ↓
          res.write()
                ↓
             pause()
                ↓
             10 ms
                ↓
            resume()
                ↓
          next chunk
                ↓
             Browser
```

---

# 8️⃣ `"end"` Event

```js
readStream.on("end", () => {
  res.end();
});
```

Jab file ka **saara data read ho jata hai**, `"end"` event fire hota hai.

Uske baad:

```js
res.end();
```

HTTP response ko complete karta hai.

```text
File completely read
       ↓
     "end"
       ↓
    res.end()
       ↓
Response complete
       ↓
Browser
```

---

# 🧠 Important Concepts

```text
createReadStream()
→ File ko chunks mein read karta hai.

highWaterMark
→ Readable Stream ke buffering behavior/chunk size ko control karta hai.

"data"
→ File ka chunk available hua.

res.write(chunk)
→ Chunk ko HTTP response mein send/queue karta hai.

pause()
→ Reading temporarily stop.

resume()
→ Reading dobara start.

"end"
→ File ka saara data read ho gaya.

res.end()
→ HTTP response complete.
```

# ⭐ One-Line Memory Trick

```text
File
 ↓
Read Stream
 ↓
Chunk
 ↓
res.write()
 ↓
Browser
 ↓
End
 ↓
res.end()
```

### 🎯 Main Concept

> **Browser ko large file ek saath bhejne ke bajay server file ko chunks mein read karke HTTP response ke through gradually browser ko send kar sakta hai.**

**Note:** Aapke example mein `pause()` + `setTimeout()` mainly learning/demo ke liye hai. Real applications mein HTTP response ki backpressure ko manually `10ms` delay se control karna generally correct approach nahi hota; `pipe()` ya proper stream backpressure mechanism use karna better hota hai.
