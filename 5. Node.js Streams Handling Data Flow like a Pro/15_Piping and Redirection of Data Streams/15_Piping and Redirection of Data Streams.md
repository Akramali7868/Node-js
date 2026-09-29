# 📌 Piping and Redirection

## 1️⃣ Piping kya hoti hai?

**Piping** ka matlab hai:

> Ek process ke `stdout` ko doosre process ke `stdin` se connect karna.

```text id="pipe-flow"
Process A
  stdout
    │
    │ pipe (|)
    ↓
Process B
  stdin
```

### 🔹 Example

```bash
node script.js | node app.js
```

Yahan:

```text id="pipe-example"
script.js
   ↓
stdout
   ↓
   |
   ↓
stdin
   ↓
app.js
```

Matlab `script.js` jo data `stdout` par bhejega, wahi data `app.js` ke `stdin` par input ke roop mein milega.

---

# 🔹 Example

### `script.js`

```js
process.stdout.write("stdout: hi from script.js\n");

process.stderr.write("stderr: hi from script.js\n");
```

### `app.js`

```js
process.stdin.setEncoding("utf-8");

process.stdin.on("data", (chunk) => {
  console.log("app.js", chunk);
});
```

Run:

```bash
node script.js | node app.js
```

### Flow:

```text id="pipe-example2"
script.js
   │
   ├── stdout ───────→ app.js stdin
   │
   └── stderr ───────→ Terminal
```

⚠️ Important:

`|` normally **stdout ko pipe karta hai**, `stderr` ko nahi.

---

# 2️⃣ Redirection kya hoti hai?

**Redirection** ka matlab hai process ke standard output/input ko kisi file ya doosri destination ki taraf redirect karna.

Example:

```bash
node script.js > output.txt
```

Yahan `>` ka matlab hai:

> `script.js` ke **stdout** ko terminal ke bajay `output.txt` file mein bhejo.

```text id="redirect-flow"
script.js
    ↓
  stdout
    ↓
    >
    ↓
output.txt
```

---

# 🔹 Example

### `script.js`

```js
process.stdout.write("stdout: hi from script.js\n");

process.stderr.write("stderr: hi from script.js\n");
```

Run:

```bash
node script.js > output.txt
```

### Result

`output.txt` mein:

```text id="output-example"
stdout: hi from script.js
```

Lekin:

```text id="stderr-example"
stderr: hi from script.js
```

terminal par hi dikhega.

### Why?

Kyuki:

```text id="fd-redirection"
stdout → redirected
stderr → redirected nahi
```

---

# 🔥 `>` Redirection

```bash
node script.js > output.txt
```

`>` **stdout ko file mein redirect** karta hai.

Agar `output.txt` pehle se exist karti hai, to normally uska existing content **overwrite** ho jata hai.

```text id="overwrite"
Old output.txt
       ↓
     `>`
       ↓
New output
       ↓
Old content replace
```

---

# 🔹 `>>` Append Redirection

```bash
node script.js >> output.txt
```

`>>` existing file ke end mein output **append** karta hai.

```text id="append"
Existing content
       +
New stdout
       ↓
output.txt
```

Difference:

```text id="compare-redirection"
>   → Overwrite
>>  → Append
```

---

# 🔹 `stderr` ko redirect karna

File Descriptor yaad hai:

```text id="fd"
0 → stdin
1 → stdout
2 → stderr
```

Isliye:

```bash
node script.js 2> error.txt
```

ka matlab:

```text id="stderr-redirection"
stderr (FD 2)
       ↓
   error.txt
```

Normal `stdout` terminal par rahega.

---

# 🔥 stdout + stderr ko same file mein

```bash
node script.js > output.txt 2>&1
```

Meaning:

```text id="both-redir"
stdout → output.txt
stderr → stdout → output.txt
```

Dono output `output.txt` mein chale jayenge.

---

# 🧠 Piping vs Redirection

| Piping                          | Redirection                      |                      |
| ------------------------------- | -------------------------------- | -------------------- |
| `                               | ` use hota hai                   | `>`, `>>`, `2>` etc. |
| stdout → दूसरे process ka stdin | stdout/stderr → file/destination |                      |
| Process → Process               | Process → File                   |                      |
| `node a.js \| node b.js`        | `node a.js > output.txt`         |                      |

---

# ⭐ Easy Memory Trick

```text id="memory"
Piping:
Process → Process

Redirection:
Process → File
```

### One-line definitions:

> **Piping:** Ek process ke `stdout` ko doosre process ke `stdin` se connect karna.

> **Redirection:** Process ke `stdin`, `stdout` ya `stderr` ko file ya kisi doosri destination ki taraf redirect karna.
