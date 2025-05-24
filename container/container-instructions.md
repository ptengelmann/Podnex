# Instruction to Build the Conatiner RunTime
## Shell Scripts
Instead of relying on container compose, we are going to build a series of shell scripts.
This scripts will:
1. Be stored in the Podnex/container/ folder
1. They should be created to be able to run in Linux OR WSL2, depending on the client machine
1. The engine can be docker or podman, but instead of relying on the OS dicover it is better to accept a parameter.
1. Since the client, server and mongo DB instance have to talk to each other then:
    1. In PODMAN, we are going to create a pod where all the containers will be part of
    1. In docker all containers are going to be on the same network
1. In PODMAN mode, probably there will be SELinux, therefore:
    1. We need to add capabilities to the network, such as ping and so on
    1. We need to be careful when mountind and binding files, possibly using :Z
1. There will be a need to a --restart or -r option
    1. When starting scripts without -r if pod and containers exit, then give an error message
    1. If -r and containers are already running, force them to exit
    1. If -r and no containers running, just ignore the parameter
1. Error messages should be like traffic lights
1. Create functions with single reponsibility
1. Check return codes
1. Echo the starting commands so we can know what is exactly the command is being issued
