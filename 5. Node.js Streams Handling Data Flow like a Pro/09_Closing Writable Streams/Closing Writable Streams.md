# 📌 Writable Stream — Backpressure

## 🔹 Basic Code

```js
import fs from "fs";

const writeStream = fs.createWriteStream("file.txt", { highWaterMark: 4 });

let i = 1;

while (i <= 100) {
  console.log(writeStream.writableLength);

  let isEmpty = writeStream.write("a");

  i++;

  if (!isEmpty) {
    break;
  }

  console.log(isEmpty);
}

writeStream.on("drain", () => {
  console.log(writeStream.writableLength);

  while (i <= 100) {
    console.log(writeStream.writableLength);

    let isEmpty = writeStream.write("a");

    i++;

    if (!isEmpty) {
      break;
    }

    console.log(isEmpty);
  }

  i++;
});
```

---

# 🔹 `writableLength`

```js
writeStream.writableLength;
```

Ye batata hai ki **Writable Stream ke internal buffer mein currently kitna data queued hai**.

Example:

```js
{
  highWaterMark: 4;
}
```

Agar buffer mein 3 bytes pending hain:

```text
writableLength = 3
```

Agar 4 bytes pending hain:

```text
writableLength = 4
```

---

# 🔹 `write()` ka Return Value

```js
const isEmpty = writeStream.write("a");
```

`write()` **boolean** return karta hai:

```text
true
false
```

### `true`

```text
true
↓
Buffer abhi manageable hai
↓
Aur data write kar sakte ho
```

### `false`

```text
false
↓
Internal buffer highWaterMark level ke paas/above pahunch gaya
↓
Abhi aur data continuously write nahi karna
↓
"drain" event ka wait karo
```

---

# 🔥 `highWaterMark`

```js
{
  highWaterMark: 4;
}
```

Yahan Writable Stream ka high-water threshold **4 bytes** set kiya gaya hai.

```text
highWaterMark = 4
```

⚠️ Important:

`highWaterMark` ka matlab **"sirf 4 bytes hi write honge"** nahi hai.

Ye mainly stream ko batata hai ki **buffer ko kitna data comfortably queue karna chahiye before backpressure kicks in**.

---

# 🔹 Backpressure kya hai?

Jab hum data ko bahut fast write kar rahe hain lekin underlying destination utni speed se data process nahi kar pa raha, to data Writable Stream ke internal buffer mein accumulate hone lagta hai.

Is situation ko handle karne ke mechanism ko **Backpressure** kehte hain.

```text
Producer
   ↓
Fast data
   ↓
Writable Stream Buffer
   ↓
Destination/File
   ↓
Slow
```

Agar buffer zyada fill ho raha hai:

```text
write() → false
```

To hume writing temporarily rokni chahiye.

---

# 🔹 `"drain"` Event

```js
writeStream.on("drain", () => {
  // Continue writing
});
```

`"drain"` event tab fire hota hai jab Writable Stream ne apne buffered data ko sufficiently process kar liya ho aur **dobara data accept karne ke liye ready** ho.

Flow:

```text
write()
  ↓
write() returns false
  ↓
STOP writing
  ↓
Buffer data process hota hai
  ↓
"drain" event
  ↓
Writing resume
```

---

# 🔥 Aapke Code ka Flow

## Step 1 — Initial `while`

```js
while (i <= 100) {
```

Program `"a"` ko repeatedly write karta hai.

```js
let isEmpty = writeStream.write("a");
```

Har baar `"a"` buffer mein add hota hai.

---

## Step 2 — `write()` returns `true`

Jab:

```js
isEmpty === true;
```

to loop continue karta hai.

```text
write("a")
 ↓
true
 ↓
next write
```

---

## Step 3 — `write()` returns `false`

Ek point par:

```js
isEmpty === false;
```

ho jayega.

Then:

```js
if (!isEmpty) {
  break;
}
```

`while` loop stop ho jayega.

```text
write("a")
   ↓
false
   ↓
break
   ↓
STOP WRITING
```

---

# 🔹 Step 4 — `drain`

Ab:

```js
writeStream.on("drain", () => {
```

wait karta hai.

Jab buffer sufficiently empty/process ho jata hai:

```text
"drain"
   ↓
callback executes
```

Phir code dobara:

```js
while (i <= 100) {
```

se writing continue karta hai.

---

# 🧠 Complete Concept

```text
             write("a")
                 ↓
          Internal Buffer
                 ↓
       writableLength increase
                 ↓
       write() → true ?
          ↙           ↘
       YES             NO
        ↓               ↓
  Continue writing    Stop writing
                        ↓
                  Wait for drain
                        ↓
                    "drain"
                        ↓
                Continue writing
```

---

# ⭐ Important Properties

```text
writableLength
→ Internal buffer mein currently queued data

writableHighWaterMark
→ Writable stream ka highWaterMark

write(data)
→ Data ko stream ke buffer mein write/queue karta hai

write() === true
→ Abhi aur data write kar sakte hain

write() === false
→ Backpressure; writing temporarily stop karke drain ka wait karein

"drain"
→ Buffer sufficiently clear ho gaya; writing resume kar sakte hain
```

# 📌 One-Line Memory Trick

```text
write() → true
   ↓
Keep Writing

write() → false
   ↓
Stop Writing

"drain"
   ↓
Start Writing Again
```

## 🔥 `readable` vs `writable`

```text
Readable Stream
→ Data ko READ karta hai
→ "data", "readable"

Writable Stream
→ Data ko WRITE karta hai
→ write(), "drain", "finish"
```
