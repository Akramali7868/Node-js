# Uploading Files with Node.js `net` Module

## 1. Goal

Browser se file select karke Node.js server ko upload karna:

```text
Browser
   ↓
HTTP POST + multipart/form-data
   ↓
TCP Socket
   ↓
Node.js Server
   ↓
Multipart data parse
   ↓
Actual file bytes
   ↓
Write Stream
   ↓
Saved File
```

---

## 2. HTML File Upload Form

```html
<form
  action="http://192.168.0.210:4000/"
  method="post"
  enctype="multipart/form-data"
>
  <input type="file" name="file" required>
  <button type="submit">Upload</button>
</form>
```

### `action`

```html
action="http://192.168.0.210:4000/"
```

Batata hai ki form submit hone ke baad data kis server URL par jayega.

```text
Browser → http://192.168.0.210:4000/
```

### `method="post"`

`POST` request server ko data bhejne ke liye use hoti hai.

### `enctype="multipart/form-data"`

File upload ke liye important hai.

Ye browser ko batata hai ki form data ko multipart format mein encode karke request body mein send karna hai.

**Important:** `multipart/form-data` ka matlab ye nahi ki HTML directly Node.js `Stream` object bhej raha hai. HTTP request body bytes ka stream hoti hai aur multipart format un bytes ko parts mein organize karta hai.

### `input type="file"`

User ko local computer se file select karne deta hai.

```html
<input type="file" name="file" required>
```

`name="file"` multipart form-data ke field ka naam hota hai.

---

# 3. Browser Kya Send Karta Hai?

Conceptually browser kuch is type ki HTTP request bhejta hai:

```text
POST / HTTP/1.1
Host: 192.168.0.210:4000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryABC123
Content-Length: ...

------WebKitFormBoundaryABC123
Content-Disposition: form-data; name="file"; filename="example.pdf"
Content-Type: application/pdf

[FILE BYTES]

------WebKitFormBoundaryABC123--
```

Request body mein sirf file nahi hoti.

Ismein ho sakta hai:

- multipart boundary
- part headers
- file bytes
- closing boundary

---

# 4. What is `WebKitFormBoundary`?

Browser multipart request ke parts ko separate karne ke liye ek boundary generate karta hai.

Example:

```text
------WebKitFormBoundarydBGzNLlPSe3XV0Cs
```

Closing boundary usually:

```text
------WebKitFormBoundarydBGzNLlPSe3XV0Cs--
```

Boundary ka purpose:

```text
Part 1
  ↓
Boundary
  ↓
Part 2
  ↓
Boundary
  ↓
Part 3
```

**Important:** Server ko `WebKitFormBoundary` naam par depend nahi karna chahiye. Actual boundary `Content-Type` header mein milti hai:

```text
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryABC123
```

---

# 5. Node.js TCP Server

```js
import { createWriteStream } from "node:fs";
import net from "node:net";

const server = net.createServer((socket) => {
  // receive request data
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
```

Flow:

```text
Browser
   ↓
TCP Connection
   ↓
Node.js net Server
   ↓
socket
```

`socket` TCP connection ka endpoint hai.

---

# 6. Receiving Data with `socket.on("data")`

```js
socket.on("data", (chunk) => {
  console.log(chunk);
});
```

Jab TCP socket par data receive hota hai, `data` event fire hota hai.

`chunk` received byte stream ka ek portion hota hai.

Large request:

```text
HTTP Request
    ↓
TCP byte stream
    ↓
chunk 1
chunk 2
chunk 3
chunk 4
...
```

**Important:** Ek HTTP request zaroori nahi ki ek hi chunk mein aaye.

---

# 7. `createWriteStream()`

```js
const writeStream = createWriteStream("uploaded-file.txt");
```

`createWriteStream()` data ko chunk-by-chunk file mein write kar sakta hai.

```text
Incoming chunk
      ↓
writeStream.write(chunk)
      ↓
File
```

Is approach se poori file ko ek saath RAM mein load karne ki zaroorat nahi hoti.

---

# 8. Current Server Code

```js
import { createWriteStream } from "node:fs";
import net from "node:net";

const server = net.createServer((socket) => {
  socket.write("HTTP/1.1 200 OK\r\n\r\n");

  const writeStream = createWriteStream("uploaded-file.txt");

  socket.on("data", (chunk) => {
    writeStream.write(chunk);

    if (/WebKitFormBoundary.+--/.test(chunk.toString())) {
      socket.end("Got the data");
    }
  });

  socket.on("close", () => {
    console.log(socket.remoteAddress, ": Client disconnected");
  });

  socket.on("error", () => {
    console.log("Client Lost");
  });

  console.log("Client Connected", socket.remoteAddress);
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
```

---

# 9. `writeStream.write(chunk)`

```js
socket.on("data", (chunk) => {
  writeStream.write(chunk);
});
```

Flow:

```text
Socket
  ↓
data event
  ↓
chunk
  ↓
writeStream.write(chunk)
  ↓
uploaded-file.txt
```

---

# 10. Important Correction: Pure File Automatically Save Nahi Hoti

Current code:

```js
writeStream.write(chunk);
```

poore received HTTP request ke chunks ko file mein write karta hai.

Lekin multipart request mein:

```text
HTTP headers
multipart headers
boundary
file bytes
closing boundary
```

sab aa sakte hain.

Isliye `uploaded-file.txt` mein multipart/HTTP information bhi aa sakti hai.

Actual uploaded file save karne ke liye humein:

1. HTTP headers parse karne honge.
2. `Content-Type` se multipart boundary identify karni hogi.
3. Multipart part headers skip karne honge.
4. Sirf actual file bytes write karne honge.
5. Closing boundary se pehle writing stop karni hogi.

Production applications mein multipart parser library use karna safer hota hai.

---

# 11. Regex Boundary Check

Current code:

```js
if (/WebKitFormBoundary.+--/.test(chunk.toString())) {
  socket.end("Got the data");
}
```

Idea ye hai:

> Agar received chunk mein closing multipart boundary mil jaye, to upload complete maan lo.

Regex:

```text
/WebKitFormBoundary.+--/
```

`WebKitFormBoundary` ke baad kuch characters aur `--` search karta hai.

---

# 12. Important Correction: Boundary Chunk ke Beech Split Ho Sakti Hai

Ye check reliable nahi hai:

```js
if (/WebKitFormBoundary.+--/.test(chunk.toString()))
```

Kyunki TCP ek byte stream hai.

Boundary:

```text
------WebKitFormBoundaryABC123--
```

ek hi chunk mein aa sakti hai:

```text
Chunk 5:
------WebKitFormBoundaryABC123--
```

Lekin split bhi ho sakti hai:

```text
Chunk 5:
------WebKitFormBoundaryABC

Chunk 6:
123--
```

Agar hum har chunk ko separately check karenge, complete boundary kisi single chunk mein nahi milegi.

**Rule:**

> TCP chunk boundaries ko application-message boundaries mat samjho.

---

# 13. `socket.end("Got the data")`

```js
socket.end("Got the data");
```

`socket.end()` optional data ko send karke socket ko end/finish karta hai.

Lekin agar aap HTTP response bhej rahe hain, to proper HTTP response bhejna chahiye.

Example:

```js
socket.end(
  "HTTP/1.1 200 OK\r\n" +
  "Content-Type: text/plain\r\n" +
  "Content-Length: 13\r\n" +
  "\r\n" +
  "Got the data!"
);
```

HTTP structure:

```text
Status Line
Headers
Blank Line
Body
```

HTTP/1.x mein line ending:

```text
\r\n
```

Aur headers/body separator:

```text
\r\n\r\n
```

---

# 14. Why Streams?

Suppose uploaded file:

```text
1 GB
```

Agar poori file RAM mein load karein:

```text
1 GB File
   ↓
RAM
```

Memory usage bahut high ho sakta hai.

Stream approach:

```text
Chunk 1 → write
Chunk 2 → write
Chunk 3 → write
Chunk 4 → write
...
```

Large files ko efficiently handle karne mein streams useful hain.

---

# 15. TCP Chunk ≠ File Chunk

Ye assume nahi karna:

```text
1 TCP chunk = 1 file chunk
```

Actual flow:

```text
File / HTTP data
       ↓
TCP byte stream
       ↓
arbitrary chunks
```

TCP application ke message boundaries preserve nahi karta.

---

# 16. Backpressure

Agar network se data disk se fast aa raha hai:

```text
Network
  ↓
Fast
  ↓
Socket
  ↓
Write Stream
  ↓
Slow Disk
```

to writable stream par pressure aa sakta hai.

Node.js streams mein backpressure important concept hai.

---

# 17. Why `multipart/form-data`?

Simple text form data ke liye:

```text
application/x-www-form-urlencoded
```

common hai.

File upload ke liye:

```text
multipart/form-data
```

use kiya jata hai.

Ek multipart request multiple parts contain kar sakti hai:

```text
Part 1 → name
Part 2 → email
Part 3 → file
Part 4 → another file
```

Boundary in parts ko separate karti hai.

---

# 18. Complete Mental Model

```text
User selects file
       ↓
HTML Form
       ↓
POST request
       ↓
multipart/form-data
       ↓
HTTP request body
       ↓
TCP byte stream
       ↓
Node.js socket
       ↓
data chunks
       ↓
Multipart parser
       ↓
Actual file bytes
       ↓
createWriteStream()
       ↓
Disk
```

---

# 19. Quick Revision

### `action`

Server URL:

```html
action="http://192.168.0.210:4000/"
```

### `method="post"`

Data server ko bhejne ke liye POST request.

### `enctype="multipart/form-data"`

Form data ko multipart format mein encode karta hai, especially file uploads ke liye.

### `input type="file"`

User ko file select karne deta hai.

### `socket.on("data")`

Incoming TCP bytes ko chunks mein receive karta hai.

### `chunk`

Received TCP byte stream ka ek portion.

### `writeStream.write(chunk)`

Chunk ko file mein write karta hai.

### Boundary

Multipart body ke parts ko separate karti hai.

Example:

```text
------WebKitFormBoundaryABC123
```

### Closing boundary

Example:

```text
------WebKitFormBoundaryABC123--
```

---

# 20. One-Line Summary

> **Browser file ko `multipart/form-data` HTTP POST request ke body mein send karta hai; Node.js `net` socket us request ko TCP byte-stream ke chunks mein receive karta hai, aur actual file bytes ko multipart data se separate karke write stream ke through disk par save kiya ja sakta hai.**

## Most Important Concept

```text
TCP chunk ≠ HTTP message ≠ multipart part ≠ file
```

Ye chaar different concepts hain.
