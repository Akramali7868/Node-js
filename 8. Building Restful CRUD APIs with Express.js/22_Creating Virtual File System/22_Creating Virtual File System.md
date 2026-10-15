# Creating a Virtual File System (Node.js + Express)

Is approach mein uploaded file ko `storage/` folder mein generated ID ke saath save kiya jaata hai, aur uski details `filesDB.json` mein rakhi jaati hain.

## 1. Generate a Unique ID

```js
const id = crypto.randomUUID();
```

- `crypto.randomUUID()` ek UUID generate karta hai.
- Is ID ko file ke internal identifier ke roop mein use kar sakte hain.

## 2. Get the File Extension

```js
const extension = path.extname(filename);
```

- `path.extname()` filename se extension nikalta hai.
- Example: `photo.png` → `.png`, `report.pdf` → `.pdf`.
- Extension user ke filename se aata hai, isliye upload ke waqt file type validate karein.

## 3. Save the Actual File

```js
const writeStream = createWriteStream(`./storage/${id}${extension}`);
req.pipe(writeStream);
```

- `createWriteStream()` file write karne ke liye stream banata hai.
- `req.pipe(writeStream)` request body ke bytes ko file mein stream karta hai.
- Stored filename generated ID + extension hota hai, jaise `a1b2...png`.
- Production code mein stream ke `error` aur `finish` events handle karein; metadata tabhi save karein jab file successfully write ho chuki ho.

## 4. Store Metadata in `filesDB.json`

Example:

```json
[
  {
    "id": "generated-uuid",
    "extension": ".png",
    "name": "photo.png"
  }
]
```

- `id`: file ka internal identifier.
- `extension`: stored file ka extension.
- `name`: original filename, jo UI mein dikhaya ja sakta hai.

JSON mein metadata hota hai; actual file bytes `storage/` mein rehte hain.

## 5. Import a JSON File

Supported Node.js ES module setups mein:

```js
import fileData from "../filesDB.json" with { type: "json" };
```

- `fileData` imported JSON data hai.
- `with { type: "json" }` runtime ko batata hai ki file JSON hai.
- Imported data ko mutate karne se disk wali JSON file automatically update nahi hoti.

## 6. Write Updated Metadata to JSON

```js
await writeFile(
  "./filesDB.json",
  JSON.stringify(filesData, null, 2)
);
```

- `JSON.stringify()` JavaScript data ko JSON text mein convert karta hai.
- `writeFile()` us text ko disk par save karta hai.
- `await` write operation complete hone ka wait karta hai.
- `null, 2` JSON ko readable indentation deta hai.

**Important:** Pehle in-memory array update karein, phir `writeFile()` se disk par save karein. Simultaneous writes lost updates ya corruption cause kar sakti hain; larger apps mein database use karna better hai.

## 7. Download by ID

Request se ID milne par metadata mein record find karein:

```js
const fileData = filesData.find((file) => file.id === id);
```

Record milne par `storage/${id}${fileData.extension}` wali file serve ki ja sakti hai. Record na mile to `404` return karein. User input validate karein aur ensure karein ki resolved path `storage/` ke andar hi rahe.

## Request Flow

1. Upload request aati hai.
2. Server unique ID generate karta hai aur extension nikalta hai.
3. File bytes `storage/` mein ID-based filename se save hote hain.
4. Metadata (`id`, `extension`, original `name`) `filesDB.json` mein save hota hai.
5. Download ke waqt ID se metadata find hota hai, phir stored file serve hoti hai.

## Key Takeaway

**Virtual file system ka idea:** actual files ko generated IDs se store karo, aur original filename jaise metadata ko alag JSON/database mein rakho. JSON file production-grade database ka replacement nahi hai.
