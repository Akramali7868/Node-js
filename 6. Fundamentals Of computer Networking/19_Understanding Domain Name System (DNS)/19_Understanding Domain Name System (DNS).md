Understanding Domain Name System (DNS)

Domain is divided into parts
Example:

www.google.com. 

In last we not add any dot. By default browser add the dot splitty
This dots help the DNS Server to easily search for domains as tree

Root-Level Domain(RLD) it is the last dot after the com. above example
Top-Level Domain(TLD) it is the dot before the com
Second-Level Domain(SLD) it is the 3rd dot and the main name that is .google 
Sub Domain / Third-Level Domain it is the before the main domain comes like www or app

It contain more nested Domain as   needed

A domain name contain maximum 253 character 
Each Divided domain have maximum 63 character like

www.app.procodrr.com //total domain character not exceed 253 character
	   |
	  63		// each divided domain like app,procodrr not be more than 63 character

Domain have tree like structure like .com, .net, .org, .in then the top level domain are divided
the most domain are in .com


The Domain Name System (DNS) translates human-readable domain names (like www.google.com) into IP addresses that computers use to identify each other on the network.
    
    Domain Hierarchy

        Root Level (RLD)
            Represented by a dot (.)
            It is the highest level in the DNS hierarchy
            Managed by ICANN (Internet Corporation for Assigned Names and Numbers)
            Contains all Top-Level Domains (TLDs)

        Top-Level Domain (TLD)
            Examples: .com, .org, .net, .gov, .in
            TLDs are owned by organizations that have the authority to manage them
            These organizations are allowed to create Second-Level Domains

        Second-Level Domain
            Example: google in google.com
            Created under a TLD
            Ownership of second-level domains is granted by TLD registrars
Subdomain
            Example: www in www.google.com
            Created under a second-level domain
            Can be multiple levels deep (e.g., mail.support.google.com)

    Important Rules
        The total length of a domain name (including dots) cannot exceed 255 characters.
        Each label (a part of the domain between dots) can be up to 63 characters long.

    Domain Registration
        While TLDs are owned by authorized organizations, they typically do not sell domains directly.
        Instead, domain registrars (also known as brokers), such as GoDaddy, Namecheap, etc., handle the sale and management of second-level domains to the public