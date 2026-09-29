# 📌 Node.js Readable Stream — Important Events

```js
import fs from "fs";

const readStream = fs.createReadStream(
  "chars.txt",
  { highWaterMark: 4 }
);

readStream.setEncoding("utf-8");

readStream.on("data", (chunk) => {
  console.log(chunk);
});

readStream.on("close", () => {
  console.log("Closed");
});

readStream.on("end", () => {
  console.log("End");
});

readStream.destroy(new Error("Err"));

readStream.on("error", (err) => {
  console.log(err);
});

readStream.on("open", (data) => {
  console.log("Opened", data);
});

readStream.on("ready", () => {
  console.log("Ready");
});
```

---

# 🔹 1. `setEncoding("utf-8")`

```js
readStream.setEncoding("utf-8");
```

Normally stream ka `chunk` **Buffer** hota hai.

```text
Without setEncoding()
→ Buffer
```

Lekin:

```js
setEncoding("utf-8")
```

lagane ke baad:

```text
With setEncoding("utf-8")
→ String
```

Example:

```js
readStream.on("data", (chunk) => {
  console.log(chunk);
});
```

`chunk` ab UTF-8 string milega.

---

# 🔹 2. `"data"` Event

```js
readStream.on("data", (chunk) => {
  console.log(chunk);
});
```

Jab stream se data consumer ko milta hai, `"data"` event fire hota hai.

```text
File
 ↓
Internal Buffer
 ↓
Chunk
 ↓
"data" event
 ↓
Callback
```

`"data"` listener attach karne se Readable Stream **flowing mode** mein chali jaati hai.

---

# 🔹 3. `"open"` Event

```js
readStream.on("open", (fd) => {
  console.log("Opened", fd);
});
```

`fs.createReadStream()` jab file ko open karta hai aur **file descriptor (`fd`) available** ho jata hai, `"open"` event fire hota hai.

Example:

```text
File
 ↓
Open
 ↓
File Descriptor (fd)
 ↓
"open" event
```

`fd` ek number hota hai jo operating system ke open file resource ko represent karta hai.

---

# 🔹 4. `"ready"` Event

```js
readStream.on("ready", () => {
  console.log("Ready");
});
```

`"ready"` ka matlab:

> Stream ka file descriptor ready hai aur stream reading ke liye ready hai.

Usually `open` ke baad `ready` event aata hai.

```text
open
  ↓
ready
  ↓
data
```

---

# 🔹 5. `"end"` Event

```js
readStream.on("end", () => {
  console.log("End");
});
```

Jab stream ka **saara data successfully consume ho jaata hai**, `"end"` event fire hota hai.

```text
File
 ↓
Chunk
 ↓
Chunk
 ↓
Chunk
 ↓
All data consumed
 ↓
"end"
```

⚠️ Agar stream ko error ke saath destroy kar diya gaya, to normal `"end"` event nahi aata.

---

# 🔹 6. `"error"` Event

```js
readStream.on("error", (err) => {
  console.log(err);
});
```

Jab stream mein error hota hai, `"error"` event fire hota hai.

Example:

```js
readStream.destroy(new Error("Something went wrong"));
```

Then:

```text
destroy(error)
      ↓
"error"
      ↓
Error object
```

`err` mein actual `Error` object milta hai.

---

# 🔹 7. `"close"` Event

```js
readStream.on("close", () => {
  console.log("Closed");
});
```

Jab stream aur uske underlying resources, jaise **file descriptor**, close ho jaate hain, `"close"` event fire hota hai.

Important:

```text
"end"
→ Reading successfully complete

"close"
→ Stream/resource closed
```

`"close"` error ke baad bhi aa sakta hai.

---

# 🔥 `destroy()` kya karta hai?

```js
readStream.destroy(new Error("Err"));
```

`destroy()` stream ko **immediately destroy/close** karne ke liye use hota hai.

Agar error pass kiya:

```js
destroy(new Error("Err"))
```

to:

```text
destroy()
   ↓
error event
   ↓
close event
```

Normal successful completion mein:

```text
data
 ↓
end
 ↓
close
```

Error/destroy case mein generally:

```text
error
 ↓
close
```

`end` nahi aata.

Node.js docs ke according `destroy(error)` error ko `'error'` event ke payload ke roop mein emit kar sakta hai, aur stream close hoti hai.

---

# ⚠️ `destroy('Err')` vs `destroy(new Error('Err'))`

Aapke original code mein:

```js
readStream.destroy("Err");
```

likha tha.

Better practice:

```js
readStream.destroy(new Error("Err"));
```

Kyuki `destroy()` ka optional argument **`Error` object** hota hai.

---

# 🧠 Complete Event Flow

### Successful reading

```text
createReadStream()
       ↓
     open
       ↓
     ready
       ↓
     data
       ↓
     data
       ↓
     data
       ↓
      end
       ↓
     close
```

### Error / Destroy

```text
createReadStream()
       ↓
     open
       ↓
     ready
       ↓
   destroy(error)
       ↓
     error
       ↓
     close
```

---

# ⭐ Quick Revision

```text
setEncoding("utf-8")
→ Buffer ko UTF-8 String chunks mein deta hai

"open"
→ File successfully open hui, fd available

"ready"
→ Stream reading ke liye ready

"data"
→ Data chunk consumer ko mila

"end"
→ Saara data consume ho gaya

"error"
→ Stream mein error hua

"close"
→ Stream/resource close ho gaya

destroy(error)
→ Stream ko forcefully destroy karta hai
```

### 🔥 One-line Memory Trick

```text
OPEN → READY → DATA → END → CLOSE
                  ↓
                ERROR
                  ↓
                CLOSE
```

**Important:** `"data"` aur `"readable"` dono ko ek hi Readable Stream par normally mix nahi karna chahiye; Node.js documentation bhi ek consumption style choose karne ki recommendation deti hai.
