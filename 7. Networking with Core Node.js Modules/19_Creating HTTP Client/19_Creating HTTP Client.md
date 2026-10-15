# Creating HTTP Client in Node.js

Node.js ke `http` module ka use karke hum **HTTP client** create kar
sakte hain.

HTTP client ka kaam hota hai:

``` text
Client → HTTP Request → Server
Client ← HTTP Response ← Server
```

Yahan Node.js ka program client ka role perform karega aur kisi HTTP
server ko request bhejega.

------------------------------------------------------------------------

# 1. HTTP Server

Sabse pehle ek HTTP server create karte hain:

``` js
import http from "node:http";

const server = http.createServer((request, response) => {
  console.log("Got the request");

  console.log(request.method);
  console.log(request.url);

  request.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  response.end("Hello from http server");
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server Started");
});
```

Server:

``` text
IP:   192.168.0.210
Port: 4000
```

Client is server ko request bhejega:

``` text
http://192.168.0.210:4000
```

------------------------------------------------------------------------

# 2. Creating HTTP Client

Node.js mein HTTP request bhejne ke liye:

``` js
import http from "http";
```

Phir:

``` js
const clientRequest = http.request({
  method: "POST",
  hostname: "192.168.0.210",
  port: 4000,
});
```

Yahan:

  Property     Meaning
  ------------ -----------------------------------------
  `method`     HTTP request method
  `hostname`   Server ka hostname/IP address
  `port`       Server jis port par listen kar raha hai

Is example mein:

``` js
method: "POST"
```

matlab client **POST request** send karega.

``` js
hostname: "192.168.0.210"
```

matlab request is IP address wale server ko jayegi.

``` js
port: 4000
```

matlab server ke port `4000` par request jayegi.

------------------------------------------------------------------------

# 3. Sending Request Body

Request create karne ke baad:

``` js
clientRequest.write("Hi I am client");
```

Ye string HTTP request ki **body** mein send hogi.

Complete client:

``` js
import http from "http";

const clientRequest = http.request({
  method: "POST",
  hostname: "192.168.0.210",
  port: 4000,
});

clientRequest.write("Hi I am client");
```

Lekin request ko complete/send karne ke liye:

``` js
clientRequest.end();
```

karna important hai.

Better version:

``` js
import http from "http";

const clientRequest = http.request({
  method: "POST",
  hostname: "192.168.0.210",
  port: 4000,
});

clientRequest.write("Hi I am client");

clientRequest.end();
```

------------------------------------------------------------------------

# 4. Receiving HTTP Response

Server jab response bhejta hai, client `"response"` event listen kar
sakta hai:

``` js
clientRequest.on("response", (response) => {
  // response received
});
```

Example:

``` js
clientRequest.on("response", (response) => {
  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});
```

Yahan:

``` text
clientRequest
      │
      │ request
      ▼
   Server
      │
      │ response
      ▼
response event
      │
      ▼
response data chunks
```

------------------------------------------------------------------------

# 5. Complete HTTP Client

``` js
import http from "http";

const clientRequest = http.request({
  method: "POST",
  hostname: "192.168.0.210",
  port: 4000,
});

clientRequest.write("Hi I am client");

clientRequest.on("response", (response) => {
  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});

clientRequest.end();
```

------------------------------------------------------------------------

# 6. What Happens Internally?

Suppose server:

``` text
192.168.0.210:4000
```

Client:

``` text
method: POST
hostname: 192.168.0.210
port: 4000
body: "Hi I am client"
```

Flow:

``` text
┌─────────────────────┐
│      HTTP Client    │
│                     │
│ POST /              │
│ Body:               │
│ "Hi I am client"    │
└──────────┬──────────┘
           │
           │ HTTP Request
           ▼
┌─────────────────────┐
│    HTTP Server      │
│ 192.168.0.210:4000  │
│                     │
│ request.method      │
│ request.url         │
│ request body        │
└──────────┬──────────┘
           │
           │ HTTP Response
           ▼
┌─────────────────────┐
│      HTTP Client    │
│                     │
│ response event      │
│        ↓            │
│ data event          │
│        ↓            │
│ chunk.toString()    │
└─────────────────────┘
```

------------------------------------------------------------------------

# 7. Server Side: Receiving Request Body

Server mein request body directly ek single string ke form mein nahi
milti.

Request ek **stream** hai.

Isliye:

``` js
request.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

use karte hain.

Example:

``` js
request.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

Agar client send karta hai:

``` text
Hi I am client
```

Server ko chunk mil sakta hai:

``` text
"Hi I am client"
```

Large body mein multiple chunks bhi aa sakte hain:

``` text
chunk 1 → "Hi I am"
chunk 2 → " client"
```

Isliye request body ko stream ke through receive kiya jata hai.

------------------------------------------------------------------------

# 8. Client Side: Receiving Response Body

Same concept response par bhi apply hota hai.

Server:

``` js
response.end("Hello from http server");
```

Client:

``` js
clientRequest.on("response", (response) => {
  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});
```

Response bhi stream ki tarah chunks mein receive ho sakta hai.

------------------------------------------------------------------------

# 9. `request` vs `response`

Ye difference important hai:

  Object            Represents                    Direction
  ----------------- ----------------------------- -----------------
  `clientRequest`   Client ki outgoing request    Client → Server
  `request`         Server ko received request    Client → Server
  `response`        Server ka outgoing response   Server → Client

Flow:

``` text
Client
  │
  │ clientRequest
  ▼
Server
  │
  │ response
  ▼
Client
```

Server side:

``` js
http.createServer((request, response) => {
});
```

Client side:

``` js
const clientRequest = http.request(...);

clientRequest.on("response", (response) => {
});
```

------------------------------------------------------------------------

# 10. `clientRequest.write()` vs `clientRequest.end()`

### `write()`

Request body mein data send karta hai:

``` js
clientRequest.write("Hi I am client");
```

Multiple times bhi call kar sakte hain:

``` js
clientRequest.write("Hello ");
clientRequest.write("from ");
clientRequest.write("client");
```

### `end()`

Request ko finish karta hai:

``` js
clientRequest.end();
```

Data ke saath directly bhi:

``` js
clientRequest.end("Hi I am client");
```

Is case mein separate `write()` ki zarurat nahi:

``` js
const clientRequest = http.request({
  method: "POST",
  hostname: "192.168.0.210",
  port: 4000,
});

clientRequest.on("response", (response) => {
  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});

clientRequest.end("Hi I am client");
```

------------------------------------------------------------------------

# 11. Adding Request Headers

HTTP client request mein headers bhi set kar sakte hain:

``` js
const clientRequest = http.request({
  method: "POST",
  hostname: "192.168.0.210",
  port: 4000,
  headers: {
    "Content-Type": "text/plain",
  },
});
```

JSON bhejna ho:

``` js
const clientRequest = http.request({
  method: "POST",
  hostname: "192.168.0.210",
  port: 4000,
  headers: {
    "Content-Type": "application/json",
  },
});

clientRequest.end(JSON.stringify({
  name: "Rahul",
  age: 25,
}));
```

------------------------------------------------------------------------

# 12. Handling Response Status Code

Client response ka status code bhi access kar sakta hai:

``` js
clientRequest.on("response", (response) => {
  console.log(response.statusCode);

  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});
```

Example:

``` text
200
```

Agar server resource nahi find kar paya:

``` text
404
```

------------------------------------------------------------------------

# 13. Handling Response Headers

Response ke headers:

``` js
clientRequest.on("response", (response) => {
  console.log(response.headers);

  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});
```

Specific header:

``` js
console.log(response.headers["content-type"]);
```

------------------------------------------------------------------------

# 14. Error Handling

Network request mein error aa sakta hai.

Isliye:

``` js
clientRequest.on("error", (error) => {
  console.log(error);
});
```

Complete example:

``` js
import http from "http";

const clientRequest = http.request({
  method: "POST",
  hostname: "192.168.0.210",
  port: 4000,
});

clientRequest.on("response", (response) => {
  console.log("Status:", response.statusCode);

  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});

clientRequest.on("error", (error) => {
  console.log("Request Error:", error);
});

clientRequest.end("Hi I am client");
```

------------------------------------------------------------------------

# Important Concepts

  -----------------------------------------------------------------------
  Concept                             Meaning
  ----------------------------------- -----------------------------------
  `http.request()`                    HTTP request create karta hai

  `method`                            GET, POST, PUT, DELETE etc.

  `hostname`                          Server ka hostname/IP

  `port`                              Server ka listening port

  `clientRequest.write()`             Request body mein data send karta
                                      hai

  `clientRequest.end()`               Request complete karta hai

  `clientRequest.on("response")`      Server ka response receive karta
                                      hai

  `response.on("data")`               Response body ke chunks receive
                                      karta hai

  `response.statusCode`               Response ka HTTP status code

  `response.headers`                  Response headers

  `clientRequest.on("error")`         Request/network error handle karta
                                      hai
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Final Mental Model

``` text
             HTTP REQUEST
Client ─────────────────────────► Server
       method
       headers
       body

             HTTP RESPONSE
Client ◄───────────────────────── Server
       status code
       headers
       body
```

### Node.js Client

``` js
const clientRequest = http.request(options);

clientRequest.write(data);

clientRequest.on("response", (response) => {
  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});

clientRequest.end();
```

### Node.js Server

``` js
const server = http.createServer((request, response) => {

  request.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  response.end("Hello from http server");
});
```

**Core idea:**

``` text
http.request()
      ↓
Creates Client Request
      ↓
write()/end()
      ↓
Request goes to Server
      ↓
Server sends Response
      ↓
"response" event
      ↓
"data" event
      ↓
Receive response chunks
```
