Adding Global Middleware with app.use() Method

# Global Middleware in Express.js

Global middleware runs for **every incoming request**, regardless of the route or HTTP method.

## Syntax

```js
app.use(middlewareFunction);
```

## Key Points

- Register global middleware **before route handlers** when it should run for all routes.
- Call `next()` to pass control to the next middleware or matching route. Without `next()` (or sending a response), the request may hang.
- Multiple `app.use()` calls can be chained for different middleware tasks.

## Example

```js
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Home Route");
});
```
