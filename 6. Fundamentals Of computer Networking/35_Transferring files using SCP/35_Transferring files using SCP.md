Transferring files using SCP


SCP is come preinstall in SSH Client when we install it

SCP stands for Secure Copy Protocol

It is use to copy file form client SSH to server SSH

Syntax:-
scp "filePath to copy" hostName@HostIP:"FilePath where to Copy"


SCP stands for Secure Copy Protocol.

It uses SSH for secure encrypted transfer.

SCP syntax: scp source destination.

Copy local → remote: scp file user@IP:path.

Copy remote → local: scp user@IP:path localfolder.

Copy folder using -r.

Use -P for custom SSH port.

Very useful for deploying code and backing up servers.

Works only if SSH is working.

Safer than FTP because of encryption.