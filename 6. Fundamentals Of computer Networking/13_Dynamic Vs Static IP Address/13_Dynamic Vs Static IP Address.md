Dynamic Vs Static IP Address

Dynamic IP Address is assign automatically by DHCP(Dynamic Host Configuration Protocol) Server which router uses and assign to the computers connect to it
Dynamic IP Address have expired time when the IP is expired the new IP Address will assign by DHCP server
It have range of 100 - 200/24
Example:-
192.168.0.100 - 192.168.0.200 // Dynamic Assign Range

When DHCP server is open it also enables Address Reservation 
In which we can assign a static IP to the computer connect this is better way so router will know that is Address is assign and it will not confit the Addresses.

When Disable the DHCP server
The devices connect to the router have to manual provide the IP to them Self as router IP Assign Server or DHCP server is Disable without assign own IP Address devices will not connect as IP is not assign
Static IP Address
In sub devices that are connect to router have option of DHCP server or manual/Static 
Which enable us to assign a IP Address own. 
But it may confit when router is assign a IP address to a device but enter the same IP Address
To prevent this it is convention or do a setting in our router Panel that
the DHCP assign a IP range to A to T and when we enter a static IP so DHCP will assign A TO T so we have to assign T to Z

This will prevent Confit because router will not know what is the IP Address because connection as If same IP Address connection will not happen

That way using Static IP Address and Disable the DHCP server form admin panel may create problem

Dynamic IP Address
Definition: Ek aisa IP address jo time ke sath change hota rehta hai.
Assigned By: Automatically milta hai DHCP (jaise router ya ISP) se.
Stability: Har reboot ya kuch samay baad change ho sakta hai.
Cost: Usually free hota hai internet plan ke sath.
Use Cases: Home networks, personal devices, general internet use.
Security: Thoda zyada secure hota hai normal users ke liye (trace karna mushkil).
Configuration: User ko manually kuch set karne ki zarurat nahi.
🖥 Static IP Address
Definition: Ek fixed IP address jo same rehta hai jab tak manually change na kiya jaye.
Assigned By: Manually configure hota hai ya ISP assign karta hai.
Stability: Hamesha same rehta hai.
Cost: Mostly extra cost lagti hai.
Use Cases: Servers, website hosting, remote access, VPN setup.
Security: Thoda vulnerable ho sakta hai agar properly secure na ho.
Configuration: Manual setup required hota hai.
💡 Quick Tip:
Agar tumhe ek hi device ko baar-baar remotely access karna hai, to Static IP better hai.
Normal browsing, streaming, gaming ke liye Dynamic IP perfect hai. 


Feature	            Dynamic IP	                               Static IP
Definition	An IP address that changes periodically.	An IP address that remains fixed.

Assigned By	Automatically by DHCP (router or ISP).	Manually configured or assigned by ISP.

Stability	Varies – can change after reboot or over time.	Always the same unless manually changed.

Cost	Usually free with most internet plans.	Often comes with additional cost.

Use Cases	Home networks, personal devices, general use.	Servers, hosting, remote access, VPN setup.

Security	More secure for average users (less traceable).	More vulnerable unless secured properly.

Configuration	Requires no setup by the user.	Requires manual setup/configuration. Se