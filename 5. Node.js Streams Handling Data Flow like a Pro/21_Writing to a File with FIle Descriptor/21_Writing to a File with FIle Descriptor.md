# 📌 `fs.write()` Callback

```js
fs.write(fd, buffer, (err, bytesWritten, buffer) => {

});
```

### Callback Arguments

```text
err
→ Error information
→ Error nahi hua to null

bytesWritten
→ Actually kitne bytes file mein write hue

buffer
→ Wahi Buffer jo write operation mein diya gaya tha
```

### Example

```js
const buffer = Buffer.from("abc");

fs.write(fd, buffer, (err, bytesWritten, buffer) => {
  console.log(err);
  console.log(bytesWritten);
  console.log(buffer);
});
```

Output:

```text
null
3
<Buffer 61 62 63>
```

### ⭐ Memory Trick

```text
err
→ Error?

bytesWritten
→ Kitne bytes write hue?

buffer
→ Kaunsa Buffer use hua?
```
