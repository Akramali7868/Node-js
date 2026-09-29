Runnin Multiple Servers on our Laptop

Hum apne laptop pe ek se zyada servers chala sakte hain, bas unke ports alag-alag hone chahiye.
🔹 Multiple Servers ka Idea
Ek server = ek port.
Agar hum multiple applications ya websites run karna chahte hain, toh har ek ko different port dena hoga.
Example:
Server 1 → 123.45.67.89:5500
Server 2 → 123.45.67.89:3000
Server 3 → 123.45.67.89:8080
🔹 Kaise Possible hai?
Port Forwarding ka use karke hum router ko bata dete hain ki kaunsa port ka traffic humare laptop pe kis server ko bhejna hai.
Har port ek alag entry point ban jata hai.
🔹 Limitation / Problem
Public IP ke saath port number likhna padta hai.
Example: 123.45.67.89:5500
Ye user-friendly nahi lagta, kyunki har baar IP + Port yaad rakhna mushkil hai.
🔹 Solution ka Trailer
Isi problem ko solve karne ke liye DNS (Domain Name System) use hota hai, jisme hum easy names (like mywebsite.com) assign kar dete hain IP ke saath.
Iske baare me hum next lecture me padhenge. 😉
⚡ Summary:
Port forwarding se hum ek laptop pe hazaron servers chala sakte hain, har ek alag port pe. Lekin users ko access karne ke liye public IP + port number likhna padta hai, jo thoda inconvenient hai. DNS isse easy banata hai.