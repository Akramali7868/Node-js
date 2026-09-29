# 📌 Why Are Streams So Fast?

Streams often large/sequential data ko `writeFile` / `appendFile` ke repeated calls se zyada efficiently handle kar sakti hain.

---

# 1️⃣ `appendFileSync()` / Repeated File Operations

Agar hum repeatedly:

```js
fs.appendFileSync("numbers.txt", data);
```

karte hain, to har call ek separate file-system operation hota hai.

Conceptually:

```text
data
 ↓
File operation
 ↓
Wait
 ↓
Next data
 ↓
File operation
 ↓
Wait
 ↓
...
```

Agar 5000 baar `appendFileSync()` call kiya:

```text
5000 individual file operations
```

Aur `Sync` hone ki wajah se har operation complete hone tak JavaScript execution wait karta hai.

---

# 2️⃣ `createWriteStream()`

```js
const writeStream = fs.createWriteStream("numbers.txt");
```

Jab Writable Stream create hoti hai, Node.js file ko writing ke liye open karta hai.

Uske baad:

```js
writeStream.write(data);
```

baar-baar use kiya ja sakta hai.

```text
Data
 ↓
write()
 ↓
Internal Buffer (Memory)
 ↓
Underlying File System
 ↓
File
```

---

# 3️⃣ Internal Buffer

Writable Stream data ko internally **buffer/queue** kar sakti hai.

```js
writeStream.write("Hello");
writeStream.write("World");
writeStream.write("!");
```

Data pehle stream ke buffering mechanism mein queue ho sakta hai.

Memory mein data handle karna generally disk I/O se faster hota hai.

```text
Application
    ↓
Internal Buffer
    ↓
File System
    ↓
Disk
```

---

# 4️⃣ `highWaterMark`

Example:

```js
const writeStream = fs.createWriteStream("numbers.txt", {
  highWaterMark: 4,
});
```

`highWaterMark` Writable Stream ke **buffering/backpressure threshold** ko define karta hai.

```text
highWaterMark = 4
```

Iska matlab ye **exactly "4 bytes fill hote hi disk par write karo"** nahi hai.

Instead, jab buffered data high-water threshold tak pahunchta hai, `write()` **`false` return** kar sakta hai.

```text
write()
   ↓
Buffer fills
   ↓
write() → false
   ↓
Backpressure
   ↓
Wait for "drain"
```

---

# 5️⃣ `write()` ka Return Value

```js
const canContinue = writeStream.write(data);
```

### `true`

```text
true
 ↓
Buffer manageable
 ↓
Continue writing
```

### `false`

```text
false
 ↓
Backpressure
 ↓
Writing temporarily slow/stop
 ↓
"drain"
 ↓
Continue writing
```

---

# 6️⃣ `end()` kyun use karte hain?

```js
writeStream.end();
```

`end()` ka matlab:

> **Ab stream ko aur data nahi milega.**

Ye stream ko batata hai ki writing complete karni hai.

```text
write()
write()
write()
write()
   ↓
end()
   ↓
Remaining buffered data process
   ↓
Writing complete
   ↓
"finish"
```

Example:

```js
const writeStream = fs.createWriteStream("numbers.txt");

writeStream.write("Hello ");
writeStream.write("World");

writeStream.end();

writeStream.on("finish", () => {
  console.log("Writing completed");
});
```

---

# 🔥 Why Stream Is Efficient?

```text
Repeated appendFileSync()

Data
 ↓
File operation
 ↓
WAIT
 ↓
Data
 ↓
File operation
 ↓
WAIT
 ↓
...
```

vs.

```text
WriteStream

Data
 ↓
write()
 ↓
Internal Buffer
 ↓
Efficient asynchronous I/O
 ↓
File
```

### Main Reasons:

```text
1. File ko repeatedly open/close karne ki need nahi hoti.
2. Data stream ke internal buffering mechanism se handle hota hai.
3. Har write ke liye synchronous wait nahi karna padta.
4. Large/sequential data ko chunks/buffer ke through efficiently process kiya ja sakta hai.
5. Backpressure system fast producer aur slower destination ke beech flow ko control karta hai.
```

---

# ⭐ Quick Revision

```text
createWriteStream()
→ File writing ke liye Writable Stream create karta hai.

write()
→ Data ko Writable Stream mein queue/buffer karta hai.

Internal Buffer
→ Data ko temporarily memory mein hold/queue karta hai.

highWaterMark
→ Buffering/backpressure ka threshold.

write() → false
→ Backpressure; aur writing temporarily control karni chahiye.

drain
→ Writable Stream dobara data accept karne ke liye ready.

end()
→ "Ab aur data nahi aayega."

finish
→ Writable Stream ki writing complete ho gayi.
```

### 🔥 One-Line Memory Trick

```text
createWriteStream()
        ↓
File Open
        ↓
write()
        ↓
Internal Buffer
        ↓
Backpressure if needed
        ↓
Underlying File System
        ↓
end()
        ↓
finish
```
