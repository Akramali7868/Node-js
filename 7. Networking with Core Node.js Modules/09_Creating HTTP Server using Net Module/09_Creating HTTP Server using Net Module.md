# Creating HTTP Server Using Node.js `net` Module

## 1. Can we create an HTTP server using `net`?

Yes. Node.js ke `net` module se TCP server create karke us TCP connection par manually HTTP response bhej sakte hain.

```js
import net from "node:net";

const server = net.createServer((socket) => {
  socket.write("HTTP/1.1 200 OK\r\n\r\n");
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
```

**Important:** `net` HTTP server nahi banata. `net` TCP server banata hai. Hum manually HTTP response format bhej rahe hain.

---

## 2. HTTP aur TCP ka relation

```text
HTTP
  ↓
TCP
  ↓
IP
  ↓
Ethernet / Wi-Fi
  ↓
Physical Signal
```

- HTTP = application-layer protocol
- TCP = transport-layer protocol
- `net.createServer()` = TCP server create karta hai

---

## 3. `socket.write()` se HTTP response

Proper HTTP/1.x response ka simple example:

```js
socket.write(
  "HTTP/1.1 200 OK\r\n" +
  "Content-Type: text/plain\r\n" +
  "\r\n" +
  "Hello Browser"
);
```

Structure:

```text
HTTP/1.1 200 OK
Content-Type: text/plain

Hello Browser
```

Yahan:

- `HTTP/1.1 200 OK` = status line
- `Content-Type` = response header
- `\r\n\r\n` = headers ke baad blank line
- `Hello Browser` = response body

### `\n\n` vs `\r\n\r\n`

HTTP/1.x mein standard line ending **CRLF (`\r\n`)** hai. Isliye proper HTTP response ke liye `\r\n\r\n` use karna better hai. Sirf `\n\n` wala example learning/demo mein mil sakta hai, lekin woh standard HTTP/1.x syntax nahi hai.

---

## 4. Browser TCP response ko kaise samajhta hai?

Browser arbitrary TCP data ko automatically HTTP nahi samajhta.

Browser HTTP protocol ko parse karta hai.

Flow:

```text
Browser
   ↓
TCP connection
   ↓
Server
   ↓
HTTP response
   ↓
TCP
   ↓
Browser
   ↓
HTTP parser
   ↓
Status + Headers + Body
```

Isliye server ko valid HTTP response bhejna hota hai.

---

## 5. HTTP versions

HTTP ke important versions:

```text
HTTP/0.9
HTTP/1.0
HTTP/1.1
HTTP/2
HTTP/3
```

### HTTP/0.9

Bahut old aur simple version tha. Mainly request ke liye `GET` aur response mein body ka concept tha; modern HTTP headers/status features nahi the.

### HTTP/1.0

Status line, headers aur status codes jaise features aaye.

### HTTP/1.1

Long time tak web ka major HTTP version raha.

Important features:

- Headers
- Host header
- Persistent connections
- Chunked transfer encoding
- Caching/control features

### HTTP/2

HTTP semantics ko maintain karte hue binary framing, multiplexing aur header compression introduce karta hai. HTTP/2 commonly TCP ke upar run karta hai.

### HTTP/3

HTTP/3 TCP ke instead **QUIC** use karta hai, aur QUIC UDP ke upar run karta hai.

```text
HTTP/3
  ↓
QUIC
  ↓
UDP
  ↓
IP
```

---

## 6. File ko `readStream` se HTTP response mein bhejna

Aapke code ka important part:

```js
const readStream = createReadStream("numbers.txt");

readStream.pipe(socket);
```

HTTP response ke liye pehle headers bhejna better hai:

```js
socket.write(
  "HTTP/1.1 200 OK\r\n" +
  "Content-Type: text/plain\r\n" +
  "\r\n"
);

const readStream = createReadStream("numbers.txt");

readStream.pipe(socket);
```

Flow:

```text
numbers.txt
    ↓
createReadStream()
    ↓
Chunks
    ↓
pipe()
    ↓
TCP socket
    ↓
HTTP response body
    ↓
Browser
```

---

## 7. `pipe()` kya kar raha hai?

```js
readStream.pipe(socket);
```

- `readStream` = Readable Stream
- `socket` = Writable side provide karne wala stream
- `pipe()` = source ke data ko destination tak transfer karta hai
- Backpressure ko bhi manage karta hai

Concept:

```text
Readable Stream
      ↓
    pipe()
      ↓
Writable Stream
```

File ka data manually:

```js
readStream.on("data", (chunk) => {
  socket.write(chunk);
});
```

bhi bhej sakte hain, lekin `pipe()` stream-to-stream transfer ko simpler banata hai.

---

## 8. Browser response ko stream ki tarah handle kar sakta hai

Large response ek single application-level message ke roop mein receive hona zaroori nahi hai.

Conceptually:

```text
Large File
   ↓
Chunk 1
Chunk 2
Chunk 3
Chunk 4
   ↓
Network
   ↓
Browser
```

Browser content type aur format ke according received data ko process/render kar sakta hai.

**Important:** TCP ek ordered byte stream hai. Server ke individual `write()` ya file chunks ki exact boundaries browser ke `data`/read chunks mein preserve hona guaranteed nahi hai.

---

## 9. Client side `fetch()` aur stream

Browser mein:

```js
const response = await fetch("http://localhost:4000");

const reader = response.body.getReader();

while (true) {
  const { done, value } = await reader.read();

  if (done) break;

  console.log(value);
}
```

`response.body` browser mein ek **ReadableStream** ho sakti hai.

Flow:

```text
Server
   ↓
HTTP response body
   ↓
Network
   ↓
fetch()
   ↓
response.body
   ↓
ReadableStream
   ↓
reader.read()
```

`value` generally received bytes ka `Uint8Array` hota hai.

---

## 10. CORS kya hai?

Example:

```text
Frontend:
http://localhost:3000

API:
http://localhost:4000
```

Different ports ka matlab different origins hain.

Agar browser JavaScript:

```js
fetch("http://localhost:4000");
```

karti hai, browser CORS policy check kar sakta hai.

Server appropriate response header de sakta hai:

```text
Access-Control-Allow-Origin: http://localhost:3000
```

Development example:

```js
socket.write(
  "HTTP/1.1 200 OK\r\n" +
  "Access-Control-Allow-Origin: *\r\n" +
  "Content-Type: text/plain\r\n" +
  "\r\n" +
  "Hello"
);
```

**CORS TCP ka feature nahi hai.** CORS browser ki cross-origin security policy hai.

---

## 11. CORS ka purpose

CORS decide karta hai ki browser JavaScript ko cross-origin response access karne ki permission hai ya nahi.

```text
CORS
 ↓
Browser security policy

TCP
 ↓
Reliable ordered byte stream
```

Non-browser clients par browser ka CORS restriction same tarike se apply nahi hota.

---

## 12. Complete simple HTTP-over-TCP example

### Server

```js
import { createReadStream } from "node:fs";
import net from "node:net";

const server = net.createServer((socket) => {
  socket.write(
    "HTTP/1.1 200 OK\r\n" +
    "Content-Type: text/plain\r\n" +
    "\r\n"
  );

  const readStream = createReadStream("numbers.txt");

  readStream.pipe(socket);

  readStream.on("end", () => {
    console.log("File ended");
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on Port 4000");
});
```

Sequence:

```text
1. Browser TCP connection banata hai
2. Server ko socket milta hai
3. Server HTTP headers bhejta hai
4. createReadStream() file read karta hai
5. pipe() file data socket par bhejta hai
6. TCP bytes browser tak deliver karta hai
7. Browser HTTP response body process karta hai
```

---

## 13. TCP, HTTP aur Stream ko alag rakho

### TCP

```text
Reliable, ordered byte stream
```

### HTTP

```text
Request / Response protocol
```

### Stream

```text
Data ko portions mein continuously process karne ka programming model
```

Together:

```text
File
 ↓
Readable Stream
 ↓
HTTP response body
 ↓
TCP byte stream
 ↓
Network
 ↓
Browser
 ↓
ReadableStream
```

---

## 14. Quick revision

- `net.createServer()` → TCP server banata hai.
- `socket.write()` → socket par data/bytes send karta hai.
- HTTP → application-layer protocol.
- `HTTP/1.1 200 OK` → HTTP status line.
- `\r\n` → HTTP/1.x standard line ending.
- `\r\n\r\n` → headers ke baad blank line; body start hoti hai.
- `createReadStream()` → file ko chunks mein read karta hai.
- `readStream.pipe(socket)` → file stream ko socket par transfer karta hai.
- Browser response body ko stream ki tarah consume kar sakta hai.
- `fetch()` → browser mein HTTP response deta hai.
- `response.body` → ReadableStream ho sakti hai.
- CORS → browser ki cross-origin security policy.
- HTTP/1.1 → commonly TCP ke upar.
- HTTP/2 → commonly TCP ke upar.
- HTTP/3 → QUIC ke upar, QUIC UDP use karta hai.

## One-line summary

> **`net` se TCP connection banta hai; hum us TCP socket par valid HTTP response manually bhej sakte hain, aur `readStream.pipe(socket)` ke through file ke data ko HTTP response body ke roop mein browser tak stream kar sakte hain.**
