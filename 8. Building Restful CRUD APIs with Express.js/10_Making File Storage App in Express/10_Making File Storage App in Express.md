# File Storage App with Express.js

This simple Express app provides a directory-listing API, static file serving, and an optional download mode.

## 1. Enable CORS

```js
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});
```

- Adds a CORS response header allowing browser requests from any origin.
- `*` is permissive; use a trusted origin in production when appropriate.
- CORS is not authentication or access control.

## 2. Serve Files from `storage/`

```js
app.use((req, res, next) => {
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }

  express.static("storage")(req, res, next);
});
```

- `express.static("storage")` serves files inside the `storage` folder.
- A request for `/notes.pdf` can serve `storage/notes.pdf`.
- `?action=download` sets `Content-Disposition: attachment`, asking the browser to download the file rather than display it inline when possible.
- If no file matches, `next()` continues to the next middleware or route.

**Example URL:** `/notes.pdf?action=download`

## 3. Return a Directory Listing

```js
import { readdir } from "node:fs/promises";

app.get("/", async (req, res) => {
  const fileList = await readdir("./storage");
  res.json(fileList);
});
```

- `readdir()` returns the names of entries in `storage/`.
- `res.json()` sends the array as JSON.
- A frontend can fetch this list to display a simple file explorer.

## Request Flow

1. Request enters the CORS middleware.
2. The file middleware checks `?action=download` and tries to serve a static file.
3. If no static file matches, Express continues to the matching route, such as `GET /`, which returns the directory listing.

## Important Notes

- Ensure `storage/` exists. Relative paths are resolved from the Node process's current working directory.
- This code does not implement uploading, authentication, or authorization.
- Directory listings can reveal filenames; restrict access if files are private.
- In production, handle filesystem errors and configure CORS for trusted origins.
