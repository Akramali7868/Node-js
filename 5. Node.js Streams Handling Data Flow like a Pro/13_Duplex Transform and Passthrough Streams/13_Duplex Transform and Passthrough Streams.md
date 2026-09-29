# 📌 Node.js Streams — Duplex, PassThrough & Transform Stream

# 1️⃣ Duplex Stream

## 🔹 Duplex Stream kya hoti hai?

**Duplex Stream** mein hum **data ko write bhi kar sakte hain aur read bhi kar sakte hain**.

```text
        Duplex Stream
       ┌─────────────┐
WRITE ─→│             │─→ READ
       └─────────────┘
```

### Example:

```js
socket.write("Hello");
```

➡️ Data write/send kar rahe hain.

```js
socket.on("data", (chunk) => {
  console.log(chunk);
});
```

➡️ Data read/receive kar rahe hain.

### ⭐ Definition

> **Duplex Stream = Read + Write dono kar sakne wali Stream.**

---

# 2️⃣ PassThrough Stream

## 🔹 PassThrough Stream kya hoti hai?

**PassThrough Stream ek special type ki Duplex Stream hai** jo data ko **read karke bina modify kiye same data ko output/write side par pass kar deti hai.**

```text
Input Data
    ↓
PassThrough
    ↓
Same Data
```

### Example:

```text
Input:
Hello World

PassThrough:

Output:
Hello World
```

Data mein koi transformation nahi hota.

```text
ABC
 ↓
PassThrough
 ↓
ABC
```

### ⭐ Definition

> **PassThrough Stream = Data ko receive/read karke bina change kiye same data ko pass karne wali Duplex Stream.**

---

# 3️⃣ Transform Stream

## 🔹 Transform Stream kya hoti hai?

**Transform Stream bhi Duplex Stream hoti hai**, lekin isme input data ko **modify/transform karke output diya ja sakta hai**.

```text
Input Data
    ↓
Transform
    ↓
Modified Data
```

### Example

```text
Input:
hello

Transform:
UPPERCASE

Output:
HELLO
```

Yaani:

```text
hello
 ↓
Transform
 ↓
HELLO
```

---

# 🔥 PassThrough vs Transform

```text
PassThrough
→ Data ko change nahi karta.

Transform
→ Data ko modify/transform kar sakta hai.
```

### Example:

```text
PassThrough:

"hello"
   ↓
"hello"


Transform:

"hello"
   ↓
"HELLO"
```

---

# 🧠 Stream Types ka Comparison

```text
                READ       WRITE
                 ↓           ↓

Readable         ✅          ❌

Writable         ❌          ✅

Duplex           ✅          ✅

PassThrough      ✅          ✅
                 ↓
             Same Data

Transform        ✅          ✅
                 ↓
          Modified Data
```

---

# 🔥 Easy Flow

### Readable

```text
Source → READ
```

### Writable

```text
WRITE → Destination
```

### Duplex

```text
WRITE ↔ READ
```

### PassThrough

```text
INPUT → SAME DATA → OUTPUT
```

### Transform

```text
INPUT → TRANSFORM → OUTPUT
```

---

# ⭐ One-Line Revision

```text
Readable
→ Sirf READ

Writable
→ Sirf WRITE

Duplex
→ READ + WRITE

PassThrough
→ READ + WRITE, but data ko change nahi karta

Transform
→ READ + WRITE, aur data ko transform/modify karta hai
``