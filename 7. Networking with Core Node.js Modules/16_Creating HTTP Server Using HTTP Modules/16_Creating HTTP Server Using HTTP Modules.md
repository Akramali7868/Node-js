# Creating HTTP Server Using Node.js `http` Module

## 1. HTTP Module is Built on Top of TCP

Node.js ka:

```js
import http from "node:http";
```

`http` module TCP networking ke upar HTTP protocol ko handle karta hai.

```text
Application
    ↓
HTTP Module
    ↓
TCP
    ↓
Network
```

`net` module ke saath humein HTTP response manually likhna padta tha. `http` module HTTP request/response ko parse aur manage karne ke liye high-level API deta hai.

---

## 2. Creating an HTTP Server

```js
const server = http.createServer((request, response) => {
  console.log("Got the request");
});
```

`http.createServer()` HTTP server create karta hai.

Is callback ko har incoming HTTP request par execute kiya jata hai.

Equivalent form:

```js
const server = http.createServer();

server.on("request", (request, response) => {
  console.log("Got the request");
});
```

---

## 3. Start / Listen on Server

```js
server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
```

Flow:

```text
Browser
   ↓
Port 4000
   ↓
Node.js HTTP Server
```

---

# 4. TCP Server vs HTTP Server

TCP ke saath:

```js
const server = net.createServer();

server.on("connection", (socket) => {
  socket.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});
```

Flow:

```text
connection
    ↓
socket
    ↓
raw bytes
```

HTTP module ke saath:

```js
const server = http.createServer((request, response) => {
  // HTTP request
  // HTTP response
});
```

Flow:

```text
HTTP Request
     ↓
request object
     +
response object
```

HTTP module humein HTTP-level abstraction deta hai, isliye code much easier hota hai.

---

# 5. `request` and `response`

```js
http.createServer((request, response) => {
});
```

### `request`

Client → Server HTTP request.

### `response`

Server → Client HTTP response.

```text
Browser
   |
   | HTTP Request
   ↓
request
   |
Node.js Server
   |
response
   |
   | HTTP Response
   ↓
Browser
```

---

# 6. `request` is a Readable Stream

```js
request.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

Request body ko chunks mein read kiya ja sakta hai.

```text
Client
   ↓
Request Body
   ↓
request
   ↓
chunk 1
chunk 2
chunk 3
...
```

`request` ek readable stream hai.

---

# 7. `response` is a Writable Stream

Response mein data write karne ke liye:

```js
response.write("Hello from http server.");
```

Aur response complete karne ke liye:

```js
response.end();
```

Ya:

```js
response.end("Hello from http server.");
```

Flow:

```text
response.write()
      ↓
Response Body
      ↓
response.end()
      ↓
Response complete
```

---

# 8. Setting Response Headers

```js
response.setHeader("Header-Key", "Header Value");
```

Example:

```js
response.setHeader("Content-Type", "text/plain");
```

Or:

```js
response.setHeader("Content-Length", "23");
```

`Content-Length` response body ki exact length bytes mein declare karta hai.

---

# 9. Important: `Content-Length` vs `response.end()`

Ye important correction hai:

```js
response.setHeader("Content-Length", "23");
```

sirf client ko body ki expected length batata hai.

Ye:

```js
response.end();
```

ka replacement nahi hai.

Response stream ko properly finish karne ke liye normally:

```js
response.end();
```

use karna hota hai.

Example:

```js
response.setHeader("Content-Length", "23");
response.write("Hello from http server.");
response.end();
```

---

# 10. Request Properties

HTTP `request` object mein useful properties hoti hain.

### Request Headers

```js
request.headers
```

Example:

```js
console.log(request.headers);
```

Ye **request headers** hain:

```text
Browser → Server
```

### URL

```js
request.url
```

Examples:

```text
/
```

```text
/products
```

```text
/users?id=10
```

### Method

```js
request.method
```

Examples:

```text
GET
POST
PUT
PATCH
DELETE
```

Other useful properties:

```js
request.httpVersion
request.socket
```

---

# 11. Reading Request Body

```js
request.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

Agar client body bhejta hai, to body chunks mein receive ho sakti hai.

Complete body receive hone par:

```js
request.on("end", () => {
  console.log("Request body completely received");
});
```

Flow:

```text
data
 ↓
data
 ↓
data
 ↓
end
```

---

# 12. GET Request and Body

Normal browser navigation:

```text
http://localhost:4000/
```

usually:

```text
GET /
```

request hoti hai aur generally body nahi hoti.

Isliye:

```js
request.on("data", ...)
```

normal browser GET navigation mein usually execute nahi hota.

### Important Correction

Ye technically correct nahi hai ki HTTP GET **kabhi** body nahi rakh sakta.

HTTP specification GET body ko simply universally forbid nahi karti, lekin browser `fetch()` API GET/HEAD request ke saath body allow nahi karta.

Isliye normal browser GET request mein body generally nahi hoti.

---

# 13. Sending Body with `fetch()`

Example:

```js
fetch("http://localhost:4000/", {
  method: "POST",
  body: "Hello Server"
});
```

Server:

```js
request.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

Output:

```text
Hello Server
```

JSON example:

```js
fetch("http://localhost:4000/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Akram",
    age: 29
  })
});
```

---

# 14. Basic HTTP Server

```js
import http from "node:http";

const server = http.createServer((request, response) => {
  console.log("Got the request");

  response.setHeader("Content-Length", "23");
  response.write("Hello from http server.");
  response.end();
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server Started");
});
```

Flow:

```text
Browser
   ↓
HTTP Request
   ↓
request object
   ↓
Node.js Server
   ↓
response.setHeader()
   ↓
response.write()
   ↓
response.end()
   ↓
HTTP Response
   ↓
Browser
```

---

# 15. HTTP Module vs Manual HTTP over `net`

With `net`, manually:

```js
socket.write("HTTP/1.1 200 OK\r\n");
socket.write("Content-Type: text/plain\r\n");
socket.write("\r\n");
socket.write("Hello");
```

With `http`:

```js
response.setHeader("Content-Type", "text/plain");
response.end("Hello");
```

So:

```text
net
 ↓
Raw TCP
 ↓
HTTP manually handle

http
 ↓
HTTP abstraction
 ↓
Easier server code
```

---

# 16. Does TCP Disappear When We Use `http`?

No.

HTTP still runs over an underlying transport.

For HTTP/1.1 and HTTP/2, that is normally TCP.

Mental model:

```text
HTTP
 ↓
TCP
 ↓
IP
 ↓
Network
```

The HTTP module hides many low-level TCP details from us.

`request.socket` can provide access to the underlying socket.

---

# 17. HTTP Server's `connection` Event

HTTP server underlying TCP connection ka `connection` event bhi emit karta hai:

```js
server.on("connection", (socket) => {
  console.log("TCP connection established");
});
```

Yahan callback ko TCP socket milta hai.

Lekin normal HTTP application logic ke liye:

```js
server.on("request", (request, response) => {
});
```

use karna easier hai.

Comparison:

```text
TCP:
connection
   ↓
socket
   ↓
raw bytes

HTTP:
request
   ↓
request object
response object
```

---

# 18. Why `request` Event is Easier?

TCP:

```js
server.on("connection", (socket) => {
  socket.on("data", (chunk) => {
    // raw bytes
  });
});
```

HTTP:

```js
server.on("request", (request, response) => {
  console.log(request.method);
  console.log(request.url);
  console.log(request.headers);
});
```

HTTP module already request ko parse karke useful properties provide karta hai.

---

# 19. Testing HTTP Requests

GET, POST, PUT, PATCH, DELETE test karne ke liye HTTP clients use kar sakte hain.

Popular tools:

```text
Postman
curl
Insomnia
Thunder Client
```

Postman se different HTTP methods aur request bodies easily test kar sakte hain.

---

# 20. Complete Example

```js
import http from "node:http";

const server = http.createServer((request, response) => {
  console.log("Got the request");

  console.log("Method:", request.method);
  console.log("URL:", request.url);
  console.log("Headers:", request.headers);

  request.on("data", (chunk) => {
    console.log("Body:", chunk.toString());
  });

  request.on("end", () => {
    console.log("Request body ended");
  });

  response.setHeader("Content-Type", "text/plain");
  response.end("Hello from http server.");
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server Started");
});
```

---

# 21. Stream Relationship

Simplified mental model:

```text
TCP Socket
     ↓
 Duplex Stream
     ↓
 ┌───────────────┐
 │               │
 ↓               ↑
Read            Write
 │               │
 ↓               ↑
Request         Response
```

HTTP request and response are abstractions built around the underlying network connection.

---

# 22. TCP vs HTTP Quick Comparison

| TCP (`net`) | HTTP (`http`) |
|---|---|
| Low-level TCP API | Higher-level HTTP API |
| `connection` event | `request` event |
| `socket` | `request`, `response` |
| Raw byte stream | Parsed HTTP request |
| HTTP manually handle kar sakte hain | HTTP handling built-in |
| Headers manually handle karne pad sakte hain | `request.headers` |
| URL manually parse karna pad sakta hai | `request.url` |
| Method manually parse karna pad sakta hai | `request.method` |
| `socket.write()` | `response.write()` |
| `socket.end()` | `response.end()` |

---

# 23. Quick Revision

### Create server

```js
http.createServer((request, response) => {});
```

### Listen

```js
server.listen(4000, "0.0.0.0");
```

### Request method

```js
request.method
```

### Request URL

```js
request.url
```

### Request headers

```js
request.headers
```

### Read request body

```js
request.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

### Body complete

```js
request.on("end", () => {
  console.log("Done");
});
```

### Set response header

```js
response.setHeader("Content-Type", "text/plain");
```

### Write response

```js
response.write("Hello");
```

### Finish response

```js
response.end();
```

or:

```js
response.end("Hello");
```

---

# 24. Final Mental Model

```text
             HTTP Module
                  ↓
        ┌──────────────────┐
        │ HTTP Request     │
        │ request object   │
        │ readable stream  │
        └────────┬─────────┘
                 │
              Server
                 │
        ┌────────▼─────────┐
        │ HTTP Response    │
        │ response object  │
        │ writable stream  │
        └────────┬─────────┘
                 ↓
          Underlying TCP
                 ↓
              Network
```

## One-Line Summary

> **Node.js ka `http` module TCP ke upar HTTP abstraction provide karta hai, jisse raw socket aur HTTP details manually handle karne ke bajay humein `request` aur `response` objects milte hain; `request` readable stream hai aur `response` writable stream hai.**

## Most Important Concept

```text
net module
   ↓
TCP + raw socket

http module
   ↓
HTTP abstraction
   ↓
request + response
   ↓
underlying TCP connection
```
