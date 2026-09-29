Creating Our Own WAN

Creating Our Own WAN (Wide Area Network)
🧠 Starting Point: 2 Routers, 2 PCs
Suppose tumhare paas do routers hain:
Ek TP-Link router
Ek Airtel router
Aur har router se ek-ek PC connected hai:
PC1 ⇄ TP-Link router
PC2 ⇄ Airtel router
Ab yeh dono alag-alag LANs ban gaye hain.

❓ Can one PC access the other router?
TP-Link wale PC ka default gateway hoga kuch like 192.168.0.1
Airtel wale ka kuch like 192.168.1.1
🔍 Ab agar tum TP-Link wale PC me browser me Airtel ka IP daalte ho (e.g., 192.168.1.1), to kuch bhi access nahi hoga, kyunki dono LANs separate hain.

🔌 WAN Port ka Use
✅ Step-by-step:
TP-Link router ke WAN port me ek Ethernet cable lagao
Us cable ka doosra end Airtel router ke LAN port me lagao
(Yes! Usually Ethernet cable hi hoti hai — correct assumption 💯)

What Happens Now?
Airtel router ab TP-Link router ke WAN port ko ek IP address assign karega.
Ab TP-Link router ke through Airtel ke network ko access kiya ja sakta hai.
📌 BUT: Ye one-way communication hota hai.
TP-Link → Airtel ✅
Airtel → TP-Link ❌
Airtel wale side se TP-Link router ke internal network ko access nahi kar sakte.

🔁 Two-Way Communication Setup (Advanced)
Agar tum chahte ho ki dono routers ek dusre ke network ko access kar saken, to:
✅ Use LAN-to-LAN connection, not WAN.
Required Steps:
TP-Link aur Airtel ke LAN ports ko connect karo via Ethernet
DHCP server ko ek router me off karna hoga
(taaki IP conflict na ho)
⚠️ Yeh process thoda technical hota hai aur manually setup karna padta hai:
Subnet settings adjust karni padti hain
Routing rules define karne hote hain
IP conflicts avoid karne hote hain
Real-World WAN Example (Ghar ka Router)
Hamare ghar me bhi jo broadband router hota hai (like Airtel, Jio, etc.), usme WAN port hota hai.
Us WAN port me jo cable connected hoti hai, wo actually kisi doosre remote router (jaise kisi ISP ka node) se connected hoti hai.
Ye remote router kabhi-kabhi TP-Link jaisa hi hota hai, lekin wo ISP ke control me hota hai.
🌊 Real WAN:
Jo cable us router me lagi hoti hai, wo kahin door se aati hai
Kabhi-kabhi oceans ke undersea fiber cables se connected hoti hai
Aur isi tarah se humara ghar ka router pure world ke internet se connect ho pata hai See
