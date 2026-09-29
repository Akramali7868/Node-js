Understanding IPv4 Address in Depth

IPv4 Address. . . . . . . . . . . : 192.168.0.102
Subnet Mask . . . . . . . . . . . : 255.255.255.0

192.168.0.102

Min: 0.0.0.0.0
Max: 255.255.255.255

192.168.0.102 = 11000000 10101000 00000000 01100110
255.255.255.255 = 1111111 11111111 11111111 00000000

Subnet Mask => Hamare IP ko do Part me divide karta hai
jitna one rahega ye ek part rahega isko network portin kahte hai ye hamare LAN ke portion ko present karega
and jinta zero rahenge wo host part portion rahenge



IP and IP address are completely different one is a complete protocol and other is protocol address

IPv4 is a 32bit number
xxx.xxx.xxx.xxx this is the format for human can easy understand but 
00000000 00000000 00000000 00000000 this is how goes in binary (low level)

Subnet Mask
Subnet mask ek 32-bit number and Network Portion (are fixed) & Host Portion(are variable can be changed) are divided
IP 192.168.1.10
subnet mask 255.255.255.0
Binary 11111111.11111111.11111111.00000000


 IPv4 Range
Minimum: 0.0.0.0
Maximum: 255.255.255.255
Total unique addresses: 4,294,967,296
Reserved Address Range
127.0.0.0 – 127.255.255.255 → Reserved for Loopback or which is know as localhost.
127.0.0.1 → Loopback address (localhost)
Subnet mask: 255.0.0.0

IPv4 have many drawback as it was older and internet was not popular and they thought it not be success
so IPv6 have invented to prevent the IPv4 limitation and more IP address can assign and other advantages

What is an IP Address?

        IP stands for Internet Protocol.
        An IP address is a unique identifier assigned to every device connected to a network (like the internet).
        It is assigned by a router (in local networks) or ISP (in mobile or broadband networks).
        Note: IP protocol ≠ IP address. The protocol is the set of rules; the address is just a part of it.

    IPv4 Address Format
        IPv4 is a 32-bit binary number, grouped into 4 sections of 8 bits (called octets):
        Example (Binary):  11000000 10101000 00000000 00000001
                    = 192      .168     .0       .1
        It's converted to decimal format for human readability:
        192.168.0.1

    IPv4 Range
        Minimum IPv4 Address: 0.0.0.0
        Maximum IPv4 Address: 255.255.255.255
        Total Unique IPv4 Addresses: 256^4 = 4,294,967,296
Reserved Address Range (Mistake or Limitation of IPv4)
        127.0.0.0 – 127.255.255.255: Reserved for loopback testing (internal testing, like localhost).
        These addresses are not assigned to any device on the network.
        Example:
        127.0.0.1 → Loopback Address
        Subnet Mask: 255.0.0.0

    What is a Subnet Mask?
        A subnet mask is a 32-bit number that divides an IP address into:
            Network portion: Identifies the network.
            Host portion: Identifies the device on that network.
        Example:
        IP Address:    192.168.1.10
        Subnet Mask:   255.255.255.0
        Binary:        11111111.11111111.11111111.00000000

    What is CIDR Notation?
        CIDR stands for Classless Inter-Domain Routing.
        Instead of writing full subnet masks, CIDR uses a shorthand:
        192.168.1.10/24
        /24 means the first 24 bits are for the network, and the remaining 8 bits are for hosts.
        Equivalent Subnet Mask: 255.255.255.0