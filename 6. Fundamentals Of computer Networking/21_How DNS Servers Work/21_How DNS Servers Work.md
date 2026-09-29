How DNS Servers Work?

DNS server have a IP which is just to communicate to server
For communication it's not use HTTP protocol it is special protocol for communicating only for DNS that is made on TCP HTTP also made on it
DNS have to IP that is IPv4 and IPv6
each have to IP to be assign if first server is fail or not responding it can talk to the 2nd server
IPv6 is faster then IPv4 is recommended to use IPv6 instead IPv4

A Command is used to check the IP Address form the Domain
nslookup

we have to add arguments such as domain name and DNS IP(Optional)
Example:-
nslookup domainName.xyz 8.8.8.8 // 8.8.8.8 is google DNS 1.1.1.1 is Cloudflare DNS and other DNS Server
It will give the DNS server Name and Address
And also the domain Name and it's IP
if the Domain IP is obtain through cashes it show Non-authoritative
DNS work as:-
First it check for cashes of IP of that domain If not
The OS also cashes the IP if not available then it check to the DNS Server
Server also have cashes if not available it check to the Root Server this server will check for the Root Level Domain then if get like .com it send to top-Level Domain Server it is check and as go like in the DNA Tree goes

When the IP is obtain the Server will Cashes it then the OS then Brower also Cashes

TTLs:-
IT is the time when the cashed IP will expired in the Brower, OS and Etc.
The more time it will be the more performance as it browser have to not search it take directly form cashed
For changing IP it recommended to add less time
DNS Lookup Flow

    You can test DNS resolution using the command:
    nslookup <domainName>

    📶 Preference for IPv6
        If both IPv4 and IPv6 DNS servers are available, your laptop will prefer IPv6 (for better performance and more available addresses).

    🔐 Direct IP Access Control
        Accessing a site via direct IP (like http://142.250.182.14) depends on the website owner—they can allow or block this.

    🌐 Common DNS Servers
        1.1.1.1 → Cloudflare DNS
        8.8.8.8 → Google DNS

    DNS Resolution Steps
        1. Check Browser Cache
            Browser checks if it has the IP for the domain stored.

DNS Resolution Steps 1. Check Browser Cache
Browser checks if it has the IP for the domain stored. 2. Check OS Cache
If not found in the browser, the system checks the Operating System's DNS cache. 3. Ask DNS Resolver (e.g., 1.1.1.1 or 8.8.8.8)
The recursive DNS server checks its own cache. 4. Query Root Server
If the cache misses, it contacts the Root DNS Server (.).
The Root Server responds with the IP address of the Top-Level Domain (TLD) Server (e.g., .com). 5. Query Top-Level Domain Server
Your DNS server asks the TLD Server for the IP of the Authoritative Name Server for the requested domain (e.g., google.com). 6. Query Authoritative Name Server
This server knows the actual IP of the domain.
It responds with the correct IP address. 7. Browser Connects to Web Server
The browser now connects to the web server using the IP and loads the website.
What is a Name Server?
A Name Server is a specialized server on the internet that handles queries about the location of domain names.
It's part of the DNS system and stores DNS records (A, AAAA, MX, etc.) for a domain.
Authoritative Name Servers are the final source of truth for a domain’s IP address.

    What is TTL (Time To Live)?
        TTL is a value (in seconds) that tells how long a DNS record can be cached.
        For example, if TTL = 300, the record can be cached for 5 minutes.
        A shorter TTL means more frequent updates but more DNS traffic. A longer TTL improves performance but may delay changes. S
