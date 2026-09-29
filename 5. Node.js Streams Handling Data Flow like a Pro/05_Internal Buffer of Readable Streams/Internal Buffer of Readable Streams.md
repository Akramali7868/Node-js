# 📌 Node.js Readable Stream — `readable` Event

## 🔹 `readable` Event kya karta hai?

`readable` event tab fire hota hai jab **Readable Stream ke internal buffer mein data available/readable ho jata hai**.

```js
readStream.on("readable", () => {
  console.log(readStream.read());
});
```

Iska matlab:

> `"readable"` event hume batata hai ki ab stream ke internal buffer se data `read()` karke manually read kiya ja sakta hai.

---

# 🔹 Internal Buffer kya hai?

Readable Stream file se data ko pehle apne **internal buffer** mein rakhta hai.

```text
chars.txt
   ↓
File System
   ↓
Readable Stream
   ↓
Internal Buffer
   ↓
read() se data
```

Jab internal buffer mein data available hota hai:

```text
"readable" event
      ↓
read() call
      ↓
Buffer se data milta hai
```

---

# 🔹 Example

```js
const readStream = fs.createReadStream(
  "chars.txt",
  { highWaterMark: 4 }
);

readStream.on("readable", () => {

  console.log(readStream.readableLength);

  console.log(readStream.read());

});
```

### `readableLength`

```js
readStream.readableLength
```

Ye batata hai ki **currently internal buffer mein kitna data available hai**.

Example:

```text
highWaterMark = 4

Internal Buffer
┌────────────┐
│ A B C D    │
└────────────┘
     ↓
readableLength = 4
```

---

# 🔹 `read()` kya karta hai?

```js
readStream.read()
```

`read()` internal buffer se data **read karke return** karta hai.

Example:

```js
readStream.on("readable", () => {
  const chunk = readStream.read();

  console.log(chunk);
});
```

Flow:

```text
Internal Buffer
      ↓
   read()
      ↓
  Buffer Chunk
```

---

# 🔥 `"data"` vs `"readable"`

Readable Stream mein data read karne ke do common approaches hain:

## 1️⃣ `"data"` Event — Automatic Reading

```js
readStream.on("data", (chunk) => {
  console.log(chunk);
});
```

Node.js automatically data ko chunks mein deta hai.

```text
File
 ↓
Internal Buffer
 ↓
Automatic chunk
 ↓
"data" callback
```

Aapko manually `read()` call karne ki zarurat nahi hoti.

---

## 2️⃣ `"readable"` Event — Manual Reading

```js
readStream.on("readable", () => {
  console.log(readStream.read());
});
```

Yahan:

```text
"readable"
     ↓
Data available
     ↓
read()
     ↓
Data manually read
```

---

# 🔹 Important Difference

```text
"data"
→ Data automatically callback mein milta hai.

"readable"
→ Stream batata hai ki data available hai,
  phir hum read() se data lete hain.
```

### Example:

```js
// Automatic
readStream.on("data", (chunk) => {
  console.log(chunk);
});
```

vs

```js
// Manual
readStream.on("readable", () => {
  console.log(readStream.read());
});
```

---

# 🧠 Internal Buffer + `readable`

```text
              Readable Stream
                    │
                    ↓
              Internal Buffer
                    │
          Data available ho gaya
                    │
                    ↓
             "readable" event
                    │
                    ↓
                read()
                    │
                    ↓
              Data / Buffer
```

---

# ⭐ Important Properties

### `readableLength`

```js
readStream.readableLength
```

➡️ Internal buffer mein **currently kitne bytes/data available hain**.

### `readableHighWaterMark`

```js
readStream.readableHighWaterMark
```

➡️ Stream ka configured **highWaterMark**.

Example:

```js
{ highWaterMark: 4 }
```

To:

```text
readableHighWaterMark = 4
```

---

# 📌 Quick Revision

```text
readable event
→ Internal buffer mein data available hone par fire hota hai.

read()
→ Internal buffer se data manually read karta hai.

readableLength
→ Buffer mein currently available data ki length.

readableHighWaterMark
→ Stream ka configured buffer/chunk size.

data event
→ Data automatically chunks mein callback ko milta hai.

readable event
→ Data available hone ka signal deta hai;
  data lene ke liye read() use karte hain.
```

### 🔥 One-line Definition

> **`readable` event ka matlab: "Stream ke internal buffer mein data available hai, ab tum `read()` se ise read kar sakte ho."**
