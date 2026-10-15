# Anatomy of HTTP Request and Response

HTTP ek **stateless protocol** hai jisme client (browser ya program)
server ko request bhejta hai aur server us request ka response deta hai.

HTTP/1.x mein request aur response ka structure text-based hota hai aur
unke specific parts defined hote hain.

``` text
Client
   │
   │ HTTP Request
   ▼
Server
   │
   │ HTTP Response
   ▼
Client
```

------------------------------------------------------------------------

# HTTP Request

HTTP Request wo message hai jo **client server ko bhejta hai**.

Ek HTTP/1.x request ke mainly 3 parts hote hain:

1.  **Request Line**
2.  **Headers**
3.  **Body** --- Optional

## HTTP Request Format

``` http
<Method> <Path> <HTTP Version>
<Header-Name-1>: <Header-Value-1>
<Header-Name-2>: <Header-Value-2>

<Optional-Body>
```

Structure:

``` text
Request Line
     ↓
Headers
     ↓
Blank Line
     ↓
Optional Body
```

------------------------------------------------------------------------

# 1. Request Line

Request line mein 3 important parts hote hain:

``` text
Method + Path + HTTP Version
```

Example:

``` http
GET /index.html HTTP/1.1
```

  Part            Meaning
  --------------- ------------------
  `GET`           HTTP Method
  `/index.html`   Resource ka path
  `HTTP/1.1`      HTTP version

Breakdown:

``` http
GET /index.html HTTP/1.1
│   │           │
│   │           └── HTTP Version
│   └────────────── Path
└────────────────── Method
```

------------------------------------------------------------------------

# 2. Headers

Headers additional information ya **metadata** provide karte hain.

Format:

``` http
Header-Name: Header-Value
```

Example:

``` http
Host: www.example.com
User-Agent: Mozilla/5.0
Accept-Language: en-US
```

  Header             Purpose
  ------------------ --------------------------------------------------
  `Host`             Target server/host batata hai
  `User-Agent`       Client/browser ki information
  `Accept`           Client kis type ka response accept kar sakta hai
  `Content-Type`     Request body ka format
  `Content-Length`   Request body ka size bytes mein

------------------------------------------------------------------------

# 3. Blank Line

Headers ke end mein ek **blank line** hoti hai.

Ye headers aur body ke beech boundary define karti hai.

``` http
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0

<Body>
```

Yahan:

``` text
Headers
   ↓
Blank Line
   ↓
Body
```

> HTTP/1.x mein header section ko body se separate karne ke liye blank
> line important hai.

------------------------------------------------------------------------

# 4. Request Body

Request body **optional** hoti hai.

Body mein client server ko actual data/payload send kar sakta hai.

Commonly body in methods mein use hoti hai:

-   POST
-   PUT
-   PATCH

Example:

``` json
{
  "name": "John Doe",
  "age": 30
}
```

Body ka format batane ke liye `Content-Type` header use kiya jata hai.

------------------------------------------------------------------------

# Example 1: GET Request

``` http
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept-Language: en-US
```

### Explanation

  Part                Meaning
  ------------------- ------------------------------
  `GET`               Data/resource retrieve karna
  `/index.html`       Requested resource ka path
  `HTTP/1.1`          HTTP version
  `Host`              Target host
  `User-Agent`        Client/browser information
  `Accept-Language`   Preferred language

GET request mein generally request body nahi hoti.

------------------------------------------------------------------------

# Example 2: POST Request

``` http
POST /submit-form HTTP/1.1
Host: www.example.com
Content-Type: application/json
Content-Length: 43

{
  "name": "John Doe",
  "age": 30
}
```

### Explanation

**POST Method**

``` text
POST → Server ko data send karna
```

**Content-Type**

``` http
Content-Type: application/json
```

Ye server ko batata hai ki request body ka format JSON hai.

**Content-Length**

``` http
Content-Length: 43
```

Ye request body ki length **bytes mein** represent karta hai. Actual
value exact byte representation par depend karti hai.

**Body**

``` json
{
  "name": "John Doe",
  "age": 30
}
```

Ye actual payload/data hai.

------------------------------------------------------------------------

# HTTP Response

HTTP Response wo message hai jo **server client ko return karta hai**.

HTTP response ke mainly 3 parts hote hain:

1.  **Status Line**
2.  **Headers**
3.  **Body** --- Optional

## HTTP Response Format

``` http
<HTTP Version> <Status Code> <Reason Phrase>
<Header-Name-1>: <Header-Value-1>
<Header-Name-2>: <Header-Value-2>

<Optional-Body>
```

Structure:

``` text
Status Line
     ↓
Headers
     ↓
Blank Line
     ↓
Optional Body
```

------------------------------------------------------------------------

# 1. Status Line

Status line mein 3 important parts hote hain:

``` text
HTTP Version + Status Code + Reason Phrase
```

Example:

``` http
HTTP/1.1 200 OK
```

Breakdown:

``` http
HTTP/1.1 200 OK
│       │   │
│       │   └── Reason Phrase
│       └────── Status Code
└────────────── HTTP Version
```

  Part         Meaning
  ------------ ---------------
  `HTTP/1.1`   HTTP version
  `200`        Status code
  `OK`         Reason phrase

------------------------------------------------------------------------

# 2. Response Headers

Response headers server ke response ke baare mein additional information
provide karte hain.

Example:

``` http
Content-Type: text/html
Content-Length: 1354
```

  Header             Meaning
  ------------------ ---------------------------------
  `Content-Type`     Response body ka format
  `Content-Length`   Body ka size bytes mein
  `Cache-Control`    Caching behavior
  `Location`         Redirect/new resource location
  `Set-Cookie`       Client ke liye cookie set karna

------------------------------------------------------------------------

# 3. Response Body

Response body mein server ka actual returned content hota hai.

Examples:

-   HTML
-   JSON
-   Plain text
-   Image/data
-   Other resource content

Example:

``` html
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    Hello, world!
  </body>
</html>
```

Response body **optional** hoti hai. Kuch responses mein body nahi hoti,
jaise `204 No Content`.

------------------------------------------------------------------------

# Complete HTTP Response Example

``` http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1354

<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    Hello, world!
  </body>
</html>
```

### Breakdown

**Status Line**

``` http
HTTP/1.1 200 OK
```

``` text
HTTP/1.1 → HTTP version
200      → Status code
OK       → Reason phrase
```

**Headers**

``` http
Content-Type: text/html
Content-Length: 1354
```

Response body ke baare mein information dete hain.

**Blank Line**

Headers aur body ko separate karti hai.

**Body**

``` html
<html>
  ...
</html>
```

Actual HTML content.

------------------------------------------------------------------------

# Request vs Response

  -----------------------------------------------------------------------
  Feature                 HTTP Request            HTTP Response
  ----------------------- ----------------------- -----------------------
  Sent by                 Client                  Server

  First line              Request Line            Status Line

  First line contains     Method + Path + Version Version + Status Code +
                                                  Reason Phrase

  Headers                 Request headers         Response headers

  Body                    Optional                Optional

  Example                 `GET /users HTTP/1.1`   `HTTP/1.1 200 OK`
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Request and Response Side-by-Side

``` text
              HTTP REQUEST
Client ─────────────────────────────► Server

GET /users HTTP/1.1
Host: example.com
Accept: application/json

              HTTP RESPONSE
Client ◄───────────────────────────── Server

HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "name": "Rahul"
  }
]
```

------------------------------------------------------------------------

# Request Line vs Status Line

## Request Line

Client → Server

``` http
GET /users HTTP/1.1
```

Formula:

``` text
Method + Path + HTTP Version
```

## Status Line

Server → Client

``` http
HTTP/1.1 200 OK
```

Formula:

``` text
HTTP Version + Status Code + Reason Phrase
```

### Easy Way to Remember

``` text
REQUEST
Method + Path + Version

RESPONSE
Version + Status Code + Reason Phrase
```

------------------------------------------------------------------------

# Headers Are Key-Value Pairs

HTTP headers ka basic format:

``` text
Name: Value
```

Example:

``` http
Content-Type: application/json
```

Yahan:

``` text
Name  → Content-Type
Value → application/json
```

Multiple headers:

``` http
Host: example.com
User-Agent: Mozilla/5.0
Accept: application/json
```

------------------------------------------------------------------------

# Body Is Optional

Har HTTP message mein body hona necessary nahi hai.

``` text
Request
├── Request Line
├── Headers
├── Blank Line
└── Optional Body
```

``` text
Response
├── Status Line
├── Headers
├── Blank Line
└── Optional Body
```

Examples:

``` text
GET       → Usually no request body
POST      → Commonly has request body
PUT       → Commonly has request body
PATCH     → Commonly has request body
204       → No response body
HEAD      → No response body
```

------------------------------------------------------------------------

# HTTP Request/Response Anatomy

``` text
┌─────────────────────────────────────┐
│          HTTP REQUEST               │
├─────────────────────────────────────┤
│ Request Line                        │
│ GET /users HTTP/1.1                 │
├─────────────────────────────────────┤
│ Headers                             │
│ Host: example.com                   │
│ Accept: application/json            │
├─────────────────────────────────────┤
│ Blank Line                          │
├─────────────────────────────────────┤
│ Optional Body                       │
│ {"name":"Rahul"}                    │
└─────────────────────────────────────┘
                    │
                    │
                    ▼
                 SERVER
                    │
                    │
                    ▼
┌─────────────────────────────────────┐
│          HTTP RESPONSE              │
├─────────────────────────────────────┤
│ Status Line                         │
│ HTTP/1.1 200 OK                     │
├─────────────────────────────────────┤
│ Headers                             │
│ Content-Type: application/json      │
├─────────────────────────────────────┤
│ Blank Line                          │
├─────────────────────────────────────┤
│ Optional Body                       │
│ {"message":"Success"}               │
└─────────────────────────────────────┘
```

------------------------------------------------------------------------

# Important Key Points

  Concept             Meaning
  ------------------- --------------------------------------------
  **Request Line**    Method + Path + HTTP Version
  **Status Line**     HTTP Version + Status Code + Reason Phrase
  **Headers**         Additional metadata as key-value pairs
  **Blank Line**      Headers aur body ke beech boundary
  **Request Body**    Client se server ko optional data
  **Response Body**   Server se client ko optional returned data
  **HTTP Method**     Client ka requested action
  **Status Code**     Response ka result batata hai
  **Reason Phrase**   Status code ka human-readable phrase

------------------------------------------------------------------------

# Complete Request-Response Cycle

``` text
1. Client creates request
          ↓
2. Request Line
          ↓
3. Request Headers
          ↓
4. Blank Line
          ↓
5. Optional Request Body
          ↓
       SERVER
          ↓
6. Status Line
          ↓
7. Response Headers
          ↓
8. Blank Line
          ↓
9. Optional Response Body
          ↓
       CLIENT
```

------------------------------------------------------------------------

# Final Mental Model

``` text
HTTP REQUEST
────────────
Request Line
    ↓
Headers
    ↓
Blank Line
    ↓
Optional Body

       ↓↓↓

HTTP RESPONSE
─────────────
Status Line
    ↓
Headers
    ↓
Blank Line
    ↓
Optional Body
```

### One-Line Revision

> **Request = Method + Path + Version + Headers + Optional Body**

> **Response = Version + Status Code + Reason Phrase + Headers +
> Optional Body**

> **HTTP/1.x mein blank line headers aur body ke beech boundary define
> karti hai.**

> **HTTP communication ka ye request-response structure client-server
> communication ka fundamental concept hai.**
