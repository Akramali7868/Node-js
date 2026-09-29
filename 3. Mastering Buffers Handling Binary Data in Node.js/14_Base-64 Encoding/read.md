# 🔐 Base64 Encoding

## 🧠 What is Base64?

Base64 ek **Binary-to-Text Encoding Scheme** hai.

Ye binary data ko **text/string format** mein represent karta hai.

📦 Binary Data
   ↓
🔤 Base64 Encoding
   ↓
📝 Text / String


## 📦 Kis Type ka Data Base64 mein Convert Ho Sakta Hai?

Base64 kisi bhi binary data ko represent kar sakta hai:

📄 PDF
🖼️ Image
🎵 MP3
🎬 MP4
📁 ZIP
📃 TXT
📦 Any Binary Data


## 🔢 Base64 mein 64 Characters Hote Hain

Base64 ka character set:

🔠 `A-Z` → 26 characters

🔡 `a-z` → 26 characters

🔢 `0-9` → 10 characters

➕ `+` → 1 character

➗ `/` → 1 character

━━━━━━━━━━━━━━━━━━━━
🎯 Total = 64 Characters
━━━━━━━━━━━━━━━━━━━━


# ⚙️ Base64 Kaise Work Karta Hai?

Base64 **8-bit bytes ko 6-bit groups** mein divide karta hai.

### Example: `"abc"`

Pehle characters ko binary mein:

```text
a = 01100001
b = 01100010
c = 01100011

➡️ Combined:

01100001 01100010 01100011
✂️ Ab 6-bit groups mein divide:
011000 010110 001001 100011
🔢 Har group ka decimal value:
011000 = 24
010110 = 22
001001 = 9
100011 = 35
🔤 Base64 table se character:
24 → Y
22 → W
 9 → J
35 → j
🎯 Final Result:
"abc"
  ↓
01100001 01100010 01100011
  ↓
011000 010110 001001 100011
  ↓
24  22  9  35
  ↓
Y   W   J   j
  ↓
"YWJj"

✅ abc ka Base64 representation = YWJj

🔄 Base64 Decoding

Base64 ko wapas original data mein convert bhi kar sakte hain:

"YWJj"
   ↓
🔓 Base64 Decode
   ↓
"abc"

Isliye Base64 encryption nahi hai ❌

Base64 ko koi bhi easily decode kar sakta hai.

🌐 Base64 Ka Use Kahan Hota Hai?

Base64 ka use tab hota hai jab hame binary data ko text-safe format mein bhejna ya store karna ho.

Examples:

🌐 APIs / JSON
📧 Email attachments
🖼️ Data URLs
💾 Text-based storage
📡 Network transmission

🧠 Important Point

Base64:

❌ Encryption nahi hai
❌ Data ko secure nahi karta
❌ Data ko compress nahi karta

✅ Binary data ko text representation mein convert karta hai.

⭐ One-Line Summary

🔥 Base64 = Binary Data → 6-bit Groups → 64 Characters → Text/String

Example:

📦 Binary
   ↓
🔐 Base64 Encode
   ↓
📝 "YWJj"