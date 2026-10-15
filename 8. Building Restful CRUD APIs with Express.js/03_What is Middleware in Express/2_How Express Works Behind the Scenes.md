# Middleware in Express.js

## 1. What Is Middleware?

**Middleware Express.js ka function hota hai jo request-response cycle ke beech execute hota hai.**

Middleware request inspect/modify kar sakta hai, response headers set kar sakta hai, next handler ko control de sakta hai, ya response send kar sakta hai.

Common uses:
- Request logging
- Authentication / authorization
- Request body parsing
- Validation
- Error handling
- Response headers set karna

```text
Client Request
      ↓
Middleware 1
      ↓ next()
Middleware 2
      ↓ next()
Route Handler
      ↓
HTTP Response
```

---

## 2. Middleware Arguments

```js
(req, res, next) => {
  // middleware logic
}
```

- `req`: incoming request ki information, jaise `req.method`, `req.url`, `req.headers`.
- `res`: client ko response send karne ke liye.
- `next`: Express ko agle middleware/handler tak continue karne ke liye.

```js
next();
```

Agar middleware `next()` call nahi karta aur response bhi send nahi karta, request pending reh sakti hai.

---

## 3. Multiple Middleware in `app.get()`

```js
app.get(
  "/",
  (req, res, next) => {
    console.log("Middleware 1");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 2");
    next();
  },
  (req, res) => {
    console.log("Route handler");
    res.send("Hello, World!");
  }
);
```

Flow:

```text
GET /
  ↓
Middleware 1
  ↓ next()
Middleware 2
  ↓ next()
Route handler
  ↓ res.send()
Response sent
```

Express route match hone par callbacks ko order mein invoke karta hai.

---

## 4. Important: `next()` ke Baad Kya Hota Hai?

```js
app.get("/", (req, res, next) => {
  console.log("First");
  next();
  console.log("After next");
}, (req, res) => {
  console.log("Second");
  res.send("Done");
});
```

Typical output:

```text
First
Second
After next
```

**Correction:** Ye kehna sahi nahi hai ki `next()` ke baad wali line next middleware ke complete hone tak wait karti hai. `next()` agle handler ko invoke kar sakta hai; current function mein `next()` ke baad ka code us handler ke complete hone se pehle execute ho sakta hai.

Agar control aage pass karna hai, usually `next()` ke baad extra code na likhein, ya `return next()` use karein where appropriate.

---

## 5. Middleware Chain ko Rokna

```js
app.get("/", (req, res) => {
  res.send("Response sent");
});
```

Response send/end karne ke baad normal chain continue nahi hoti, jab tak aap explicitly `next()` call na karein.

```text
Request
   ↓
Middleware
   ↓
res.send()
   ↓
Response complete
```

---

## 6. `next()` vs `next(err)`

| Code | Meaning |
|---|---|
| `next()` | Normal middleware chain continue karo |
| `next(err)` | Error-handling chain ko control do |
| `next("route")` | Route middleware context mein current route ke remaining callbacks skip karke next matching route try karo |

Example:

```js
app.get("/example", (req, res, next) => {
  next(new Error("Something failed"));
});
```

---

## 7. Error-Handling Middleware

Error-handling middleware ke **4 arguments** hote hain:

```js
(err, req, res, next) => {
  // handle error
}
```

- `err`: error object
- `req`: request
- `res`: response
- `next`: error ko aage pass karne ke liye

Example:

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});
```

Express four-argument signature se ise normal middleware se distinguish karta hai.

---

## 8. `next(err)` Kaise Kaam Karta Hai?

```js
app.get("/example", (req, res, next) => {
  next(new Error("Intentional Error"));
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send("Something went wrong!");
});
```

Flow:

```text
Route / Middleware
       ↓
next(err)
       ↓
Skip normal middleware
       ↓
Error handler
       ↓
Error response
```

---

## 9. `throw new Error()` Example

```js
app.get(
  "/",
  (req, res, next) => {
    throw new Error("Intentional Error");
    res.end("Hello, World! 1");
  },
  (req, res, next) => {
    console.log("This will not run after the error.");
    res.write("Hello, World! 2");
  }
);

app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).end("Something went wrong!");
});
```

Jab ye line execute hoti hai:

```js
throw new Error("Intentional Error");
```

current handler ka normal execution stop ho jata hai. Isliye uske baad ka `res.end("Hello, World! 1")` execute nahi hota.

Error Express ke error-handling path mein jata hai, aur error handler response send karta hai.

```text
GET /
  ↓
First route callback
  ↓
throw Error
  ↓
Skip remaining normal route callbacks
  ↓
Error middleware
  ↓
"Something went wrong!"
```

**Note:** `res.write()` alone response complete nahi karta; response ko end karna zaroori hai.

---

## 10. Global Error Handler

Global error handler routes aur normal middleware mein aane wale errors ko centrally handle kar sakta hai.

```js
app.use((err, req, res, next) => {
  console.error("An error occurred:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send("Something went wrong!");
});
```

### Placement Rule

Error handler ko routes aur normal middleware ke **baad** register karein.

```text
Normal Middleware
      ↓
Routes
      ↓
404 Handler (optional)
      ↓
Error-Handling Middleware
```

Agar error handler error handle nahi kar sakta, to `next(err)` se aage pass kar sakta hai.

`res.headersSent` check karta hai ki response headers pehle hi send hue hain ya nahi.

---

## 11. `res.end()` vs `res.send()` in an Error Handler

Node.js-style response:

```js
res.statusCode = 500;
res.end("Something went wrong!");
```

Express-style response:

```js
res.status(500).send("Something went wrong!");
```

---

## 12. Complete Express Example

```js
import express from "express";

const app = express();

app.get(
  "/",
  (req, res, next) => {
    console.log("Middleware 1");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 2");
    next();
  },
  (req, res) => {
    res.send("Hello, World!");
  }
);

app.get("/error", (req, res, next) => {
  next(new Error("Intentional Error"));
});

// Register after routes.
app.use((err, req, res, next) => {
  console.error("An error occurred:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send("Something went wrong!");
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
```

Test:
- `GET http://localhost:4000/` → `Hello, World!`
- `GET http://localhost:4000/error` → `Something went wrong!`

---

## 13. Common Middleware Uses

### Logging

```js
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
```

### JSON Body Parsing

```js
app.use(express.json());
```

Incoming JSON request body parse karne mein help karta hai, jisse parsed data `req.body` par available ho sakta hai.

### Authentication

```js
app.use((req, res, next) => {
  // Check user authentication here.
  next();
});
```

Real authentication middleware ko user verify karna chahiye; sirf `next()` call karna authentication nahi hai.

### Error Handling

```js
app.use((err, req, res, next) => {
  res.status(500).send("Server Error");
});
```

---

## 14. Quick Revision

### Normal middleware

```js
(req, res, next) => {}
```

### Continue normal chain

```js
next();
```

### Pass error

```js
next(new Error("Failed"));
```

### Error middleware

```js
(err, req, res, next) => {}
```

### Error response

```js
res.status(500).send("Something went wrong!");
```

### Remember

```text
next()
→ Normal chain continues

next(err)
→ Error-handling chain

res.send() / res.end()
→ Response sent and ended
```

---

## 15. One-Line Summary

> **Express middleware request-response cycle mein execute hone wale functions hain. `next()` normal chain continue karta hai, `next(err)` error-handling middleware tak control bhejta hai, aur four-argument `(err, req, res, next)` middleware errors ko centrally handle karta hai.**
