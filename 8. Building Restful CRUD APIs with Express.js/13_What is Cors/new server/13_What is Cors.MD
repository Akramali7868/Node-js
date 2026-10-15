# CORS Kya Hai? (Hinglish Notes)

CORS ka full form **Cross-Origin Resource Sharing** hai. Ye browser ka security mechanism hai jo control karta hai ki ek origin ki website, doosre origin ke server ka response JavaScript se read kar sakti hai ya nahi.

## 1. Origin Kya Hota Hai?

Origin mein 3 cheezein hoti hain:

- **Protocol:** `http` ya `https`
- **Host:** `example.com` ya `127.0.0.1`
- **Port:** `5500`, `4000`, etc.

Example: `http://127.0.0.1:5500` aur `http://127.0.0.1:4000` alag origins hain, kyunki ports alag hain.

## 2. CORS Kyun Use Hota Hai?

Browser kuch cross-origin responses ko JavaScript se read karne se rokta hai, jab tak server permission na de. Isse unwanted cross-origin access ko control karne mein help milti hai.

**Important:** CORS website cloning ko directly nahi rokta aur har tarah ki request ko block nahi karta. Ye mainly browser JavaScript ko response read karne ki permission control karta hai. `curl` jaise tools par browser ke CORS rules apply nahi hote.

CORS 2000s mein standardize hua tha; isse pehle cross-site requests bilkul impossible thi, aisa kehna sahi nahi hai.

## 3. Specific Origin Ko Allow Karna

```js
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  next();
});
```

- `Access-Control-Allow-Origin` ek **response header** hai.
- Ye browser ko batata hai ki kaunsa origin response ko read kar sakta hai.
- Origin mein path ya trailing slash nahi dena chahiye.
- Is example mein sirf `http://127.0.0.1:5500` origin allow kiya gaya hai.

## 4. Sabhi Origins Ko Allow Karna

```js
res.set("Access-Control-Allow-Origin", "*");
```

`*` ka matlab hai ki kisi bhi origin ko eligible response read karne ki permission hai. Ise tabhi use karein jab public access intended ho.

`*` un credentialed CORS requests ke liye kaam nahi karta jahan cookies ya HTTP authentication credentials include hote hain.

## 5. Request Kaise Work Karti Hai?

1. Frontend `http://127.0.0.1:5500` se API `http://localhost:4000` ko request bhejta hai.
2. Server response mein `Access-Control-Allow-Origin` header bhejta hai.
3. Browser header check karta hai. Origin allowed hai to JavaScript response read kar sakta hai; warna browser JavaScript ko response access karne se rok deta hai.

**Note:** `localhost` aur `127.0.0.1` alag hosts hain, isliye ye different origins hain. Header mein wahi exact origin allow karein jo browser ke `Origin` request header mein aata hai.

## 6. Important Points

- CORS browser enforce karta hai, Express khud nahi.
- `Access-Control-Allow-Origin` authentication nahi hai aur API ko secure nahi banata.
- Kuch requests se pehle browser `OPTIONS` preflight request bhejta hai. Server ko `Access-Control-Allow-Methods` aur `Access-Control-Allow-Headers` bhi set karne pad sakte hain.
- Private ya sensitive API ke liye bina soche sabhi origins aur methods allow na karein.

## Quick Summary

**CORS server ko browser ke through ye batane deta hai ki kaunse origins uske cross-origin response ko read kar sakte hain.**
