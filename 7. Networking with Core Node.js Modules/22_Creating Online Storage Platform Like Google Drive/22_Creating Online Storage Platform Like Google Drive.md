# Creating Online Storage Platform Like Google Drive

## 1. Basic Goal

Humara goal ek simple online storage/file browser banana hai:

```text
Browser
   ↓
HTTP Request
   ↓
Node.js HTTP Server
   ↓
./storage
   ↓
Files / Folders
   ↓
Browser
```

---

## 2. `readdir()` — Directory ke Files/Folders Read Karna

```js
const itemsList = await readdir("./storage");
```

`readdir()` directory ke andar available entries ki list return karta hai.

Example:

```text
storage/
├── photo.jpg
├── video.mp4
├── document.pdf
└── projects/
```

Result roughly:

```js
[
  "photo.jpg",
  "video.mp4",
  "document.pdf",
  "projects"
]
```

### Simple Definition

> `readdir()` folder ke andar ke files aur folders ke names read karta hai.

---

## 3. `itemsList` ko Loop Karna

```js
let dynamicHTML = "";

itemsList.forEach((item) => {
  dynamicHTML += `<li>${item}</li>`;
});
```

Yahan `itemsList` ke har item ko loop karke HTML banaya ja raha hai.

Example:

```js
itemsList = [
  "photo.jpg",
  "document.pdf",
  "video.mp4"
];
```

Loop ke baad:

```html
<li>photo.jpg</li>
<li>document.pdf</li>
<li>video.mp4</li>
```

`dynamicHTML` mein aa jayega.

Flow:

```text
itemsList
   ↓
forEach()
   ↓
item
   ↓
HTML
   ↓
dynamicHTML
```

---

## 4. Dynamic HTML + Boilerplate

Aapke code mein:

```js
const htmlBoilerplate = await readFile(
  "./boilerPlate.html",
  "utf8"
);

res.end(
  htmlBoilerplate.replace("${dynamicHTML}", dynamicHTML)
);
```

`boilerPlate.html` ek template hai.

Example:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Storage</title>
</head>

<body>
  <h1>My Storage</h1>

  <ul>
    ${dynamicHTML}
  </ul>
</body>
</html>
```

Flow:

```text
boilerPlate.html
       +
dynamicHTML
       ↓
Final HTML
       ↓
res.end()
       ↓
Browser
```

---

# 5. `req.url`

```js
console.log(req.url);
```

`req.url` batata hai client ne kaunsa URL/path request kiya.

Examples:

```text
/
```

```text
/document.pdf
```

```text
/photos/image.jpg
```

---

# 6. Requested File ko `open()` Karna

Code:

```js
const fileHandle = await open(
  `./storage${decodeURIComponent(req.url)}`
);
```

Agar:

```js
req.url = "/document.pdf";
```

to path:

```text
./storage/document.pdf
```

banega.

Agar:

```js
req.url = "/photos/image.jpg";
```

to:

```text
./storage/photos/image.jpg
```

banega.

---

# 7. `decodeURIComponent()` Kya Karta Hai?

URLs mein special characters encoded form mein aa sakte hain.

Example actual filename:

```text
Node.js Curriculum.pdf
```

URL mein:

```text
Node.js%20Curriculum.pdf
```

aa sakta hai.

```js
decodeURIComponent("Node.js%20Curriculum.pdf");
```

result:

```text
Node.js Curriculum.pdf
```

### Important Correction

`decodeURIComponent()` **space ko remove nahi karta**.

Ye:

```text
%20
```

ko:

```text
space
```

mein decode karta hai.

```text
Node.js%20Curriculum.pdf
        ↓
decodeURIComponent()
        ↓
Node.js Curriculum.pdf
```

### Simple Definition

> `decodeURIComponent()` URL-encoded characters ko original characters mein decode karta hai.

---

# 8. Why `decodeURIComponent(req.url)`?

Agar storage mein actual file:

```text
Node.js Curriculum.pdf
```

hai aur browser URL bhejta hai:

```text
/Node.js%20Curriculum.pdf
```

to:

```js
req.url
```

mein encoded path ho sakta hai.

Isliye:

```js
decodeURIComponent(req.url)
```

use karke actual filename/path ke characters obtain karte hain.

Then:

```js
`./storage${decodeURIComponent(req.url)}`
```

becomes:

```text
./storage/Node.js Curriculum.pdf
```

---

# 9. `open()` se File ya Directory Open Karna

```js
const fileHandle = await open(path);
```

`open()` filesystem entry ko open karta hai.

Ye entry:

- file ho sakti hai
- directory ho sakti hai

Uske baad:

```js
const stats = await fileHandle.stat();
```

se information milti hai.

---

# 10. `stat()` se File vs Directory Check

```js
const stats = await fileHandle.stat();

if (stats.isDirectory()) {
  serveDirectory(req, res);
} else {
  const readStream = fileHandle.createReadStream();
  readStream.pipe(res);
}
```

Flow:

```text
Requested Path
      ↓
open()
      ↓
stat()
      ↓
Is Directory?
   ↙       ↘
 YES       NO
  ↓         ↓
Directory  File
  ↓         ↓
List       Read Stream
           ↓
         Response
```

---

# 11. Directory Serve Karna

```js
async function serveDirectory(req, res) {
  const itemsList = await readdir(
    `./storage${req.url}`
  );

  let dynamicHTML = "";

  itemsList.forEach((item) => {
    dynamicHTML += `
      <div>
        <a href="${req.url === "/" ? "" : req.url}/${item}">
          ${item}
        </a>
      </div>
    `;
  });

  const htmlBoilerplate = await readFile(
    "./boilerPlate.html",
    "utf8"
  );

  res.end(
    htmlBoilerplate.replace(
      "${dynamicHTML}",
      dynamicHTML
    )
  );
}
```

Yahan directory ke items ko clickable links banaya ja raha hai.

---

# 12. `<a href>` ka Purpose

Example:

```html
<a href="/document.pdf">
  document.pdf
</a>
```

User file par click karega:

```text
Browser
   ↓
GET /document.pdf
   ↓
Node.js Server
   ↓
open()
   ↓
File
   ↓
createReadStream()
   ↓
pipe(res)
   ↓
Browser
```

---

# 13. Root Directory ka Special Case

Code:

```js
req.url === "/" ? "" : req.url
```

Root path:

```text
/
```

ke liye child URL:

```text
/file.pdf
```

hona chahiye.

Agar current directory:

```text
/photos
```

hai, to child:

```text
/photos/image.jpg
```

hona chahiye.

Concept:

```text
Root:
/
 ↓
/file.pdf

/photos:
 ↓
/photos/image.jpg
```

---

# 14. File ko Stream ke Through Serve Karna

```js
const readStream = fileHandle.createReadStream();

readStream.pipe(res);
```

Flow:

```text
File
 ↓
createReadStream()
 ↓
Chunks
 ↓
response
 ↓
Browser
```

Large files ke liye stream useful hai kyunki poori file ko ek saath RAM mein read karne ki zaroorat nahi hoti.

---

# 15. `readStream.pipe(res)`

`readStream`:

```text
Readable Stream
```

hai.

`res`:

```text
Writable Stream
```

hai.

Isliye:

```text
Readable
   ↓
pipe()
   ↓
Writable
```

File data response mein stream ho jata hai.

---

# 16. Error Handling

Aapke code mein:

```js
try {
  const fileHandle = await open(path);
  // ...
} catch (error) {
  console.log(error.message);
  res.end("Not Found");
}
```

Agar requested file/folder exist nahi karta, `open()` error throw kar sakta hai.

`catch` us error ko handle karta hai.

Better HTTP response:

```js
res.statusCode = 404;
res.end("Not Found");
```

Flow:

```text
Request
   ↓
open()
   ↓
Error?
  ↙   ↘
YES   NO
 ↓     ↓
404   Continue
```

---

# 17. `favicon.ico`

Browser kabhi automatically:

```text
/favicon.ico
```

request karta hai.

Isliye:

```js
if (req.url === "/favicon.ico") {
  return res.end("No favicon");
}
```

favicon request ko handle karta hai.

---

# 18. Complete Server Flow

```js
const server = http.createServer(async (req, res) => {
  if (req.url === "/favicon.ico") {
    return res.end("No favicon");
  }

  if (req.url === "/") {
    serveDirectory(req, res);
  } else {
    try {
      const fileHandle = await open(
        `./storage${decodeURIComponent(req.url)}`
      );

      const stats = await fileHandle.stat();

      if (stats.isDirectory()) {
        serveDirectory(req, res);
      } else {
        const readStream = fileHandle.createReadStream();
        readStream.pipe(res);
      }
    } catch (error) {
      console.log(error.message);
      res.statusCode = 404;
      res.end("Not Found");
    }
  }
});
```

---

# 19. Google Drive jaisa Basic Concept

Storage:

```text
storage/
├── Documents/
│   ├── resume.pdf
│   └── notes.txt
│
├── Images/
│   ├── photo.jpg
│   └── logo.png
│
└── Videos/
    └── video.mp4
```

Browser:

```text
My Storage

📁 Documents
📁 Images
📁 Videos
```

`Documents` par click:

```text
/Documents

📄 resume.pdf
📄 notes.txt
```

File par click:

```text
/Documents/resume.pdf
```

Server:

```text
open()
 ↓
stat()
 ↓
File
 ↓
createReadStream()
 ↓
pipe(res)
 ↓
Browser
```

---

# 20. Complete Mental Model

```text
                  Browser
                     ↓
               HTTP Request
                     ↓
                  req.url
                     ↓
            ./storage + decoded URL
                     ↓
                   open()
                     ↓
                   stat()
                     ↓
              Is Directory?
                ↙       ↘
              YES        NO
               ↓          ↓
          readdir()    createReadStream()
               ↓          ↓
        Dynamic HTML    pipe(res)
               ↓          ↓
            res.end()    Browser
               ↓
            Browser
```

---

# 21. Important URL Encoding Concept

```text
Actual filename:
Node.js Curriculum.pdf

URL:
Node.js%20Curriculum.pdf

decodeURIComponent()
        ↓

Node.js Curriculum.pdf
```

Remember:

```text
URL Encoding:
space → %20

URL Decoding:
%20 → space
```

`decodeURIComponent()` space ko delete nahi karta.

---

# 22. Important Security Note

Learning project ke liye:

```js
`./storage${decodeURIComponent(req.url)}`
```

samajhna useful hai.

Lekin production online storage mein user-controlled path ko directly filesystem path mein use karna unsafe ho sakta hai.

Path traversal jaise attempts possible hote hain:

```text
../
```

Production mein:

```text
User URL
   ↓
Decode
   ↓
Normalize
   ↓
Validate
   ↓
Make sure path stays inside ./storage
   ↓
Open
```

karna chahiye.

---

# 23. Quick Revision

### Directory read

```js
await readdir("./storage");
```

> Folder ke andar entries ki list deta hai.

### Loop

```js
itemsList.forEach((item) => {
  dynamicHTML += `<li>${item}</li>`;
});
```

> Har item ko dynamic HTML mein add karta hai.

### URL

```js
req.url
```

> Requested URL/path deta hai.

### Decode URL

```js
decodeURIComponent(req.url)
```

> `%20` jaise URL-encoded characters ko decode karta hai.

### Open

```js
await open(path)
```

> File ya directory open karta hai.

### Stat

```js
await fileHandle.stat()
```

> Filesystem entry ki information deta hai.

### Directory check

```js
stats.isDirectory()
```

### File stream

```js
fileHandle.createReadStream()
```

### Send file

```js
readStream.pipe(res)
```

### Not found

```js
res.statusCode = 404;
res.end("Not Found");
```

---

# 24. One-Line Summary

> **`readdir()` se storage directory ki entries read hoti hain, `req.url` se requested path milta hai, `decodeURIComponent()` `%20` jaise URL-encoded characters ko original characters mein decode karta hai, `open()` aur `stat()` se file/directory identify hoti hai, aur file ko `createReadStream().pipe(res)` ke through browser ko stream kiya ja sakta hai.**

## Most Important Concept

```text
readdir()
   ↓
Directory entries

req.url
   ↓
Requested path

decodeURIComponent()
   ↓
URL encoding decode

open()
   ↓
File / Directory

stat()
   ↓
File ya Directory?

Directory
   ↓
readdir()
   ↓
Dynamic HTML

File
   ↓
createReadStream()
   ↓
pipe(res)
   ↓
Browser
```




