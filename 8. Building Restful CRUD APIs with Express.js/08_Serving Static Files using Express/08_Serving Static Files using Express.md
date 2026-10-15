# Serving Static Files in Express.js

Express can serve static files (HTML, CSS, JavaScript, images, and videos) using `express.static()`. Use `res.sendFile()` to send one specific file.

## 1. Serve a Static Folder with `express.static()`

`express.static()` is built-in Express middleware that serves files from a folder.

```js
import express from "express";

const app = express();
app.use(express.static("public"));

app.listen(4000);
```

Example structure:

```text
project/
├── app.js
└── public/
    ├── index.html
    ├── style.css
    └── download.mp4
```

Open the video at `http://localhost:4000/download.mp4`.

- Express looks for the requested file inside `public/`.
- `public` is a common convention, not a required folder name.
- For reliable behavior regardless of the process's working directory, use an absolute path to the static folder.

## 2. Send a Specific File with `res.sendFile()`

`res.sendFile()` sends one file and expects an **absolute path**.

```js
app.get("/video", (req, res) => {
  res.sendFile(`${import.meta.dirname}/download.mp4`);
});
```

Here, `import.meta.dirname` gives the directory containing the current ES module file in supported Node.js versions. The template literal appends `download.mp4`.

If the video is inside `public/`:

```js
app.get("/video", (req, res) => {
  res.sendFile(`${import.meta.dirname}/public/download.mp4`);
});
```

### `__dirname` vs. `import.meta.dirname`

- **CommonJS (`require`)**: commonly use `__dirname`.
- **ES modules (`import`)**: use `import.meta.dirname` in supported Node.js versions.

You can use `path.join()` to build paths safely across operating systems.

ES module example:

```js
import path from "node:path";

app.get("/video", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "download.mp4"));
});
```

## 3. Difference

| `express.static()` | `res.sendFile()` |
|---|---|
| Serves files from a folder | Sends a specific file |
| Used as middleware | Usually used inside a route |
| `/download.mp4` can serve `public/download.mp4` | `/video` can send `download.mp4` |

## 4. Video Seeking

Both approaches can serve MP4 files. Browsers may play the video if the format is supported. Seeking (jumping to a different timestamp) typically uses HTTP **Range requests**. Express's static middleware and `res.sendFile()` support range requests in normal configurations.

## Key Takeaways

- `express.static("public")` serves files from the `public` folder.
- `res.sendFile()` sends a particular file using an absolute path.
- `import.meta.dirname` is for ES modules; `__dirname` is commonly used in CommonJS.
- Never build file paths directly from untrusted user input.
