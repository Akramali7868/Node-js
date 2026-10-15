# Controlling Data Transfer Speeds

## 1. Normal `pipe()` kya karta hai?

Agar hum:

```js
readStream.pipe(socket);
```

karte hain, toh Readable Stream ka data automatically socket/Writable Stream mein transfer hota hai.

`pipe()` **backpressure ko automatically handle** karta hai.

Simple flow:

```text
File
 ↓
readStream
 ↓
pipe()
 ↓
socket
 ↓
Network
 ↓
Client
```

Agar destination/socket slow hai, stream ka flow automatically control/pause ho sakta hai.

---

# 2. Backpressure kya hai?

Backpressure tab hota hai jab:

```text
Source fast
     ↓
Destination slow
```

Example:

```text
File Read Speed
100 MB/s

        ↓

Network/Socket
10 MB/s
```

Agar source continuously fast data read karta rahe, toh memory mein data accumulate ho sakta hai.

Is situation ko **backpressure** kehte hain.

Simple example:

```text
Fast Producer
     ↓↓↓↓↓↓↓↓↓
Slow Consumer
     ↓
  Problem
```

---

# 3. `pipe()` backpressure ko handle karta hai

```js
readStream.pipe(socket);
```

`pipe()` source aur destination ke flow ko coordinate karta hai.

Conceptually:

```text
        Data
         ↓
readStream ─────────→ socket
    ↑                   ↓
    └── backpressure ───┘
```

Agar destination temporarily data accept nahi kar pa raha hai, source ko pause kiya ja sakta hai.

Jab destination dobara ready hota hai, reading resume ho sakti hai.

### Important

> `pipe()` ka purpose **speed ko intentionally slow karna nahi**, balki source aur destination ke flow ko safely coordinate karna hai.

---

# 4. Agar hume intentionally speed slow karni ho?

Agar aap chahte ho ki file:

```text
Fastest possible speed
```

par nahi, balki controlled speed par send ho, toh aap manually stream ko pause/resume kar sakte ho.

Example:

```js
readStream.on("data", (chunk) => {
  socket.write(chunk);

  readStream.pause();

  setTimeout(() => {
    readStream.resume();
  }, 10);
});
```

---

# 5. Code step-by-step

### Step 1

```js
readStream.on("data", (chunk) => {
```

Jab Readable Stream ko data ka chunk milta hai, `data` event fire hota hai.

```text
File
 ↓
Chunk
 ↓
"data" event
```

---

### Step 2

```js
socket.write(chunk);
```

Jo chunk mila, usko socket par send kar diya.

```text
File
 ↓
chunk
 ↓
socket
 ↓
network
```

---

### Step 3

```js
readStream.pause();
```

Ab temporarily file se aur data read karna pause kar dete hain.

Important:

> `pause()` network ko directly slow nahi karta. Ye **Readable Stream se aur data read/emit hone ko temporarily stop** karta hai.

---

### Step 4

```js
setTimeout(() => {
  readStream.resume();
}, 10);
```

10 milliseconds ke baad:

```js
readStream.resume();
```

stream ko dobara continue karne ke liye bolta hai.

Flow:

```text
Read chunk
   ↓
socket.write(chunk)
   ↓
pause()
   ↓
wait 10 ms
   ↓
resume()
   ↓
Read next chunk
   ↓
socket.write()
   ↓
pause()
   ↓
...
```

---

# 6. Complete flow

```text
              ┌──────────────┐
              │   File       │
              └──────┬───────┘
                     ↓
                Read Stream
                     ↓
                  Chunk
                     ↓
               socket.write()
                     ↓
                   pause
                     ↓
                  10 ms
                     ↓
                  resume
                     ↓
                Next Chunk
                     ↓
                   pause
                     ↓
                    ...
```

---

# 7. Isse speed kaise control hoti hai?

Suppose:

```text
Chunk size = 100 KB
Delay      = 10 ms
```

Har chunk ke beech delay add karne se transfer intentionally slow ho sakta hai.

Lekin exact network speed:

```text
100 KB / 10 ms
```

jitni simply guarantee nahi hoti, kyunki `socket.write()`, OS buffers, TCP congestion control, network conditions aur receiver speed bhi matter karte hain.

So:

> **Pause/resume application-level throttling ka ek simple method hai, exact bandwidth limiter nahi.**

---

# 8. `socket.write()` ka return value

Manual backpressure handling mein ye bhi important hai:

```js
const canContinue = socket.write(chunk);
```

`socket.write()` boolean return kar sakta hai.

Conceptually:

```text
true
 ↓
Writable buffer mein aur data accept ho raha hai

false
 ↓
Writable buffer full/pressure high
 ↓
"drain" ka wait karo
```

Example:

```js
readStream.on("data", (chunk) => {
  const canContinue = socket.write(chunk);

  if (!canContinue) {
    readStream.pause();

    socket.once("drain", () => {
      readStream.resume();
    });
  }
});
```

Ye **actual backpressure handling** ke closer hai.

---

# 9. Intentional delay + backpressure

Agar aap dono karna chahte ho:

```js
readStream.on("data", (chunk) => {
  const canContinue = socket.write(chunk);

  if (!canContinue) {
    readStream.pause();

    socket.once("drain", () => {
      setTimeout(() => {
        readStream.resume();
      }, 10);
    });

    return;
  }

  readStream.pause();

  setTimeout(() => {
    readStream.resume();
  }, 10);
});
```

Lekin real applications mein usually manually itna complex code likhne ke bajay `pipe()` ya proper stream mechanisms use kiye jaate hain.

---

# 10. Browser bhi backpressure handle karta hai?

Haan, browser/network stack received data ko apni capacity ke according process karta hai.

Conceptually:

```text
Server
  ↓
TCP
  ↓
Browser
  ↓
ReadableStream
  ↓
JavaScript / Consumer
```

Agar browser-side consumer data ko slowly read/process karta hai, stream APIs aur underlying networking stack flow ko coordinate kar sakte hain.

Browser mein Fetch API ka example:

```js
const response = await fetch("/large-file");

const reader = response.body.getReader();

while (true) {
  const { done, value } = await reader.read();

  if (done) break;

  console.log(value);
}
```

Yahan:

```text
response.body
```

ek `ReadableStream` ho sakti hai.

---

# 11. Browser `pause()` / `resume()` exactly same nahi

Important distinction:

Node.js:

```js
readStream.pause();
readStream.resume();
```

Readable stream ke methods hain.

Browser Fetch Streams mein usually same `pause()` / `resume()` API directly use nahi hoti.

Browser mein stream consumption ko control karne ke liye:

```js
reader.read()
```

ya Streams API mechanisms use hote hain.

Isliye notes mein ye likhna better hai:

> **Browser bhi streaming/backpressure mechanisms use karta hai, lekin browser Fetch `ReadableStream` ka API Node.js Readable Stream ke `pause()` / `resume()` methods ke exactly same nahi hai.**

---

# 12. `pipe()` vs Manual Control

| Method | Purpose |
|---|---|
| `readStream.pipe(socket)` | Automatic stream transfer + backpressure handling |
| `readStream.pause()` | Readable stream temporarily pause |
| `readStream.resume()` | Readable stream resume |
| `socket.write(chunk)` | Chunk socket par write |
| `socket.write()` return value | Writable buffer pressure ka indication |
| `socket.on("drain")` | Writable dobara data accept karne ke liye ready |

---

# 13. Most important difference

### Normal `pipe()`

```js
readStream.pipe(socket);
```

```text
Fast source
    ↓
 pipe()
    ↓
Backpressure handled
    ↓
Destination
```

### Intentional throttling

```js
readStream.on("data", (chunk) => {
  socket.write(chunk);

  readStream.pause();

  setTimeout(() => {
    readStream.resume();
  }, 10);
});
```

```text
Chunk
 ↓
Write
 ↓
Pause
 ↓
Wait
 ↓
Resume
 ↓
Next chunk
```

Yahan hum **jaan-bujhkar delay** add kar rahe hain.

---

# 14. Real-life example 🚰

Imagine:

```text
Water Tank
   ↓
Pipe
   ↓
Bucket
```

### `pipe()`

Pipe automatically flow ko manage karne mein help karta hai.

### `pause()`

```text
🚰 → STOP
```

### `resume()`

```text
🚰 → START
```

### 10 ms delay

```text
START
 ↓
100 KB
 ↓
STOP
 ↓
10 ms wait
 ↓
START
 ↓
100 KB
 ↓
STOP
 ↓
...
```

---

# 🧠 Quick Revision

### `pipe()`

> Readable stream se Writable stream tak data transfer karta hai aur backpressure ko handle karta hai.

### `pause()`

> Readable stream se data flow temporarily stop karta hai.

### `resume()`

> Readable stream ka data flow dobara start karta hai.

### `socket.write()`

> Data ko socket ke writable side par write karta hai.

### `drain`

> Jab writable buffer mein space available ho jaata hai, `drain` event signal deta hai ki writing resume ki ja sakti hai.

### Backpressure

```text
Producer fast
     ↓
Consumer slow
     ↓
Backpressure
```

### Intentional throttling

```text
Chunk
 ↓
Write
 ↓
Pause
 ↓
Delay
 ↓
Resume
 ↓
Next Chunk
```

## One-line summary

> **`pipe()` normal data flow aur backpressure ko automatically manage karta hai, jabki `pause()` + `resume()` ka use karke hum application level par data reading ko intentionally slow/control kar sakte hain.**
