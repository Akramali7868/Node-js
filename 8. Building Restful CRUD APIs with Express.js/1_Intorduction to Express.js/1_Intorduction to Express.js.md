# Express.js — Introduction, `res.send()`, `res.end()` and ETag

## 1. What is Express.js?

**Express.js** is a web framework built on top of Node.js HTTP functionality.

```text
Node.js
   ↓
http module
   ↓
Express.js
   ↓
Web Application / REST API
```

Node.js ka `http` module low-level HTTP building blocks provide karta hai.

Express unke upar convenient APIs provide karta hai, jisse:

- API banana easy hota hai
- Routes manage karna easy hota hai
- Middleware use kar sakte hain
- Repeated HTTP handling kam hoti hai
- Application maintain karna easier hota hai
- Large applications ko organize karna easier hota hai

### Simple Definition

> **Express.js Node.js ke upar bana ek web framework hai jo HTTP servers aur APIs ko easier way mein build aur manage karne mein help karta hai.**

---

# 2. Why Do We Use Express?

Raw Node.js `http` module mein:

```js
if (req.method === "GET" && req.url === "/users") {
  // ...
}

if (req.method === "POST" && req.url === "/users") {
  // ...
}
```

Express mein:

```js
app.get("/users", (req, res) => {
  // ...
});

app.post("/users", (req, res) => {
  // ...
});
```

Isliye routing aur application code cleaner ho sakta hai.

---

# 3. Express ka `app`

```js
import express from "express";

const app = express();
```

`app` Express application object hai.

Iske through hum:

```js
app.get()
app.post()
app.put()
app.patch()
app.delete()
```

jaise HTTP routes define kar sakte hain.

---

# 4. `app.listen()`

Server start karne ke liye:

```js
app.listen(4000, () => {
  console.log("Server started");
});
```

Flow:

```text
app
 ↓
listen(4000)
 ↓
Server starts
 ↓
Requests accepted
```

Express internally Node.js HTTP server functionality use karta hai.

```text
Express app
    ↓
Node.js HTTP server
    ↓
TCP
    ↓
Network
```

---

# 5. Basic Express Server

```js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Express");
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
```

Flow:

```text
GET /
 ↓
app.get("/")
 ↓
Handler
 ↓
res.send()
 ↓
Browser
```

---

# 6. `res.send()` vs `res.end()`

Dono response complete kar sakte hain, lekin abstraction level different hai.

## `res.end()`

`res.end()` Node.js ke underlying HTTP response (`ServerResponse`) ka method hai.

Example:

```js
res.end("Hello");
```

Ya:

```js
res.end(Buffer.from("Hello"));
```

Ye response body ka data send karke response finish karta hai.

---

## `res.send()`

```js
res.send("Hello");
```

`res.send()` Express ka higher-level response helper hai.

Ye content ke type ke according response ko prepare karta hai, relevant headers set kar sakta hai, body send karta hai aur response end karta hai.

---

# 7. Important Correction: `res.send()` Always `text/html` Nahi Hota

Ye kehna:

```text
res.send()
→ Content-Type: text/html; charset=utf-8
```

har case mein correct nahi hai.

Express passed value ke type ke according response handle karta hai.

### String

```js
res.send("Hello");
```

Typically:

```text
Content-Type: text/html; charset=utf-8
```

### Object

```js
res.send({
  name: "Akram"
});
```

Express JSON response bhejta hai:

```text
Content-Type: application/json; charset=utf-8
```

### Buffer

```js
res.send(Buffer.from("Hello"));
```

Buffer ke case mein response handling string/object se different hoti hai.

### Simple Rule

> **`res.send()` content ke type ke according response ko prepare karta hai.**

---

# 8. `res.end()` vs `res.send()` Comparison

| `res.end()` | `res.send()` |
|---|---|
| Node.js HTTP response method | Express response helper |
| Lower-level | Higher-level |
| Response body end karta hai | Body + headers handling simplify karta hai |
| String/Buffer/Uint8Array-type data send kar sakta hai | String, object, array, Buffer etc. handle kar sakta hai |
| Express-specific formatting nahi | Express extra behavior provide karta hai |
| Node.js `ServerResponse` se related | Express `res` object par available |

---

# 9. Example: Node.js `http` vs Express

### Node.js `http`

```js
import http from "node:http";

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello");
});

server.listen(4000);
```

### Express

```js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(4000);
```

Express common HTTP tasks ko simpler API mein provide karta hai.

---

# 10. `X-Powered-By: Express`

Express by default commonly response mein:

```text
X-Powered-By: Express
```

header add karta hai.

Example:

```text
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
...
```

---

# 11. Disable `X-Powered-By`

Technology disclosure reduce karne ke liye:

```js
app.disable("x-powered-by");
```

use kar sakte hain.

Iske baad:

```text
X-Powered-By: Express
```

header send nahi hoga.

### Important

Ye complete security solution nahi hai.

Ye sirf unnecessary framework disclosure ko reduce karta hai.

---

# 12. ETag Kya Hai?

ETag ka full form:

> **Entity Tag**

ETag ek HTTP response header hai jo resource ki particular representation/version ko identify karne ke liye use hota hai.

Example:

```text
ETag: W/"abc123"
```

Simple idea:

```text
Response
   ↓
ETag
   ↓
"Is representation mein change hua?"
```

---

# 13. ETag ka Purpose

Suppose browser ne:

```text
/users
```

request kiya.

Server response:

```text
ETag: "abc123"
```

Browser/cache is ETag ko remember kar sakta hai.

Next request:

```text
GET /users
If-None-Match: "abc123"
```

Server current ETag compare karta hai.

Agar same hai:

```text
304 Not Modified
```

return kiya ja sakta hai.

---

# 14. `If-None-Match`

Flow:

```text
First Request
    ↓
Server
    ↓
Response + ETag
    ↓
Browser Cache

Next Request
    ↓
If-None-Match
    ↓
Server compares
    ↓
Same representation?
    ↓
304 Not Modified
```

`304` response mein normally response body nahi hoti.

Isse unnecessary data transfer avoid ho sakta hai.

---

# 15. Important Correction: ETag Sirf Conflict Prevention Nahi Hai

ETag ka common automatic use:

```text
Cache validation
```

hai.

```text
ETag
 +
If-None-Match
 +
304 Not Modified
```

Concurrent update control mein bhi ETag use ho sakta hai, lekin commonly:

```text
If-Match
```

ke saath.

So:

```text
If-None-Match
→ Cache validation

If-Match
→ Conditional update / optimistic concurrency
```

---

# 16. Express ETag

Express response methods jaise:

```js
res.send()
```

response representation ke liye ETag generate kar sakte hain.

Express internally ETag generation ke liye `etag` package use karta hai.

Conceptually:

```text
Response Body
      ↓
ETag generation
      ↓
ETag header
```

Express ka default behavior commonly weak ETag hota hai.

Example:

```text
ETag: W/"..."
```

`W/` weak ETag indicate karta hai.

---

# 17. Why Raw Node.js `http` Automatically ETag Nahi Add Karta?

Node.js ka raw:

```js
http
```

module low-level HTTP API provide karta hai.

Agar:

```js
res.end("Hello");
```

use karein, Node.js automatically Express-style ETag generate nahi karta.

Agar ETag chahiye:

```js
res.setHeader("ETag", "...");
```

manually set karna padega.

---

# 18. Express ETag + Cache Validation

Simplified flow:

```text
res.send(body)
      ↓
Express prepares response
      ↓
ETag
      ↓
Browser/cache

Next Request
      ↓
If-None-Match
      ↓
Freshness check
      ↓
Resource unchanged?
      ↓
304 Not Modified
```

Express request freshness check karne ke liye `fresh` package ka use karta hai.

---

# 19. Disable ETag

```js
app.set("etag", false);
```

Isse automatic ETag generation disable ki ja sakti hai.

---

# 20. Configure ETag

### Strong ETag

```js
app.set("etag", "strong");
```

### Weak ETag

```js
app.set("etag", "weak");
```

### Disable

```js
app.set("etag", false);
```

Default Express behavior commonly weak ETag hota hai.

---

# 21. Strong vs Weak ETag

## Strong ETag

Strong validator ka meaning roughly:

> Representations byte-for-byte equivalent hain.

```text
Exact representation
      ↓
Strong ETag
```

## Weak ETag

Weak validator semantic equivalence ko represent kar sakta hai, even when representations byte-for-byte identical na hon.

Example:

```text
W/"abc123"
```

---

# 22. Express vs Node.js `http`

## Node.js `http`

```text
Low-level HTTP API
        ↓
Basic building blocks
        ↓
Manual routing/header handling
```

## Express

```text
Node.js HTTP
      ↓
Express
      ↓
Higher-level framework
      ↓
Routing
Middleware
Response Helpers
ETag handling
etc.
```

---

# 23. Express Repetitive Work ko Simplify Karta Hai

Raw `http`:

```js
if (req.method === "GET" && req.url === "/users") {
  // ...
}
```

Express:

```js
app.get("/users", (req, res) => {
  // ...
});
```

Aur middleware:

```js
app.use(express.json());
```

jaise features se request processing easier hoti hai.

---

# 24. Complete Express Example

```js
import express from "express";

const app = express();

app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Hello from Express");
});

app.get("/api/user", (req, res) => {
  res.send({
    name: "Akram",
    role: "Developer"
  });
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
```

Possible `/api/user` response:

```text
Content-Type: application/json; charset=utf-8
ETag: W/"..."
```

And:

```text
X-Powered-By: Express
```

has been disabled.

---

# 25. Quick Revision

### Express

> Node.js ke upar bana high-level web framework.

### Create app

```js
const app = express();
```

### Routes

```js
app.get()
app.post()
app.put()
app.patch()
app.delete()
```

### Start server

```js
app.listen(4000);
```

### Express response helper

```js
res.send("Hello");
```

### Node.js response end

```js
res.end("Hello");
```

### Disable Express fingerprint header

```js
app.disable("x-powered-by");
```

### Disable ETag

```js
app.set("etag", false);
```

### Strong ETag

```js
app.set("etag", "strong");
```

### Weak ETag

```js
app.set("etag", "weak");
```

### Cache validation

```text
ETag
   ↕
If-None-Match
   ↓
304 Not Modified
```

---

# 26. Final Mental Model

```text
Node.js
   ↓
http module
   ↓
Low-level HTTP APIs
   ↓
Express
   ↓
High-level Web Framework
   ↓
Routes + Middleware + Response Helpers
   ↓
API / Web Application
```

## ETag Mental Model

```text
First Request
    ↓
Server
    ↓
Response + ETag
    ↓
Browser Cache

Next Request
    ↓
If-None-Match
    ↓
Server compares ETag
    ↓
Same?
  ↙   ↘
YES    NO
 ↓      ↓
304    New Response
```

## One-Line Summary

> **Express.js Node.js ke HTTP functionality ke upar bana high-level web framework hai jo routing, middleware aur response handling ko easy banata hai; `res.send()` Express ka higher-level response helper hai, jabki `res.end()` underlying Node.js HTTP response ko finish karta hai, aur Express by default ETag jaise response features bhi provide karta hai.**
