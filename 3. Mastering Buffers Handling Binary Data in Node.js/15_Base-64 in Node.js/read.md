# 🔐 Base64 Encoding & Decoding in Node.js

import fs from "fs/promises";


# 🖼️ Step 1: Image → Base64 String

const bufferContent = await fs.readFile("favicon/favicon-16x16.png");

const a = bufferContent.toString("base64");

await fs.writeFile("new-file.txt", a);

📌 Yahan:

🖼️ Image
   ↓
📦 Buffer (Binary Data)
   ↓
🔐 `.toString("base64")`
   ↓
📝 Base64 String
   ↓
📄 `new-file.txt`


# 🔓 Step 2: Base64 String → Image

const bufferContent = await fs.readFile("new-file.txt", "utf-8");

const a = Buffer.from(bufferContent, "base64");

await fs.writeFile("a.png", a);

📌 Yahan:

📄 `new-file.txt`
   ↓
📝 Base64 String
   ↓
🔓 `Buffer.from(..., "base64")`
   ↓
📦 Original Binary Data
   ↓
🖼️ `a.png`


# 🔄 Complete Flow

🖼️ Original Image
       ↓
📦 Binary Data / Buffer
       ↓
🔐 Base64 Encode
       ↓
📝 Base64 String
       ↓
💾 Save in `new-file.txt`
       ↓
📖 Read Base64 String
       ↓
🔓 Base64 Decode
       ↓
📦 Same Binary Data
       ↓
🖼️ Recreate `a.png`


# ⚠️ Important

❌ Ye galat approach hai:

const a = bufferContent.toString("base64");

const bufferContent = await fs.readFile("new-file.txt", "utf-8");

const a = bufferContent.toString("base64");


📌 Kyunki `new-file.txt` mein already Base64 string hai.
Usko dobara `.toString("base64")` karne ki zarurat nahi hai.

✅ Correct:

const base64 = await fs.readFile("new-file.txt", "utf-8");

const buffer = Buffer.from(base64, "base64");

await fs.writeFile("a.png", buffer);


# 🧠 Important Difference

🔐 Encoding:

Buffer → Base64 String

```js
buffer.toString("base64")