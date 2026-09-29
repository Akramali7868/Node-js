# 📌 Node.js Writable Stream — `createWriteStream()`

## 🔹 `createWriteStream()` kya karta hai?

`fs.createWriteStream()` ka use **file mein data ko stream/chunks ke through write karne** ke liye hota hai.

```js
const writeStream = fs.createWriteStream("streams.mp4");
```

Yahan:

```text
streams.mp4
     ↑
     │
writeStream
```

`writeStream` ek **Writable Stream** hai, jiske through hum file mein data write kar sakte hain.

---

# 🔹 `writeStream.write()`

```js
writeStream.write("abc");
```

`write()` ka use stream ke through **data write karne** ke liye hota hai.

Is example mein:

```text
"abc"
 ↓
Writable Stream
 ↓
streams.mp4
```

File ke andar:

```text
abc
```

write ho jayega.

---

# 🔹 Complete Example

```js
import fs from "fs";

const writeStream = fs.createWriteStream("streams.mp4");

writeStream.write("abc");
```

### Flow

```text
Program
   ↓
createWriteStream()
   ↓
Writable Stream
   ↓
write("abc")
   ↓
Internal Buffer
   ↓
streams.mp4
```

---

# 🔹 Multiple `write()` Calls

Hum multiple times `write()` call kar sakte hain:

```js
writeStream.write("Hello ");
writeStream.write("World");
writeStream.write("!");
```

Result:

```text
Hello World!
```

Yaani data **sequence/order mein** write hota hai.

---

# 🔹 `write()` kya return karta hai?

```js
const result = writeStream.write("abc");

console.log(result);
```

`write()` **boolean value** return karta hai:

```text
true
false
```

### `true`

Stream abhi aur data accept kar sakti hai.

### `false`

Writable stream ka internal buffer high level par pahunch gaya hai.

Is situation mein hume `"drain"` event ka wait karna chahiye.

---

# 🔹 `end()`

Jab saara data write ho jaye:

```js
writeStream.end();
```

`end()` stream ko batata hai:

> "Ab mera aur data write karna complete ho gaya."

Example:

```js
writeStream.write("Hello ");
writeStream.write("World");

writeStream.end();
```

Flow:

```text
write("Hello ")
      ↓
write("World")
      ↓
end()
      ↓
Writing Complete
```

---

# 🔹 `finish` Event

Jab saara data successfully write ho jaata hai aur stream finish ho jaati hai:

```js
writeStream.on("finish", () => {
  console.log("Writing completed");
});
```

Example:

```js
writeStream.write("Hello");
writeStream.end();

writeStream.on("finish", () => {
  console.log("Done");
});
```

---

# ⭐ Quick Revision

```text
createWriteStream()
→ File ke liye Writable Stream create karta hai.

write(data)
→ Stream mein data write karta hai.

end()
→ Batata hai ki ab aur data nahi hai.

finish
→ Saara data successfully write hone ke baad fire hota hai.

write() → true
→ Stream aur data accept kar sakti hai.

write() → false
→ Buffer temporarily full/high hai; "drain" ka wait kar sakte hain.
```

### 🔥 One-line Definition

> **`createWriteStream()` large data ko continuously/chunks mein file mein write karne ke liye Writable Stream create karta hai.**
