SSH Public and Private Keys

In this way we can access our SSH without entering password again and again
we have to generate a key using
ssh-keygyen
It will create public and private key in ~/.ssh
when key is generate we have
to paste the public key in ~/.ssh/authrized_keys
only public key to be paste
Not expose the Private Key
know we do
ssh hostname@hostIP
it not ask for password

How works
public key in server SSH take random string encrypt it
Server SSH server send to client and client SSH decrypt it using the private Key that is in .ssh folder
Then the Decrypt string match to the Server SSH create then access will get

If our private Key is on custom paste
we add a -i (i stands for identification file ) flag in ssh and the path of the key

SSH Kya hai?
SSH (Secure Shell) ek protocol hai jo remote systems (jaise servers) ko secure tareeke se access aur manage karne ke liye use hota hai.
Normally login karne ke liye password dalna padta hai, lekin SSH key pairs use karke hum password-less aur secure authentication kar sakte hain.

🗝 SSH Key Pair
Ek SSH key pair me do keys hoti hain:
Public Key
Yeh server pe store hoti hai
Server ise use karke ek challenge encrypt karta hai
Private Key
Yeh tumhare local computer/laptop pe hoti hai (kabhi share nahi karni!)
Tumhari identity prove karne ke liye use hoti hai
👉 Dono ek dusre ke bina kaam nahi karte. Ye ek lock & key system jaisa hai:
Public key = lock (jo server pe lag jata hai)
Private key = key (jo tumhare paas hoti hai unlock karne ke liye)


SSH Authentication Process
Key Pair Generate Karna
ssh-keygen
Default files banti hain:
id_rsa → Private key (local system pe secure rakho)
id_rsa.pub → Public key (server pe bhejna hai)

Public Key Server pe Copy Karna
ssh-copy-id user@server
Yeh tumhari id_rsa.pub ko server ke ~/.ssh/authorized_keys file me daal deta hai.

Connection Time Pe Kaam Kaise Hota Hai
Jab tum ssh user@server likh ke connect karte ho →
Server ek challenge banata hai aur tumhari public key se encrypt kar deta hai.
Tumhara client apni private key use karke usko decrypt karta hai.
Agar decrypt sahi ho jaye → server samajh jata hai ki "Haan bhai, yeh wahi banda hai jiske paas private key hai" → aur access de deta hai ✅.

🎯 Fayda Password se Key Authentication ka
Har baar password type karne ki zarurat nahi
Bruteforce attacks mushkil ho jate hain
Security level high ho jata hai (kyunki private key system ke bahar nahi jati)

👉 Simple Line:
Public key tum server pe chhod dete ho, private key tumhare paas hoti hai. Jab connect karte ho to dono apas me handshake karke tumhari identity verify karte hain. 🔒