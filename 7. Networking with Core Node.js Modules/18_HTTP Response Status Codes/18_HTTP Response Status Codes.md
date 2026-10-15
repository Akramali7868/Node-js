# HTTP Response Status Codes

HTTP response mein **status code** server client ko batata hai ki
request ke saath kya hua.

Example:

``` http
HTTP/1.1 200 OK
```

Yahan:

-   `200` → **Status Code**
-   `OK` → **Reason Phrase**

> **Important:** HTTP status codes standardized conventions hain.
> Application apne internal/custom codes use kar sakti hai, lekin HTTP
> response ke liye standard HTTP status codes ko follow karna best
> practice hai.

------------------------------------------------------------------------

# Status Code Categories

HTTP status codes 5 major categories mein divide hote hain:

  Category        Range Meaning
  ---------- ---------- ---------------
  **1xx**      100--199 Informational
  **2xx**      200--299 Success
  **3xx**      300--399 Redirection
  **4xx**      400--499 Client Error
  **5xx**      500--599 Server Error

### Easy Way to Remember

``` text
1xx → Information
2xx → Success
3xx → Redirection
4xx → Client Error
5xx → Server Error
```

------------------------------------------------------------------------

# 1xx --- Informational

`1xx` status codes ka meaning hai ki server request ko receive/process
kar raha hai aur client ko additional information di ja rahi hai.

  ------------------------------------------------------------------------
                   Status Code Reason Phrase         Description
  ---------------------------- --------------------- ---------------------
                       **100** Continue              Server ne request
                                                     headers receive kar
                                                     liye hain aur client
                                                     ko request body
                                                     continue karne ke
                                                     liye signal karta
                                                     hai.

                       **101** Switching Protocols   Server client ke
                                                     request ke according
                                                     protocol switch kar
                                                     raha hai.
  ------------------------------------------------------------------------

### 100 Continue

Large request body bhejne se pehle client server se confirmation le
sakta hai.

``` text
Client → Request Headers
Server → 100 Continue
Client → Request Body
```

------------------------------------------------------------------------

# 2xx --- Success

`2xx` ka meaning hai ki request successfully receive aur process hui.

  ------------------------------------------------------------------------
                   Status Code Reason Phrase         Description
  ---------------------------- --------------------- ---------------------
                       **200** OK                    Request successfully
                                                     process hui.

                       **201** Created               Request successfully
                                                     process hui aur new
                                                     resource create hua.

                       **204** No Content            Request successfully
                                                     process hui, lekin
                                                     response body mein
                                                     content nahi hai.
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## 200 OK

Sabse common success status code.

Example:

``` http
GET /users
```

Response:

``` http
HTTP/1.1 200 OK
```

``` json
[
  {
    "id": 1,
    "name": "Rahul"
  }
]
```

### Common use

-   GET successful
-   PUT/PATCH successful
-   General successful request

------------------------------------------------------------------------

## 201 Created

Jab request se **new resource create** hota hai.

Example:

``` http
POST /users
```

Response:

``` http
HTTP/1.1 201 Created
```

``` json
{
  "id": 101,
  "name": "Rahul"
}
```

### Easy Rule

``` text
200 → Request successful
201 → Request successful + Resource created
```

------------------------------------------------------------------------

## 204 No Content

Server ne request successfully process kar di, lekin response body nahi
bhejni hai.

Example:

``` http
DELETE /users/101
```

Response:

``` http
HTTP/1.1 204 No Content
```

------------------------------------------------------------------------

# 3xx --- Redirection

`3xx` status codes client ko indicate karte hain ki requested resource
ke liye additional action/redirect ki zarurat ho sakti hai.

  ------------------------------------------------------------------------
                   Status Code Reason Phrase         Description
  ---------------------------- --------------------- ---------------------
                       **301** Moved Permanently     Resource permanently
                                                     new URL/location par
                                                     move ho gaya hai.

                       **302** Found                 Resource temporarily
                                                     different
                                                     URL/location par
                                                     available hai.

                       **304** Not Modified          Cached version abhi
                                                     valid hai; server ko
                                                     resource body dobara
                                                     bhejne ki zarurat
                                                     nahi hai.
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## 301 Moved Permanently

Jab resource permanently move ho jaye.

``` text
/old-page
    ↓
/new-page
```

Browser/client new location ko use kar sakta hai.

------------------------------------------------------------------------

## 302 Found

Resource temporarily different location par available hai.

``` text
/offer
   ↓
/temporary-offer
```

Ye permanent move nahi hai.

------------------------------------------------------------------------

## 304 Not Modified

Client ke paas resource ka cached version already hai aur server
indicate karta hai ki resource modify nahi hua.

``` text
Client → "Has this resource changed?"
Server → "No, use your cached copy."
```

Ismein normally response body nahi hoti.

------------------------------------------------------------------------

# 4xx --- Client Error

`4xx` ka meaning hai ki request mein client side se problem hai.

Problem ho sakti hai:

-   Invalid request
-   Authentication missing
-   Permission missing
-   Resource not found
-   Wrong HTTP method
-   Too many requests

  ------------------------------------------------------------------------
                   Status Code Reason Phrase         Description
  ---------------------------- --------------------- ---------------------
                       **400** Bad Request           Server request ko
                                                     samajh nahi paaya,
                                                     usually invalid
                                                     syntax/request data
                                                     ki wajah se.

                       **401** Unauthorized          Authentication
                                                     required hai ya
                                                     authentication
                                                     credentials valid
                                                     nahi hain.

                       **403** Forbidden             Server ne request
                                                     samajh li, lekin
                                                     client ko access ki
                                                     permission nahi hai.

                       **404** Not Found             Requested resource
                                                     nahi mila.

                       **405** Method Not Allowed    Resource ke liye
                                                     requested HTTP method
                                                     allowed nahi hai.

                       **429** Too Many Requests     Client ne given time
                                                     period mein bahut
                                                     zyada requests bheji
                                                     hain.
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## 400 Bad Request

Request invalid hai.

Example:

``` http
POST /users
```

``` json
{
  "age": "hello"
}
```

Agar API ko numeric age chahiye, server `400 Bad Request` return kar
sakta hai.

``` http
HTTP/1.1 400 Bad Request
```

------------------------------------------------------------------------

## 401 Unauthorized

Authentication required hai.

Example:

``` http
GET /profile
Authorization: missing
```

Response:

``` http
HTTP/1.1 401 Unauthorized
```

### Remember

``` text
401 → Authentication problem
```

------------------------------------------------------------------------

## 403 Forbidden

Server request ko understand karta hai, lekin user/client ke paas
permission nahi hai.

Example:

``` text
User logged in ✅
Permission to delete another user's account ❌
```

Response:

``` http
HTTP/1.1 403 Forbidden
```

### Remember

``` text
401 → Who are you?
403 → I know who you are, but you cannot do this.
```

------------------------------------------------------------------------

## 404 Not Found

Requested resource nahi mila.

``` http
GET /users/9999
```

Agar user `9999` exist nahi karta:

``` http
HTTP/1.1 404 Not Found
```

------------------------------------------------------------------------

## 405 Method Not Allowed

Resource exist karta hai, lekin requested HTTP method allowed nahi hai.

Example:

``` http
DELETE /users
```

Agar `/users` endpoint DELETE support nahi karta:

``` http
HTTP/1.1 405 Method Not Allowed
```

------------------------------------------------------------------------

## 429 Too Many Requests

Client ne short time mein bahut zyada requests bhej di.

Example:

``` text
Client → Request 1
Client → Request 2
Client → Request 3
...
Client → Request 1000
```

Server rate limit apply karke:

``` http
HTTP/1.1 429 Too Many Requests
```

return kar sakta hai.

------------------------------------------------------------------------

# 5xx --- Server Error

`5xx` ka meaning hai ki request server side par problem ki wajah se
successfully complete nahi ho saki.

  -------------------------------------------------------------------------
                   Status Code Reason Phrase         Description
  ---------------------------- --------------------- ----------------------
                       **500** Internal Server Error Server ke andar
                                                     unexpected
                                                     error/condition occur
                                                     hui.

                       **501** Not Implemented       Server requested
                                                     functionality/method
                                                     ko support ya
                                                     implement nahi karta.

                       **502** Bad Gateway           Gateway/proxy ko
                                                     upstream server se
                                                     invalid response mila.

                       **503** Service Unavailable   Server temporarily
                                                     request handle nahi
                                                     kar paa raha.

                       **504** Gateway Timeout       Gateway/proxy ko
                                                     upstream server se
                                                     timely response nahi
                                                     mila.
  -------------------------------------------------------------------------

------------------------------------------------------------------------

## 500 Internal Server Error

Server ke code mein unexpected error aa gaya.

Example:

``` js
const user = null;

console.log(user.name);
```

Agar error properly handle nahi hua, server `500` return kar sakta hai.

``` http
HTTP/1.1 500 Internal Server Error
```

### Remember

``` text
500 → Server ke andar unexpected problem
```

------------------------------------------------------------------------

## 501 Not Implemented

Server requested functionality ko implement/support nahi karta.

``` http
HTTP/1.1 501 Not Implemented
```

------------------------------------------------------------------------

## 502 Bad Gateway

Usually proxy/gateway ko upstream server se invalid response mila.

Architecture:

``` text
Client
  ↓
Nginx / Gateway
  ↓
Node.js Server
```

Agar gateway ko Node.js/upstream server se invalid response mile:

``` text
Gateway → 502 Bad Gateway
```

------------------------------------------------------------------------

## 503 Service Unavailable

Server temporarily available nahi hai.

Possible reasons:

-   Server overloaded
-   Maintenance
-   Temporary outage
-   Service unavailable

``` http
HTTP/1.1 503 Service Unavailable
```

------------------------------------------------------------------------

## 504 Gateway Timeout

Gateway/proxy ne upstream server se timely response receive nahi kiya.

``` text
Client
  ↓
Gateway
  ↓
Upstream Server
  ↓
     ❌ Too slow / no response
  ↓
Gateway → 504 Gateway Timeout
```

------------------------------------------------------------------------

# Important Differences

## 401 vs 403

  Status    Meaning
  --------- ------------------------------------------------------
  **401**   Authentication required/failed
  **403**   Authentication may be known, but access is forbidden

``` text
401 → "Authenticate yourself."
403 → "You are not allowed to do this."
```

------------------------------------------------------------------------

## 400 vs 404

  Status    Meaning
  --------- -------------------------------------------------
  **400**   Request itself is invalid
  **404**   Requested resource doesn't exist/found nahi hua

Example:

``` text
400 → Invalid request
404 → Resource not found
```

------------------------------------------------------------------------

## 500 vs 502 vs 503 vs 504

  Status    Simple Meaning
  --------- -------------------------------------------------
  **500**   Server ke andar unexpected error
  **502**   Gateway ko upstream se invalid response
  **503**   Service temporarily unavailable
  **504**   Gateway ko upstream response time par nahi mila

------------------------------------------------------------------------

# Complete Quick Revision Table

  -----------------------------------------------------------------------
  Range                   Category                Meaning
  ----------------------- ----------------------- -----------------------
  **1xx**                 Informational           Request processing ke
                                                  baare mein information

  **2xx**                 Success                 Request successful

  **3xx**                 Redirection             Further action/redirect
                                                  needed

  **4xx**                 Client Error            Request/client side
                                                  problem

  **5xx**                 Server Error            Server side problem
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Most Important Status Codes to Remember

       Code Meaning                 Easy Memory
  --------- ----------------------- ---------------------------------
    **200** OK                      Success
    **201** Created                 New resource created
    **204** No Content              Success, no body
    **301** Moved Permanently       Permanent redirect
    **302** Found                   Temporary redirect
    **304** Not Modified            Use cached version
    **400** Bad Request             Invalid request
    **401** Unauthorized            Authentication problem
    **403** Forbidden               Permission denied
    **404** Not Found               Resource not found
    **405** Method Not Allowed      HTTP method not allowed
    **429** Too Many Requests       Rate limit
    **500** Internal Server Error   Server error
    **501** Not Implemented         Functionality not implemented
    **502** Bad Gateway             Bad upstream response
    **503** Service Unavailable     Service temporarily unavailable
    **504** Gateway Timeout         Upstream response timeout

------------------------------------------------------------------------

# Node.js Example

Node.js `http` module mein status code set kar sakte hain:

``` js
import http from "node:http";

const server = http.createServer((request, response) => {
  response.statusCode = 200;

  response.setHeader("Content-Type", "text/plain");

  response.end("Hello from server");
});

server.listen(4000);
```

Yahan:

``` js
response.statusCode = 200;
```

response ka HTTP status code set karta hai.

------------------------------------------------------------------------

## Status Code + Headers + Body

``` js
response.writeHead(200, {
  "Content-Type": "application/json"
});

response.end(JSON.stringify({
  message: "Success"
}));
```

Response roughly:

``` http
HTTP/1.1 200 OK
Content-Type: application/json

{"message":"Success"}
```

------------------------------------------------------------------------

# Final Mental Model

``` text
Client
   │
   │ HTTP Request
   │
   ▼
Server
   │
   │ HTTP Response
   │
   ├── Status Code
   ├── Headers
   └── Body
   │
   ▼
Client
```

Example:

``` http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "message": "User not found"
}
```

Yahan:

``` text
404        → Status Code
Not Found  → Reason Phrase
Headers    → Content-Type
Body       → JSON error message
```
