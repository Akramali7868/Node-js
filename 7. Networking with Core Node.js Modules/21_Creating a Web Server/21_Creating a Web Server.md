# Creating a Web Server with Node.js

Node.js mein basic **web server** banane ke liye hum mainly `http` aur
`fs` modules use kar sakte hain. Is example mein server static files
jaise HTML, CSS aur JavaScript ko client/browser ko serve karta hai.

## Basic Flow

``` text
Browser / Client
       │
       │ HTTP Request
       ▼
Node.js Web Server
       │
       │ Read file
       ▼
   public folder
       │
       │ File Stream
       ▼
HTTP Response
       │
       ▼
Browser
```

## 1. Importing Modules

``` js
import { createReadStream } from "fs";
import http from "http";
```

  -----------------------------------------------------------------------
  Module                              Purpose
  ----------------------------------- -----------------------------------
  `http`                              HTTP server create aur
                                      request/response handle karna

  `fs`                                File system ke saath kaam karna

  `createReadStream()`                File ko readable stream ke form
                                      mein read karna
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 2. Creating the Server

``` js
const server = http.createServer((req, res) => {
  // request handling
});
```

`http.createServer()` HTTP server create karta hai. Har incoming request
par callback execute hota hai.

  Parameter   Meaning
  ----------- ------------------------------------------
  `req`       Client ki incoming HTTP request
  `res`       Client ko response bhejne ke liye object

------------------------------------------------------------------------

## 3. `req.url`

``` js
console.log(req.url);
```

`req.url` requested path batata hai.

``` text
http://localhost:4000/
        ↓
req.url = "/"

http://localhost:4000/about.html
        ↓
req.url = "/about.html"
```

------------------------------------------------------------------------

## 4. Handling the Root Route

``` js
if (req.url === "/") {
  const readStream = createReadStream("./public/index.html");
  readStream.pipe(res);
}
```

Agar client `/` request karta hai, server:

``` text
./public/index.html
```

serve karega.

Flow:

``` text
GET /
  ↓
req.url === "/"
  ↓
./public/index.html
  ↓
createReadStream()
  ↓
readStream.pipe(res)
  ↓
Browser
```

------------------------------------------------------------------------

## 5. Handling Other Routes

``` js
else {
  const readStream = createReadStream(`./public${req.url}`);

  readStream.on("error", (err) => {
    console.log(err.message);
    res.statusCode = 404;
    res.end("Not Found!");
  });

  readStream.pipe(res);
}
```

Example:

``` text
GET /about.html
        ↓
./public/about.html
```

``` text
GET /style.css
        ↓
./public/style.css
```

``` text
GET /script.js
        ↓
./public/script.js
```

------------------------------------------------------------------------

## 6. Static File Serving

Project structure:

``` text
project/
│
├── app.js
│
└── public/
    ├── index.html
    ├── about.html
    ├── style.css
    └── script.js
```

  Request         File served
  --------------- -----------------------
  `/`             `./public/index.html`
  `/index.html`   `./public/index.html`
  `/about.html`   `./public/about.html`
  `/style.css`    `./public/style.css`
  `/script.js`    `./public/script.js`

------------------------------------------------------------------------

## 7. `createReadStream()`

``` js
const readStream = createReadStream("./public/index.html");
```

`createReadStream()` file ko **Readable Stream** ke form mein open karta
hai.

Large file ko ek saath memory mein load karne ke bajay data chunks mein
read kiya ja sakta hai:

``` text
File
 ↓
Chunk 1 ──► Response
Chunk 2 ──► Response
Chunk 3 ──► Response
Chunk 4 ──► Response
```

Is approach se complete file ko memory mein hold karne ki zarurat nahi
padti.

------------------------------------------------------------------------

## 8. `readStream.pipe(res)`

``` js
readStream.pipe(res);
```

Meaning:

> Readable stream se data directly HTTP response stream mein flow karo.

``` text
File
 │
 ▼
readStream
 │
 │ pipe()
 ▼
res
 │
 ▼
Client
```

`readStream` file data read karta hai aur `res` us data ko HTTP response
ke through client ko send karta hai.

------------------------------------------------------------------------

## 9. Error Handling

Agar requested file exist nahi karti, stream `error` event emit kar
sakta hai.

``` js
readStream.on("error", (err) => {
  console.log(err.message);

  res.statusCode = 404;
  res.end("Not Found!");
});
```

Flow:

``` text
Request
   ↓
createReadStream()
   ↓
File exists?
   ├── Yes → pipe(res)
   │
   └── No → "error" event
                ↓
             statusCode = 404
                ↓
             Not Found!
```

> Sirf `res.end("Not Found!")` likhne se response automatically `404`
> nahi hota. Explicitly `res.statusCode = 404` set karna chahiye.

------------------------------------------------------------------------

## 10. Starting the Server

``` js
server.listen(4000, "0.0.0.0", () => {
  console.log("Server started");
});
```

Yahan:

``` text
Port → 4000
Host → 0.0.0.0
```

------------------------------------------------------------------------

## 11. What Does `0.0.0.0` Mean?

``` js
server.listen(4000, "0.0.0.0");
```

`0.0.0.0` ka meaning hai server ko machine ke available IPv4 network
interfaces par listen karne ke liye bind karna.

LAN testing mein agar server machine ka IP:

``` text
192.168.0.210
```

hai, to doosre device se:

``` text
http://192.168.0.210:4000
```

access kiya ja sakta hai, provided firewall/network configuration allow
kare.

### Important

`0.0.0.0` khud browser mein use karne wala server IP nahi hai. Browser
mein normally machine ka actual LAN IP use hota hai.

------------------------------------------------------------------------

## 12. Complete Server Code

``` js
import { createReadStream } from "fs";
import http from "http";

const server = http.createServer((req, res) => {
  console.log(req.url);

  if (req.url === "/") {
    const readStream = createReadStream("./public/index.html");

    readStream.pipe(res);
  } else {
    const readStream = createReadStream(`./public${req.url}`);

    readStream.on("error", (err) => {
      console.log(err.message);

      res.statusCode = 404;
      res.end("Not Found!");
    });

    readStream.pipe(res);
  }
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started");
});
```

------------------------------------------------------------------------

## 13. Complete Request Flow

Suppose browser request karta hai:

``` text
http://192.168.0.210:4000/about.html
```

### Step 1 --- Browser Request

``` http
GET /about.html HTTP/1.1
```

### Step 2 --- Server gets URL

``` js
req.url
```

returns:

``` text
/about.html
```

### Step 3 --- File Path

``` js
`./public${req.url}`
```

becomes:

``` text
./public/about.html
```

### Step 4 --- Create Stream

``` js
createReadStream("./public/about.html");
```

### Step 5 --- Pipe to Response

``` js
readStream.pipe(res);
```

### Step 6 --- Browser receives file

``` text
Browser
   │
   │ GET /about.html
   ▼
Node.js Server
   │
   ▼
public/about.html
   │
   ▼
createReadStream()
   │
   ▼
pipe(res)
   │
   ▼
HTTP Response
   │
   ▼
Browser
```

------------------------------------------------------------------------

## 14. Important Concepts

  -----------------------------------------------------------------------
  Concept                             Meaning
  ----------------------------------- -----------------------------------
  `http.createServer()`               HTTP server create karta hai

  `req`                               Incoming HTTP request

  `res`                               Outgoing HTTP response

  `req.url`                           Requested URL/path

  `createReadStream()`                File ko readable stream ke form
                                      mein open karta hai

  `readStream.pipe(res)`              File stream ko HTTP response mein
                                      pipe karta hai

  `"error"`                           Stream error event

  `res.statusCode = 404`              HTTP 404 status set karta hai

  `server.listen()`                   Server ko specified address/port
                                      par listen karata hai

  `4000`                              Server port

  `0.0.0.0`                           Available IPv4 interfaces par
                                      listen karna
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 15. Important Notes

### `async` ki zarurat nahi

Agar callback ke andar `await` use nahi ho raha:

``` js
http.createServer(async (req, res) => {
```

to `async` unnecessary hai.

Better:

``` js
http.createServer((req, res) => {
```

### MIME Type

Static files serve karte waqt correct `Content-Type` response header set
karna important hai.

Examples:

``` http
Content-Type: text/html
Content-Type: text/css
Content-Type: application/javascript
```

Browser ko content correctly interpret karne mein help milti hai.

### Path Safety

Real production static file server mein `req.url` ko directly filesystem
path mein concatenate karna safe nahi maana jata. Path traversal aur URL
parsing jaise issues handle karne chahiye. Learning example ke liye ye
approach basic concept samajhne ke liye useful hai.

------------------------------------------------------------------------

## 16. Final Mental Model

``` text
HTTP Request
     ↓
http.createServer()
     ↓
req.url
     ↓
Find requested file
     ↓
createReadStream()
     ↓
Readable Stream
     ↓
pipe(res)
     ↓
HTTP Response
     ↓
Client
```

### One-Line Revision

> **`http.createServer()` server create karta hai, `req.url` requested
> path batata hai, `createReadStream()` file ko stream karta hai, aur
> `readStream.pipe(res)` file ko HTTP response ke through client ko send
> karta hai.**
