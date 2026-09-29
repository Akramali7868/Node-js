# 📌 Reading File Using File Descriptor

## 🔹 1. File ko Open karna — `openSync()`

```js
const fd = fs.openSync("text.txt");
```

`fs.openSync()` file ko open karta hai aur ek **File Descriptor (FD)** return karta hai.

```text
text.txt
   ↓
openSync()
   ↓
File Descriptor
```

Example:

```js
const fd = fs.openSync("text.txt");

console.log(fd);
```

Output:

```text
3
```

Yahan `3` us open file ka **File Descriptor** hai.

---

# 🔹 2. Custom Buffer banana

```js
const readBuffer = Buffer.alloc(10);
```

Yahan humne **10 bytes ka Buffer** create kiya.

```text
Buffer
┌──────────────────┐
│ 10 Bytes         │
└──────────────────┘
```

Is Buffer ke andar `fs.read()` file se read kiya hua data store karega.

### ⭐ Important

Agar aap khud Buffer nahi dete, to Node.js internally apna buffer use kar sakta hai.

Lekin:

```js
Buffer.alloc(10);
```

se hum **10 bytes ka custom Buffer** provide kar rahe hain.

---

# 🔹 3. `fs.read()`

```js
fs.read(
  fd,
  {
    buffer: readBuffer,
    position: 2,
    length: 5,
    offset: 2,
  },
  callback,
);
```

`fs.read()` ka use **File Descriptor ke through file se data read karne** ke liye hota hai.

---

# 🔹 `position`

```js
position: 2;
```

`position` batata hai ki **file ke kis byte position se reading start karni hai**.

Example:

```text
File:
A B C D E F G H
0 1 2 3 4 5 6 7
```

Agar:

```js
position: 2;
```

to reading:

```text
        ↓
A B C D E F G H
0 1 2 3 4 5 6 7
    ↑
  Start
```

`C` se start hogi.

---

# 🔹 `length`

```js
length: 5;
```

`length` batata hai ki **maximum kitne bytes file se read karne hain**.

Agar:

```js
position: 2,
length: 5
```

to:

```text
File:
A B C D E F G H
    └──────┘
    5 bytes
```

`C D E F G` read honge.

---

# 🔹 `offset`

```js
offset: 2;
```

`offset` **file ke andar position nahi batata**.

Ye batata hai ki Buffer ke **kis index se read kiya hua data store karna start hoga**.

Example:

```text
Buffer = 10 bytes

Index:
0 1 2 3 4 5 6 7 8 9
```

Agar:

```js
offset: 2;
```

to data Buffer ke index `2` se store hoga.

```text
Buffer:

0 1 2 3 4 5 6 7 8 9
    ↑
  Data starts here
```

---

# 🔥 Complete Example

```js
import fs from "fs";

const fd = fs.openSync("text.txt");

const readBuffer = Buffer.alloc(10);

fs.read(
  fd,
  {
    buffer: readBuffer,
    position: 2,
    length: 5,
    offset: 2,
  },
  (err, bytesRead, buffData) => {
    console.log(err);
    console.log(bytesRead);
    console.log(buffData.toString());
  },
);
```

### Iska meaning:

```text
File
 ↓
position: 2
 ↓
File ke position 2 se reading
 ↓
length: 5
 ↓
Maximum 5 bytes read
 ↓
offset: 2
 ↓
Buffer ke index 2 se data store
```

---

# 🧠 `position` vs `offset`

Ye dono sabse important difference hai:

```text
position
→ File mein kahan se READ karna hai

offset
→ Buffer mein kahan se DATA STORE karna hai
```

Example:

```text
File                          Buffer
────                          ──────
A B C D E F G                 0 1 2 3 4 5 6...
    ↑                              ↑
 position: 2                   offset: 2
```

---

# ⭐ `length`

```text
length
→ File se maximum kitne bytes READ karne hain
```

Example:

```js
length: 5;
```

→ Maximum **5 bytes** read honge.

---

# 📌 Quick Revision

```text
fs.openSync()
→ File open karta hai
→ File Descriptor deta hai

Buffer.alloc(10)
→ 10 bytes ka Buffer banata hai

fs.read()
→ File Descriptor se data read karta hai

position
→ File mein kis position se reading start hogi

length
→ Maximum kitne bytes read karne hain

offset
→ Buffer ke kis position/index se data store hoga

bytesRead
→ Actually kitne bytes read hue
```

### 🔥 One-Line Memory Trick

```text
position → File mein kahan se READ?
length   → Kitna READ?
offset   → Buffer mein kahan WRITE?
```
