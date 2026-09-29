# 📌 File Opening Modes — `flags`

`fs.openSync()` mein **flags** batate hain ki file ko kis mode mein open karna hai.

## 🔹 Read Mode — `'r'`

```js
const fd = fs.openSync("text.txt", "r");
```

```text
r → Read
```

File ko **read karne** ke liye open karta hai.

---

## 🔹 Write Mode — `'w'`

```js
const fd = fs.openSync("text.txt", "w");
```

```text
w → Write
```

File mein **write** karne ke liye open karta hai.

⚠️ Agar file already exist karti hai, `'w'` generally uski existing content ko **truncate (empty)** kar deta hai.

---

## 🔹 Read + Write Mode — `'r+'`

```js
const fd = fs.openSync("text.txt", "r+");
```

```text
r+ → Read + Write
```

Existing file ko **read aur write dono** kar sakte hain.

---

## 🔹 Write + Read Mode — `'w+'`

```js
const fd = fs.openSync("text.txt", "w+");
```

```text
w+ → Write + Read
```

File ko **read aur write dono** kar sakte hain.

⚠️ `'w+'` existing file ko open karte waqt uski existing content ko generally **truncate (empty)** kar deta hai.

---

# 🧠 Quick Revision

```text
'r'   → Read
'w'   → Write
'r+'  → Read + Write (existing content preserve)
'w+'  → Write + Read (existing content truncate)
```

### 🔥 Memory Trick

```text
r → Read
w → Write
+ → Read + Write capability
```

### Example

```js
const fd = fs.openSync("text.txt", "w");

fs.writeSync(fd, "Hello");
```

Yahan `'w'` flag ki wajah se file **writing mode** mein open hui.
