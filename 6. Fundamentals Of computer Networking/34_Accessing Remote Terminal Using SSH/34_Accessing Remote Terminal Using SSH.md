Accessing Remote Terminal Using SSH

SSH => (Secure Shell) ek rules hai ek server ko doosre server se baat karne ke liye ye TCP protocol par bani hai

Remote Terminal Access using SSH
🔑 SSH (Secure Shell)
Ek network protocol jo hume ek computer ke terminal ko doosre computer se securely access karne deta hai.
Yeh TCP pe based hai aur default port 22 use karta hai.

⚙️ SSH Setup aur Installation
Check SSH installed hai ya nahi
ssh -V → SSH client ka version check karega
dpkg -l | grep openssh-client → Client installed hai ya nahi
dpkg -l | grep openssh-server → Server installed hai ya nahi
Agar installed nahi hai toh:
sudo apt update
sudo apt install openssh-server
Firewall allow karna (UFW)
sudo ufw allow ssh
SSH server ka status check
sudo systemctl status ssh

🌐 Network Details Check
hostname -I → System ka IP address dega
whoami → Current user ka username dega

Connect karna (Client → Server)
Ek terminal (client) se doosre system (server) pe login karne ke liye:
ssh username@ip_address
Example:
ssh aviral@192.168.1.9
👉 Yahaan:
aviral = server system ka username
192.168.1.9 = server system ka IP address
Phir woh password maangega aur access mil jaayega.

🎯 Use Case
Ek system pe SSH server run karo
Dusre system se client use karke connect ho jao
Bas ek hi terminal me tum dusre machine ko operate kar paoge (as if local ho).

💡 Summary
SSH secure remote access deta hai
TCP port 22 use hota hai
Client aur server dono systems me properly configure hone chahiye
Once connected, full terminal access milta hai doosre computer pe

SSH stands for secure shell using this we can have whole access of the terminal of that system and it is secure the
data travel not in plain text it's is travel in  encrypted form

using ssh hostname@
