Understanding OSI Model

7. Application layer
6. Presentation Layer
5. Session Layer
4. Transport Layer
3. Network Layer
2. DataLink Layer
1. Physical Layer


OSI Model stands for (Open Systems Interconnection Model) this describe how data will flow though out the internet it consist of 7 layer this is not any process that follow all the layer. It can follow only few of them also 

All the 7 Layers are: 	

7 Application - It is a user part where user communicate with network though browser like Email and password
6 Presentation - It encrypt, compress  or format the data. Encryption usually happens when using HTTPS.
5 Session - Build end to end connection to the destination 
4 Transport - Data convert into Segment (or Datagram for UDP)
3 Network - Data break into packet, each segment  gets an IP address and port → becomes a Packet.
2 Data Link - Packet gets MAC address (Mac of Destination and mac of source )and error check → becomes a Frame. Hip - Hop jump in the network where frame change it mac and some other details
1 Physical - 	Frame converts into Bits (0 and 1) and travels through cable or Wi-Fi.

The OSI Model (Open Systems Interconnection Model) is a conceptual framework that defines how data travels through a network in 7 layers. Each layer has a specific role in moving data from one device to another.

    The 7 Layers of the OSI Model (Top to Bottom)

    7. Application Layer

        What it does:
        Directly interacts with end users. It provides services and interfaces for applications to access the network.

        Functions:
            File transfers
            Email
            Web browsing
            Network management

        Examples:
            HTTP, HTTPS
            FTP
            SMTP
            DNS
            Telnet

6. Presentation Layer

        What it does:
        Formats or translates data for the Application Layer. Handles encryption, decryption, and compression.

        Functions:
            Converts data into readable formats (e.g., text, image, video)
            Applies encryption (SSL/TLS)
            Compresses data for efficient transfer

        Examples:
            SSL/TLS
            JPEG, MP4, GIF
            ASCII, EBCDIC

    5. Session Layer

        What it does:
        Manages and controls dialogues (sessions) between two computers. Keeps sessions open, manages logins, and synchronizes.

        Functions:
            Establish, maintain, and terminate sessions
            Session checkpoints (for data recovery)

        Examples:

Examples:
            NetBIOS
            RPC (Remote Procedure Call)
            PPTP (for VPN)

    4. Transport Layer

        What it does:
        Provides reliable or unreliable delivery of data with error checking and flow control.

        Functions:
            Divides data into segments
            Ensures complete and correct data
            Handles retransmission if needed

        Examples:
            TCP (Reliable, ordered)
            UDP (Faster, no guarantee of delivery)

    3. Network Layer

        What it does:
        Handles routing of data from source to destination using logical addresses (IP).

        Functions:
            Logical addressing (IP)
            Path selection & routing
            Packet forwarding


Examples:
            IP (IPv4/IPv6)
            ICMP (ping, traceroute)
            Routers operate here

    2. Data Link Layer

        What it does:
        Transfers data between devices on the same network and detects/corrects errors in the physical layer.

        Functions:
            Frames data for transmission
            Adds MAC addresses
            Handles error detection (CRC)

        Examples:
            Ethernet
            MAC address
            Switches, Bridges
            PPP, ARP

    1. Physical Layer

        What it does:
        Transmits raw bits (0s and 1s) over the physical medium (cable, air, fiber).
Functions:
            Voltage levels, data rates
            Physical connectors, cabling
            Bit-by-bit delivery

        Examples:
            Cables (Ethernet, fiber)
            Hubs, Repeaters
            Wi-Fi signals, Bluetooth, Modems