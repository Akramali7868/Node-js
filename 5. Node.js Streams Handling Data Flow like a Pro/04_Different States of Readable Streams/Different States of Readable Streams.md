# 📌 Node.js Readable Stream State

## 🔹 Stream ka State Check Karna

Readable Stream mein `readableFlowing` property se pata chalta hai ki stream **flowing mode mein hai ya nahi**.

```js
readStream.readableFlowing
```

### `readableFlowing` ki values:

```text
null
true
false
```

---

## 🔹 1. `readableFlowing === null`

```js
readStream.readableFlowing === null
```

➡️ Stream ki **initial state** hoti hai.

Matlab abhi stream **flowing mode mein start nahi hui hai**.

Example:

```js
const readStream = fs.createReadStream("chars.txt");

console.log(readStream.readableFlowing);
// null
```

---

## 🔹 2. `readableFlowing === true`

```js
readStream.readableFlowing === true
```

➡️ Stream **flowing mode** mein hai.

Jab hum:

```js
readStream.on("data", callback);
```

lagate hain, stream generally flowing mode mein chali jaati hai.

Is mode mein data automatically chunks mein aata hai aur `"data"` event fire hota hai.

```text
Stream
  ↓
Flowing Mode
  ↓
Chunk
  ↓
"data" event
  ↓
Callback
```

---

## 🔹 3. `readableFlowing === false`

```js
readStream.readableFlowing === false
```

➡️ Stream **paused state** mein hai.

Jab:

```js
readStream.pause();
```

call karte hain, stream flowing se paused state mein chali jaati hai.

```text
true
 ↓
pause()
 ↓
false
```

---

# 🔥 `pause()` aur `resume()`

### `pause()`

```js
readStream.pause();
```

➡️ Stream temporarily data flow karna stop kar deti hai.

```text
Flowing
  ↓
pause()
  ↓
Paused
```

`readableFlowing`:

```text
true → false
```

---

### `resume()`

```js
readStream.resume();
```

➡️ Stream ko dobara flowing mode mein start karta hai.

```text
Paused
  ↓
resume()
  ↓
Flowing
```

`readableFlowing`:

```text
false → true
```

---

# 🔹 `readableHighWaterMark`

```js
const { readableHighWaterMark } = readStream;
```

Ye batata hai ki stream ka **configured highWaterMark** kitna hai.

Example:

```js
const readStream = fs.createReadStream(
  "chars.txt",
  { highWaterMark: 4 }
);
```

To:

```text
readableHighWaterMark = 4 bytes
```

---

# 🔹 `bytesRead`

```js
const { bytesRead } = readStream;
```

`bytesRead` batata hai ki stream ne **ab tak total kitne bytes read kiye hain**.

Example:

```text
File size = 12 bytes
highWaterMark = 4

1st chunk → bytesRead = 4
2nd chunk → bytesRead = 8
3rd chunk → bytesRead = 12
```

---

# 🔹 Code ka Logic

```js
import fs from "fs";

const readStream = fs.createReadStream(
  "chars.txt",
  { highWaterMark: 4 }
);

readStream.on("data", (chunk) => {

  const { readableHighWaterMark, bytesRead } = readStream;

  if (readableHighWaterMark === bytesRead) {

    fs.writeFileSync("abc.txt", chunk);

  } else {

    fs.appendFileSync("abc.txt", chunk);

  }

  readStream.pause();

  setTimeout(() => {
    readStream.resume();
  }, 100);

});
```

### Isme kya ho raha hai?

```text
File
 ↓
4 bytes ka chunk
 ↓
"data" event
 ↓
bytesRead check
 ↓
writeFileSync / appendFileSync
 ↓
pause()
 ↓
100ms wait
 ↓
resume()
 ↓
Next chunk
```

---

# 🧠 Important Difference

```text
readableFlowing
        ↓
Stream ki CURRENT STATE batata hai

readableHighWaterMark
        ↓
Configured chunk/buffer size batata hai

bytesRead
        ↓
Ab tak total kitne bytes read hue batata hai
```

### Quick Revision

```text
readableFlowing = null
→ Initial state

readableFlowing = true
→ Flowing mode

readableFlowing = false
→ Paused mode

pause()
→ true → false

resume()
→ false → true

readableHighWaterMark
→ Configured highWaterMark

bytesRead
→ Total bytes read so far
```

⚠️ **Note:** `readableFlowing === null` ko sirf "initial state" yaad rakhna useful hai, lekin technically iska matlab hai ki stream **flowing mode mein nahi hai aur koi `'data'` listener/piping etc. usse flowing mode mein nahi le gaya hai**. Ye hamesha sirf object banate hi initial state ho, zaroori nahi.
