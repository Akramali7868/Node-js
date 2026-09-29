# 📌 Node.js Standard Streams

Node.js process ke paas 3 standard streams hoti hain:

```text
stdin   → 0
stdout  → 1
stderr  → 2
```

In numbers ko **File Descriptor (FD)** kaha jata hai.

---

# 1️⃣ Standard Input — `stdin`

```js
process.stdin
```

### 🔹 Kya hai?

`stdin` ka use program mein **input receive karne** ke liye hota hai.

Normally terminal mein:

```text
Keyboard
   ↓
stdin
   ↓
Node.js Program
```

Isliye `stdin` generally **Readable Stream** hai.

### File Descriptor:

```text
stdin → FD 0
```

### Example:

```js
process.stdin.on("data", (chunk) => {
  console.log(chunk);
});
```

Keyboard/terminal se input aayega aur `"data"` event ke through milega.

### ⭐ Remember:

```text
stdin
→ Input receive karta hai
→ Readable Stream
→ FD = 0
```

---

# 2️⃣ Standard Output — `stdout`

```js
process.stdout
```

### 🔹 Kya hai?

`stdout` ka use program ka **normal output display/send** karne ke liye hota hai.

Normally terminal mein:

```text
Node.js Program
      ↓
   stdout
      ↓
   Terminal
      ↓
   Monitor
```

`stdout` generally **Writable Stream** hai.

### File Descriptor:

```text
stdout → FD 1
```

### Example:

```js
process.stdout.write("Hello");
```

Output:

```text
Hello
```

### ⭐ Remember:

```text
stdout
→ Normal output
→ Writable Stream
→ FD = 1
```

---

# 3️⃣ Standard Error — `stderr`

```js
process.stderr
```

### 🔹 Kya hai?

`stderr` ka use **error messages / diagnostic output** ke liye hota hai.

```text
Node.js Program
      ↓
   stderr
      ↓
   Terminal
```

`stderr` generally **Writable Stream** hai.

### File Descriptor:

```text
stderr → FD 2
```

### Example:

```js
process.stderr.write("Something went wrong!");
```

---

# 🔥 `stdout` vs `stderr`

Dono output streams hain, lekin purpose different hai:

```text
stdout
→ Normal / successful output

stderr
→ Error / diagnostic output
```

Example:

```js
console.log("Success");
console.error("Error occurred");
```

Conceptually:

```text
console.log()
    ↓
stdout

console.error()
    ↓
stderr
```

---

# 🧠 File Descriptor (FD)

Operating System open files/resources ko identify karne ke liye numbers use karta hai.

Node.js process ke standard streams:

```text
FD 0 → stdin
FD 1 → stdout
FD 2 → stderr
```

### Easy Trick:

```text
0 → Input
1 → Output
2 → Error
```

---

# 🔥 Standard Streams ka Flow

```text
                 Node.js Process
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
      stdin          stdout         stderr
        │              │              │
      FD 0           FD 1           FD 2
        │              │              │
        ↓              ↓              ↓
    Keyboard        Terminal       Terminal
    / Input         / Output       / Errors
```

---

# ⭐ Important Correction

❌ Ye mat likhna:

```text
stdin  → Duplex
stdout → Duplex
stderr → Duplex
```

Basic Node.js understanding ke liye:

```text
stdin  → Readable
stdout → Writable
stderr → Writable
```

`process.stdin` ko Node.js API mein Readable Stream ke roop mein expose kiya jata hai, jabki `process.stdout` aur `process.stderr` Writable Streams hain.

---

# 📌 Quick Revision

```text
stdin
→ Standard Input
→ Keyboard/terminal se input
→ Readable
→ FD 0

stdout
→ Standard Output
→ Normal output
→ Writable
→ FD 1

stderr
→ Standard Error
→ Error/diagnostic output
→ Writable
→ FD 2
```

### 🔥 One-Line Memory Trick

```text
0 → stdin  → Input
1 → stdout → Output
2 → stderr → Error
```
