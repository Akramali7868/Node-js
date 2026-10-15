# Dynamic Routing in Express.js

Dynamic routing lets one route handle requests with different values, such as different filenames.

## 1. Dynamic Route: `/:filename`

```js
app.get("/:filename", (req, res) => {
  // Handle the requested filename
});
```

- `:` marks a **route parameter**.
- `filename` is the parameter's name.
- Examples: `/notes.txt` gives `filename = "notes.txt"`; `/photo.png` gives `filename = "photo.png"`.

## 2. Read the Parameter with `req.params`

```js
const { filename } = req.params;
```

Express stores route parameters in `req.params`, using the names defined in the route.

For `app.get("/:filename", ...)`, the key is `filename`. If the route were `app.get("/:id", ...)`, use `req.params.id` or `const { id } = req.params`.

## 3. Send a File with `res.sendFile()`

```js
app.get("/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(`${import.meta.dirname}/storage/${filename}`);
});
```

- `import.meta.dirname` gives the directory containing the current ES module file in supported Node.js versions.
- `/storage/` is the folder containing the files.
- `${filename}` inserts the value from the URL into the path.

For example, `GET /notes.txt` attempts to send `storage/notes.txt`.

**Security:** Validate filenames and prevent path traversal before using URL input to build file paths.

## 4. Delete a File with `rm()`

```js
import { rm } from "node:fs/promises";

await rm(`./storage/${filename}`);
```

- `rm()` removes the file at the specified path.
- `await` waits for the filesystem operation to finish.
- If the file does not exist or cannot be removed, it throws an error. Handle it with `try...catch`.

## 5. Rename a File with `rename()`

```js
import { rename } from "node:fs/promises";

app.patch("/:filename", async (req, res) => {
  const { filename } = req.params;
  const { newFileName } = req.body;

  await rename(
    `./storage/${filename}`,
    `./storage/${newFileName}`
  );

  res.json({ message: "Renamed" });
});
```

- `filename` is the current filename from the URL.
- `newFileName` is the new filename sent in the JSON request body.
- `rename(oldPath, newPath)` renames or moves the file from `oldPath` to `newPath`.
- Enable `express.json()` to read a JSON request body.

Example request:
- Method: `PATCH`
- URL: `/old.txt`
- JSON body:

```json
{
  "newFileName": "new.txt"
}
```

This attempts to rename `storage/old.txt` to `storage/new.txt`.

Add validation and `try...catch` in a real app to handle missing names, missing files, and other filesystem errors.

## Quick Summary

| Code | Meaning |
|---|---|
| `/:filename` | Dynamic route parameter |
| `req.params.filename` | Reads the filename from the URL |
| `res.sendFile(path)` | Sends a file to the client |
| `await rm(path)` | Removes a file |
| `await rename(oldPath, newPath)` | Renames or moves a file |



