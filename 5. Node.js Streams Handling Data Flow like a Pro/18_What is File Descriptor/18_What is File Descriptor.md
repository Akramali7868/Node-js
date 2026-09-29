# 📌 File Descriptor (FD)

**File Descriptor ek number hota hai jo operating system ke paas kisi open file/resource ko identify/represent karta hai.**

### Example:

```js
import fs from "fs";

const fd1 = fs.openSync("text.txt");
const fd2 = fs.openSync("num.txt");
const fd3 = fs.openSync("package.json");

console.log(fd1);
console.log(fd2);
console.log(fd3);
```

Output kuch aisa ho sakta hai:

```text
3
4
5
```

Yahan:

```text
3 → text.txt ka File Descriptor
4 → num.txt ka File Descriptor
5 → package.json ka File Descriptor
```

### 🧠 Simple Definition

> **File Descriptor (FD) = OS dwara kisi open file/resource ko identify karne ke liye diya gaya number.**

### ⭐ Standard File Descriptors

```text
0 → stdin
1 → stdout
2 → stderr
```

Normally user-created files ke FDs **3 se aage** mil sakte hain.

### 🔥 Memory Trick

```text
FD = File ko identify karne wala number
```
