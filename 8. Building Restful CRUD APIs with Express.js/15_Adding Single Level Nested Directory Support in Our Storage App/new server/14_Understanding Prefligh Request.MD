# Understanding Preflight Requests (Hinglish)

## Preflight Request Kya Hai?

CORS mein, agar browser ko koi **non-simple cross-origin request** bhejni hoti hai, to woh actual request se pehle server ko ek `OPTIONS` request bhej sakta hai. Isse **preflight request** kehte hain.

Browser server se check karta hai: **“Kya is origin ko is HTTP method aur in headers ke saath request bhejne ki permission hai?”**

## 1. Preflight Kab Hota Hai?

Har cross-origin request ke liye preflight nahi hota. Browser preflight tab bhejta hai jab request CORS ke *simple request* rules ko meet nahi karti.

Common examples:
- `PUT`, `PATCH`, ya `DELETE` jaise methods.
- Custom headers, jaise `Authorization`.
- `Content-Type: application/json` ke saath `POST`.

## 2. Simple Request Kya Hai?

Simple CORS request mein aam taur par:
- Method `GET`, `HEAD`, ya `POST` hota hai.
- Safelisted headers use hote hain.
- `POST` ke liye `Content-Type` allowed types mein hota hai: `application/x-www-form-urlencoded`, `multipart/form-data`, ya `text/plain`.

Sirf `GET` ya `POST` hone ka matlab ye nahi ki preflight kabhi nahi hoga. Headers aur content type bhi matter karte hain. HTML form requests aksar simple rules meet kar sakti hain, lekin har form/request automatically simple nahi hoti.

## 3. Request Flow

1. Frontend ek non-simple cross-origin request karna chahta hai.
2. Browser pehle `OPTIONS` preflight request bhejta hai.
3. Server CORS response headers ke through allowed origin, method aur headers batata hai.
4. Permission sahi ho, to browser actual request bhejta hai. Permission na mile, to browser actual request nahi bhejta.

## 4. Important CORS Headers

```http
Access-Control-Allow-Origin: http://127.0.0.1:5500
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

- `Access-Control-Allow-Origin`: kaunsa origin response read kar sakta hai.
- `Access-Control-Allow-Methods`: kaunse methods allowed hain.
- `Access-Control-Allow-Headers`: kaunse request headers allowed hain.

## 5. Example

```js
fetch("http://localhost:4000/api", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "Akram" })
});
```

`PATCH` method aur `application/json` content type ki wajah se browser aam taur par pehle `OPTIONS` request bhejega.

## 6. Quick Comparison

| Simple CORS request | Non-simple CORS request |
|---|---|
| `GET`, `HEAD`, ya eligible `POST` | Jaise `PUT`, `PATCH`, `DELETE` |
| Safelisted headers | Custom/non-safelisted headers ho sakte hain |
| Usually preflight nahi | Usually pehle `OPTIONS` preflight |

## Important Note

Preflight browser ka CORS permission check hai; ye authentication ya authorization ka replacement nahi hai. Server ko actual request par bhi authentication aur permission validate karni chahiye.
