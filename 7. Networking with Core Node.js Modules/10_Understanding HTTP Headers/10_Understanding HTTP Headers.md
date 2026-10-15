# Understanding HTTP Headers

## 1. HTTP Response ka basic structure

```text
Status Line
    ↓
Headers
    ↓
Blank Line
    ↓
Body
```

Example:

```text
HTTP/1.1 200 OK
Content-Type: text/plain

Hello
```

**Yaad rakho:**

```text
Status → Headers → Blank Line → Body
```

---

## 2. Status Line kya hoti hai?

```js
socket.write("HTTP/1.1 200 OK\r\n\r\nHii");
```

`HTTP/1.1 200 OK` **Status Line** hai, header nahi.

```text
HTTP/1.1  → HTTP version
200       → Status code
OK        → Status text
```

Common status codes:

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

---

## 3. HTTP Headers kya hote hain?

HTTP headers client aur server ko **extra information / metadata** dete hain.

Example:

```text
Content-Type: text/plain
```

Yahan:

```text
Content-Type → Header name
text/plain   → Header value
```

Header ka basic format:

```text
Header-Name: value
```

Examples:

```text
Content-Type: text/plain
Content-Length: 100
Access-Control-Allow-Origin: *
```

---

## 4. `Access-Control-Allow-Origin` kya karta hai?

Example:

```text
Access-Control-Allow-Origin: *
```

Ye **CORS** se related response header hai.

Simple meaning:

> Browser ko bataya ja raha hai ki cross-origin web request ke response ko kaunse origin se JavaScript access kar sakti hai.

`*` broadly any origin ko allow karta hai, subject to CORS rules.

Example:

```text
Frontend
http://localhost:3000
       ↓
       ↓ request
       ↓
Server
http://localhost:4000
```

Different ports ki wajah se ye different origins hain.

Server response mein:

```text
Access-Control-Allow-Origin: *
```

hone par browser CORS rules ke according response ko allow kar sakta hai.

**Important:** CORS TCP ka feature nahi hai. Ye browser security mechanism hai jo HTTP headers ke through express hota hai.

---

## 5. `Access-Control-Expose-Headers`

Example:

```text
Access-Control-Expose-Headers: *
```

Ye response headers ko browser JavaScript ke liye expose karne se related hai.

Example:

```js
const response = await fetch(url);

console.log(response.headers.get("Content-Type"));
```

Custom/non-safelisted response headers ko JavaScript se read karne ke liye appropriate CORS exposure configuration ki zaroorat ho sakti hai.

**Note:** `*` ka behavior credentials ke context mein special rules follow karta hai. Isliye ise simply "JavaScript ko automatically saare headers milenge" ke rule ki tarah yaad na karein.

---

## 6. Custom Header

Aap apna custom header bhi bana sakte ho:

```text
hello: world
```

```text
hello → Header name
world → Header value
```

Example:

```js
socket.write("hello: world\r\n");
```

Custom header ka meaning application khud define karti hai.

---

## 7. Multiple Headers

Example:

```text
HTTP/1.1 200 OK
Content-Type: text/plain
Access-Control-Allow-Origin: *
hello: world

Hii
```

### Status Line

```text
HTTP/1.1 200 OK
```

### Headers

```text
Content-Type: text/plain
Access-Control-Allow-Origin: *
hello: world
```

### Blank Line

Headers ke baad empty line.

### Body

```text
Hii
```

---

## 8. `\n\n` ka kya meaning hai?

Learning examples mein aap dekh sakte ho:

```js
socket.write("HTTP/1.1 200 OK\n\nHii");
```

Yahan `\n\n` blank line represent karne ke liye use hua hai.

Lekin proper HTTP/1.x mein line ending **CRLF (`\r\n`)** hoti hai.

Isliye manually HTTP response likhte waqt:

```js
socket.write(
  "HTTP/1.1 200 OK\r\n" + "Content-Type: text/plain\r\n" + "\r\n" + "Hii",
);
```

Better hai.

```text
\r\n   → next line
\r\n\r\n → headers end, body starts
```

---

## 9. Clean way se headers likhna

Multiple writes:

```js
socket.write("HTTP/1.1 200 OK\r\n");
socket.write("Content-Type: text/plain\r\n");
socket.write("Access-Control-Allow-Origin: *\r\n");
socket.write("Access-Control-Expose-Headers: *\r\n");
socket.write("hello: world\r\n");
socket.write("\r\n");

socket.write("Hii");
```

Ya ek hi write:

```js
socket.write(
  "HTTP/1.1 200 OK\r\n" +
    "Content-Type: text/plain\r\n" +
    "Access-Control-Allow-Origin: *\r\n" +
    "hello: world\r\n" +
    "\r\n" +
    "Hii",
);
```

Dono mein final bytes ka HTTP format same ho sakta hai.

**Important:** TCP ek byte stream hai. Har `socket.write()` ko browser alag HTTP line/message ke roop mein receive kare, ye guarantee nahi hai. Browser ko final byte stream valid HTTP format mein milna chahiye.

---

## 10. `Content-Type` example

Text:

```text
Content-Type: text/plain
```

HTML:

```text
Content-Type: text/html
```

JSON:

```text
Content-Type: application/json
```

Example:

```js
socket.write(
  "HTTP/1.1 200 OK\r\n" +
    "Content-Type: application/json\r\n" +
    "\r\n" +
    '{"message":"Hello"}',
);
```

---

## 11. Node.js `http` module mein headers

`net` module mein HTTP response manually likhna padta hai:

```js
socket.write("HTTP/1.1 200 OK\r\n");
socket.write("Content-Type: text/plain\r\n");
socket.write("\r\n");
socket.write("Hello");
```

Lekin `http` module HTTP ka kaam easy bana deta hai:

```js
import http from "node:http";

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello");
});
```

Normal HTTP server ke liye `http` module zyada convenient hai.

---

## 12. Complete Manual HTTP Example

```js
import net from "node:net";

const server = net.createServer((socket) => {
  socket.write(
    "HTTP/1.1 200 OK\r\n" +
      "Content-Type: text/plain\r\n" +
      "Access-Control-Allow-Origin: *\r\n" +
      "hello: world\r\n" +
      "\r\n" +
      "Hii",
  );
});

server.listen(4000, () => {
  console.log("Server started on port 4000");
});
```

Flow:

```text
Browser
   ↓
TCP connection
   ↓
Server socket
   ↓
Status Line
   ↓
Headers
   ↓
Blank Line
   ↓
Body
   ↓
Browser
```

---

## 13. Easy final notes

### Status Line

```text
HTTP/1.1 200 OK
```

Request ka result batati hai.

### Headers

```text
Content-Type: text/plain
```

Extra information / metadata dete hain.

### Blank Line

```text
\r\n\r\n
```

Headers aur body ko separate karti hai.

### Body

```text
Hii
```

Actual response data hota hai.

---

## 🧠 One-line formula

```text
HTTP Response
    =
Status Line
+
Headers
+
Blank Line
+
Body
```

Example:

```text
HTTP/1.1 200 OK
Content-Type: text/plain
Access-Control-Allow-Origin: *

Hii
```

### Most important point

> **`HTTP/1.1 200 OK` header nahi, Status Line hai. Uske baad `Content-Type`, `Access-Control-Allow-Origin` jaise Header Fields aate hain. Headers ke baad blank line hoti hai, phir response body.**
