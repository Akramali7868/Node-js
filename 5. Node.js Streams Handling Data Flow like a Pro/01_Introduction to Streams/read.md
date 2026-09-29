# 🌊 Introduction to Streams in Node.js

## 🧠 What is a Stream?

Stream ka matlab hai data ko **ek saath poora load karne ke bajay
chhote-chhote chunks mein continuously read/write/process karna**.

📁 Large File
   ↓
📦 Chunk 1
   ↓
📦 Chunk 2
   ↓
📦 Chunk 3
   ↓
📦 Chunk 4
   ↓
   ...

👉 Har chunk ko process kiya ja sakta hai bina poori file ko RAM
mein load kiye.


# ❌ Without Stream

Agar hum `readFile()` use karte hain:

```js
const data = await fs.readFile("large-file.mp4");

Flow:

📁 Large File
      ↓
📦 Complete Buffer
      ↓
🧠 RAM
      ↓
⚙️ Process

⚠️ Problem:

Agar file bahut badi hai, to poori file RAM mein load hogi.

💾 5 GB File
↓
🧠 ~5 GB Memory Usage

🚀 With Stream

Stream file ko chunks mein read karta hai:

const stream = fs.createReadStream("large-file.mp4");

stream.on("data", (chunk) => {
    console.log(chunk);
});

Flow:

📁 Large File
      ↓
📦 Chunk 1 → ⚙️ Process
      ↓
📦 Chunk 2 → ⚙️ Process
      ↓
📦 Chunk 3 → ⚙️ Process
      ↓
📦 Chunk 4 → ⚙️ Process

✅ Puri file ek saath RAM mein load nahi hoti.

🧩 Stream ka Basic Concept
📤 Data Source
     ↓
🌊 Stream
     ↓
📦 Chunk
     ↓
⚙️ Process

Chunk = Data ka chhota portion.

🔥 Streams Kahan Useful Hote Hain?

📁 Large Files
🎬 Video Streaming
🎵 Audio Streaming
📡 Network Data
📤 File Upload
📥 File Download
📝 Large Text Files

🧱 Types of Streams in Node.js

Node.js mein mainly 4 types ke streams hote hain:

1️⃣ Readable Stream 📖

Data ko read karne ke liye.

fs.createReadStream("file.txt");
2️⃣ Writable Stream ✍️

Data ko write karne ke liye.

fs.createWriteStream("file.txt");
3️⃣ Duplex Stream 🔄

Read + Write dono kar sakta hai.

🌐 Example: Network Socket

4️⃣ Transform Stream ⚙️

Data ko read karke transform karta hai aur output deta hai.

Example:

📥 Input Data
     ↓
⚙️ Transform
     ↓
📤 Changed Data
🧠 Buffer vs Stream

📦 Buffer

📁 Complete File
      ↓
📦 Buffer
      ↓
🧠 RAM

🌊 Stream

📁 File
 ↓
📦 Chunk 1 → Process
📦 Chunk 2 → Process
📦 Chunk 3 → Process
📦 Chunk 4 → Process
⭐ Main Difference

📦 Buffer → Data ko memory mein hold karta hai.

🌊 Stream → Data ko gradually chunks mein handle karta hai.

🎯 One-Line Definition

🌊 Stream = Data ko continuously small chunks mein read, write,
ya process karne ka mechanism.

💡 Large data + limited memory = Streams are very useful.