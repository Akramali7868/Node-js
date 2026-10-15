
# Online Storage Platform — React Client + Node.js Server

## 1. Project Goal

Ye ek simple **Google Drive-like online storage** project hai.

```text
React Client
     ↕
HTTP Requests
     ↕
Node.js HTTP Server
     ↕
./storage/
     ↕
Files
```

React:
- Files list fetch karta hai
- File upload karta hai
- Upload progress show karta hai
- Open/Download links deta hai

Server:
- Files list karta hai
- Upload save karta hai
- Files read/serve karta hai
- Download response deta hai
- CORS handle karta hai

---

# 2. React Client

## `useState`

```js
const [directoryItems, setDirectoryItems] = useState([]);
const [progress, setProgress] = useState(0);
```

`directoryItems` server se aayi files/folders ki list store karta hai.

Example:

```js
["photo.jpg", "resume.pdf", "video.mp4"]
```

`progress` upload progress store karta hai:

```text
0%
25%
50%
75%
100%
```

---

# 3. `getDirectoryItems()`

```js
async function getDirectoryItems() {
  const response = await fetch("http://192.168.0.210/");
  const data = await response.json();
  setDirectoryItems(data);
}
```

Flow:

```text
React
 ↓
fetch("http://192.168.0.210/")
 ↓
GET /
 ↓
Node Server
 ↓
readdir("./storage")
 ↓
JSON response
 ↓
response.json()
 ↓
setDirectoryItems(data)
 ↓
React re-render
```

### `await fetch()`

HTTP response available hone ka wait karta hai.

### `await response.json()`

Response body ko read karke JSON parse karta hai.

---

# 4. `useEffect()`

```js
useEffect(() => {
  getDirectoryItems();
}, []);
```

Empty dependency array ki wajah se effect component ke initial mount ke baad run hota hai.

```text
Component Mount
 ↓
useEffect
 ↓
getDirectoryItems()
 ↓
GET /
 ↓
Files List
```

---

# 5. File Selection

```jsx
<input type="file" onChange={handleChange} />
```

User file select karta hai:

```text
Choose File
 ↓
onChange
 ↓
handleChange()
```

```js
const file = e.target.files[0];
```

`e.target.files[0]` first selected file deta hai.

---

# 6. Upload with `XMLHttpRequest`

```js
const xhr = new XMLHttpRequest();
```

XMLHttpRequest yahan upload request aur upload progress track karne ke liye use ho raha hai.

```js
xhr.open(
  "POST",
  "http://192.168.0.210/",
  true
);
```

Meaning:

```text
POST
 ↓
http://192.168.0.210/
 ↓
Async request
```

---

# 7. Filename Header

```js
xhr.setRequestHeader("filename", file.name);
```

Client custom request header bhej raha hai:

```text
filename: photo.jpg
```

Server:

```js
const filename = req.headers.filename;
```

se isko read karta hai.

Flow:

```text
file.name
 ↓
filename header
 ↓
req.headers.filename
 ↓
./storage/filename
```

---

# 8. Upload Progress

```js
xhr.upload.addEventListener("progress", (e) => {
  const totalProgress =
    `${Math.round((e.loaded / e.total) * 100)}% Uploaded`;

  setProgress(totalProgress);
});
```

### `e.loaded`

Ab tak kitne bytes upload hue.

### `e.total`

Total bytes.

Formula:

```text
loaded / total × 100
```

Example:

```text
5 MB / 10 MB × 100
= 50%
```

Then React:

```text
50% Uploaded
```

show karta hai.

---

# 9. Sending the File

```js
xhr.send(file);
```

Ye selected file ko request body mein send karta hai.

**Important:** Is code mein previous HTML upload ki tarah `multipart/form-data` nahi hai.

Yahan:

```text
POST
 ↓
Raw file bytes as request body
```

send ho rahe hain.

---

# 10. Upload Complete

```js
xhr.addEventListener("load", () => {
  console.log(xhr.response);
});
```

Server:

```js
res.end("File Uploaded on Server");
```

response bhejta hai.

Client `xhr.response` mein response receive kar sakta hai.

---

# 11. Node.js Server

```js
const server = http.createServer(async (req, res) => {
```

Node.js HTTP server incoming requests ko handle karta hai.

Important objects:

```text
req
 ↓
Readable request stream

res
 ↓
Writable response stream
```

---

# 12. CORS

```js
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Headers", "*");
```

Agar React:

```text
http://localhost:5173
```

par hai aur server:

```text
http://192.168.0.210
```

par hai, to origins different hain.

CORS browser ko cross-origin access allow karne mein help karta hai.

`*` development ke liye convenient hai; production mein specific trusted origin better hota hai.

---

# 13. GET Requests

```js
if (req.method === "GET") {
```

Server GET request handle karta hai.

Main cases:

```text
GET /
   ↓
Directory listing

GET /file.pdf
   ↓
File

GET /file.pdf?action=download
   ↓
Download
```

---

# 14. Root Request

```js
if (req.url === "/") {
  serveDirectory(req, res);
}
```

Client:

```js
fetch("http://192.168.0.210/")
```

bhejta hai.

Server:

```js
serveDirectory(req, res);
```

call karta hai.

---

# 15. `serveDirectory()`

```js
async function serveDirectory(req, res) {
  const [url] = req.url.split("?");

  const itemsList =
    await readdir(`./storage${url}`);

  res.setHeader(
    "Content-Type",
    "application/json"
  );

  res.end(JSON.stringify(itemsList));
}
```

Is function ka kaam:

> `storage` directory ki files/folders list karke React ko JSON mein return karna.

Example:

```js
itemsList = [
  "photo.jpg",
  "resume.pdf"
];
```

`JSON.stringify()`:

```json
["photo.jpg","resume.pdf"]
```

banata hai.

React:

```js
response.json()
```

se ise wapas JavaScript array bana deta hai.

---

# 16. `req.url.split("?")`

Example:

```text
/file.pdf?action=download
```

```js
const [url] = req.url.split("?");
```

Result:

```text
url = /file.pdf
```

Query string:

```text
action=download
```

alag ho jati hai.

---

# 17. Query Parameters

```js
const [url, queryString] = req.url.split("?");

const queryParam = {};

queryString?.split("&").forEach((pair) => {
  const [key, value] = pair.split("=");
  queryParam[key] = value;
});
```

Example:

```text
/file.pdf?action=download
```

Result:

```js
url = "/file.pdf";

queryParam = {
  action: "download"
};
```

Then:

```js
queryParam.action
```

is:

```text
download
```

### Better Modern Approach

Real projects mein:

```js
const parsedUrl = new URL(
  req.url,
  "http://localhost"
);

const pathname = parsedUrl.pathname;
const action = parsedUrl.searchParams.get("action");
```

use karna easier aur safer hai.

---

# 18. Opening the Requested File

```js
const fileHandle = await open(
  `./storage${decodeURIComponent(url)}`
);
```

Example:

```text
URL:
/Node.js%20Curriculum.pdf
```

`decodeURIComponent()`:

```text
/Node.js Curriculum.pdf
```

banata hai.

Then:

```text
./storage/Node.js Curriculum.pdf
```

open hota hai.

### Important

`decodeURIComponent()` space ko remove nahi karta.

```text
%20 → space
```

---

# 19. File vs Directory

```js
const stats = await fileHandle.stat();

if (stats.isDirectory()) {
  serveDirectory(req, res);
} else {
  // File
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
Directory?
 ↙       ↘
YES       NO
 ↓         ↓
List      File
           ↓
       Read Stream
```

---

# 20. Serving a File

```js
const readStream =
  fileHandle.createReadStream();

readStream.pipe(res);
```

Flow:

```text
Disk
 ↓
createReadStream()
 ↓
Chunks
 ↓
HTTP response
 ↓
Browser
```

Large files ke liye useful hai because poori file ko ek saath RAM mein load karne ki zaroorat nahi.

---

# 21. MIME Type

```js
res.setHeader(
  "Content-Type",
  mime.contentType(url.slice(1))
);
```

`mime-types` package extension ke basis par MIME type identify karta hai.

Examples:

```text
.jpg  → image/jpeg
.pdf  → application/pdf
.mp4  → video/mp4
.txt  → text/plain
```

Browser ko pata chalta hai ki response kis type ka content hai.

---

# 22. `Content-Length`

```js
res.setHeader(
  "Content-Length",
  stats.size
);
```

`stats.size` file size **bytes mein** deta hai.

Example:

```text
File
 ↓
stats.size
 ↓
Content-Length
 ↓
Browser
```

---

# 23. Open vs Download

React Open link:

```jsx
<a
  href={`http://192.168.0.210/${item}?action=open`}
>
  Open
</a>
```

Download:

```jsx
<a
  href={`http://192.168.0.210/${item}?action=download`}
>
  Download
</a>
```

Server:

```js
if (queryParam.action === "download") {
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${url.slice(1)}"`
  );
}
```

### Open

Normal MIME response:

```text
Content-Type: application/pdf
```

Browser supported file ko display/play kar sakta hai.

### Download

```text
Content-Disposition: attachment
```

browser ko download/save behavior suggest karta hai.

---

# 24. POST — Upload

Server:

```js
else if (req.method === "POST") {
```

Filename:

```js
const filename = req.headers.filename;
```

Write stream:

```js
const writeStream =
  createWriteStream(`./storage/${filename}`);
```

Request body:

```js
req.on("data", (chunk) => {
  writeStream.write(chunk);
});
```

Complete:

```js
req.on("end", () => {
  res.end("File Uploaded on Server");
});
```

Flow:

```text
React
 ↓
POST /
 ↓
filename header
 +
raw file bytes
 ↓
Node req stream
 ↓
data chunks
 ↓
writeStream
 ↓
./storage/file
 ↓
end
 ↓
response
```

---

# 25. Better Upload Completion

Current code:

```js
req.on("end", () => {
  res.end("File Uploaded on Server");
});
```

Learning ke liye okay hai, but writable stream ko explicitly finish karna better hai:

```js
req.on("end", () => {
  writeStream.end(() => {
    res.end("File Uploaded on Server");
  });
});
```

Concept:

```text
Request body received
 ↓
writeStream.end()
 ↓
File writing finished
 ↓
HTTP response
```

---

# 26. OPTIONS Request

```js
else if (req.method === "OPTIONS") {
  res.end("OK");
}
```

Cross-origin requests mein browser preflight request bhej sakta hai:

```text
OPTIONS
```

Ye code simple `OK` response deta hai.

---

# 27. React File List

```jsx
{directoryItems.map((item, i) => (
  <div key={i}>
    {item}
    <a href={`http://192.168.0.210/${item}?action=open`}>
      Open
    </a>
    <a href={`http://192.168.0.210/${item}?action=download`}>
      Download
    </a>
  </div>
))}
```

Example:

```js
directoryItems = [
  "photo.jpg",
  "resume.pdf"
];
```

UI:

```text
photo.jpg    Open    Download
resume.pdf   Open    Download
```

---

# 28. Complete Listing Flow

```text
React Mount
 ↓
useEffect()
 ↓
getDirectoryItems()
 ↓
GET /
 ↓
serveDirectory()
 ↓
readdir("./storage")
 ↓
JSON.stringify(itemsList)
 ↓
HTTP Response
 ↓
response.json()
 ↓
setDirectoryItems()
 ↓
React re-render
```

---

# 29. Complete Upload Flow

```text
Select File
 ↓
<input type="file">
 ↓
handleChange()
 ↓
XMLHttpRequest
 ↓
POST /
 ↓
filename header
 ↓
file bytes
 ↓
Node req stream
 ↓
writeStream.write(chunk)
 ↓
./storage/file
 ↓
request end
 ↓
HTTP response
```

---

# 30. Complete Open Flow

```text
Click Open
 ↓
GET /file.pdf?action=open
 ↓
Parse URL
 ↓
open("./storage/file.pdf")
 ↓
stat()
 ↓
File
 ↓
createReadStream()
 ↓
Content-Type
 ↓
pipe(res)
 ↓
Browser
```

---

# 31. Complete Download Flow

```text
Click Download
 ↓
GET /file.pdf?action=download
 ↓
Parse query
 ↓
action === "download"
 ↓
Content-Disposition: attachment
 ↓
createReadStream()
 ↓
pipe(res)
 ↓
Browser Download
```

---

# 32. Security Notes

Ye learning project hai. Production mein current code ko directly expose nahi karna chahiye.

### Filename validation

Current:

```js
const filename = req.headers.filename;

createWriteStream(`./storage/${filename}`);
```

Malicious filename/path issue create kar sakta hai.

Filename sanitize/validate karna chahiye.

### Path traversal

Current:

```js
`./storage${decodeURIComponent(url)}`
```

user-controlled path hai.

`../` jaise paths storage ke bahar access attempt kar sakte hain.

Production flow:

```text
User URL
 ↓
Decode
 ↓
Normalize
 ↓
Validate
 ↓
Confirm path is inside storage
 ↓
Open
```

### CORS

Development:

```js
Access-Control-Allow-Origin: *
```

Production mein specific trusted frontend origin allow karna better hota hai.

---

# 33. Important Difference: Previous Multipart Upload vs Current Upload

Previous HTML form:

```text
multipart/form-data
```

Current React upload:

```js
xhr.send(file);
```

Yahan direct file body send ho rahi hai.

### Multipart

```text
POST
 ↓
multipart/form-data
 ↓
boundary
 ↓
part headers
 ↓
file bytes
 ↓
boundary
```

### Current React Upload

```text
POST
 ↓
filename header
 ↓
raw file bytes
```

Isliye current Node.js server upload handling simpler hai.

---

# 34. Final Architecture

```text
                       React Client
                            |
            ┌───────────────┼───────────────┐
            ↓               ↓               ↓
         GET /           POST /          GET /file
            ↓               ↓               ↓
       File List          Upload        Open/Download
            |               |               |
            └───────────────┼───────────────┘
                            ↓
                    Node.js HTTP Server
                            |
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
          readdir()   WriteStream      ReadStream
             ↓              ↓              ↓
          File List      ./storage      Browser
```

---

# 35. Quick Revision

### Client

```js
fetch("/")
```

→ directory list fetch.

```js
response.json()
```

→ JSON response ko JavaScript data mein convert.

```js
XMLHttpRequest()
```

→ upload request + progress tracking.

```js
xhr.upload.addEventListener("progress", ...)
```

→ upload progress.

```js
xhr.send(file)
```

→ raw file bytes server ko send.

### Server

```js
req.method
```

→ HTTP method.

```js
req.url
```

→ requested URL.

```js
req.headers
```

→ request headers.

```js
readdir()
```

→ directory entries.

```js
open()
```

→ file/directory open.

```js
stat()
```

→ metadata.

```js
createReadStream()
```

→ file read as stream.

```js
createWriteStream()
```

→ file write as stream.

```js
readStream.pipe(res)
```

→ file browser ko stream.

```js
writeStream.write(chunk)
```

→ uploaded chunk disk par write.

```js
res.setHeader()
```

→ response headers.

```js
res.end()
```

→ response complete.

---

# 36. One-Line Summary

> **React client HTTP requests ke through Node.js server se files ki list leta hai, XMLHttpRequest ke through file upload aur progress tracking karta hai; Node.js server `readdir()` se files list karta hai, `createWriteStream()` se uploaded file save karta hai aur `createReadStream().pipe(res)` se files ko browser tak stream karta hai.**

## Most Important Mental Model

```text
                 CLIENT
                   |
       ┌───────────┼───────────┐
       ↓           ↓           ↓
    GET /       POST /     GET /file
       ↓           ↓           ↓
     LIST        UPLOAD     OPEN/DOWNLOAD
       |           |           |
       └───────────┼───────────┘
                   ↓
                SERVER
                   ↓
              ./storage/
                   ↓
        ┌──────────┴──────────┐
        ↓                     ↓
   Write Stream          Read Stream
        ↓                     ↓
     Disk File             Browser
```
