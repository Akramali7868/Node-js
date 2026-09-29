Turning Our Mobile Phone into a Public Server



Port Number provide us different End point on the Same IP which helps to run multiple server and also use for communication to server 
In some case the Server also become Client for other server
It also tell the server in which application it want to access 


Port number are written after IP Example:
192.168.0.10:3000 //:3000 is Port Number

There are some reserve port number like 80 for http 443 for https
adding port :80 browser will remove this port number and uses the port behind the senses
This mean when we only add the IP address in URL it have port 80 (If HTTP) or 443 (If HTTPS

Port numbers are numerical identifiers used to distinguish different types of network services running on a device.

    Simple Explanation:
    When data reaches a device (like your computer), the IP address tells it where to go, and the port number tells it which service or application should handle it.

    Think of:
        IP address = Street address of a building
        Port number = Apartment number in the building

    Port Number Range
        0 – 65535 (Total: 65,536 ports)

    Categories:
    Range	        Type	                Example Use
    0 – 1023	    Well-known ports	    HTTP (80), HTTPS (443), FTP (21), SSH (22)
    1024 – 49151	Registered ports	    Used by user-defined or registered applications
    49152 – 65535	Dynamic/Private ports	Temporary connections (client-side)

Examples of Common Port Numbers
        Service	    Port
        HTTP	    80
        HTTPS	    443
        FTP	        21
        SSH	        22
        DNS	        53
        SMTP    	25
    
    Why Port Numbers Matter
        Allow multiple services to run on the same device.
        Help in routing data to the correct application.
        Important for firewalls and network security. See