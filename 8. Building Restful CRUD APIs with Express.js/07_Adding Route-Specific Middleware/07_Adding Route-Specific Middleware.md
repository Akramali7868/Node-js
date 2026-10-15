# Route-Specific Middleware in Express.js

Route-specific middleware runs only for requests whose URL matches a particular path prefix.

## Syntax

```js
app.use("/path", middlewareFn);
```

- Runs for `/path` and paths such as `/path/123`.
- Does not run for unrelated paths such as `/admin` when mounted at `/user`.
- Middleware runs in registration order, so place it before the route handlers it should protect.
- Multiple middleware functions can handle logging, authentication, and role checks.

## Example

```js
app.use(express.json());

app.use("/admin", (req, res, next) => {
  if (req.body.password === "secret") {
    next();
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.post("/admin", (req, res) => {
  res.send("Hello Admin");
});
```

**Flow:** Request → JSON parser → `/admin` middleware → route handler (only if `next()` is called).

> Note: `app.use("/admin", ...)` matches `/admin` and its sub-paths across HTTP methods. This example expects JSON with `Content-Type: application/json`. In real applications, use proper authentication rather than a hard-coded password.

## `app.use()` vs. `app.get()`

- `app.use("/path", middlewareFn)` mounts middleware for a path prefix, across HTTP methods.
- `app.get("/path", handler)` handles matching **GET** requests for that route pattern.

For larger or nested route structures, use `express.Router()`.
