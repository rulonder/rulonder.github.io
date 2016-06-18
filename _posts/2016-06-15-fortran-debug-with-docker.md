---
layout: post
title: Fortran debugging with Docker in Visual Studio Code
tags: [fortran debug gdb docker visualstudiocode]
---
## Debugging with Docker

As we saw in our earlier post OSx is not very friendly to set up with the gdb. But there are more options to debug our program. One of those is to use Docker, with a simple dockerfile we can get a running and reproducible enviroment where we can compile and run our fortran program. Although it will be a linux binary , in some cases this might even be desirable.

So first we create a Dockerfile that can execute gfortran, gdb, and a ssh server with the necessary keys. In order to later access it through ssh we need to expose the port 22.

We will use alpine linux as the baseline of our image. Unfortunately ,the gdb loaded with alpine does not include gdbserver, so I have to relay on the manual compilation of gdb , although for this configuration we are not going to use the gdbserver.

In order to have our source code available at the docker container, one option is to use the COPY instruction in order to copy our source files to the container, however that implies that we will need to rebuild the container each time we update the code, a more flexible approach is to mount a volume in the container and them in the run command link it to our source path, that way our source will be synchronized between host in the container.



~~~ Dockerfile
FROM alpine
RUN apk update
# we need make and linux-headers to compile gdb
RUN apk add --no-cache make
RUN apk add --no-cache linux-headers
RUN apk add --no-cache texinfo
RUN apk add --no-cache gcc
RUN apk add --no-cache g++
RUN apk add --no-cache gfortran
# install gdb
# RUN apk add --no-cache gdb
RUN mkdir gdb-build ;\
    cd gdb-build;\
    wget http://ftp.gnu.org/gnu/gdb/gdb-7.11.tar.xz;\
    tar -xvf gdb-7.11.tar.xz;\
    cd gdb-7.11;\
    ./configure --prefix=/usr;\
    make;\
    make -C gdb install;\
    cd ..;\
    rm -rf gdb-build/;
# install ssh server support and keys
RUN apk add --no-cache openssh
RUN ssh-keygen -A
# use foo user for ssh login
RUN adduser -D foo
RUN echo foo:foo | chpasswd
RUN echo root:foo | chpasswd
VOLUME /usr/src/myapp
WORKDIR /usr/src/myapp
# RUN start ssh server
CMD ["/usr/sbin/sshd","-D"]
~~~

Next we will generate a bash script in charge of building and running our container.

Note the "--privileged" flag in the run command. Without this configuration if you just try to build and run your image and debug some code on it you will notice that the debugger will not stop at your breakpoints although you will be able to run the program inside gdb. in order to allow gdb to stop the program execution at the desired break points you need to run the container with the --privileged flag.

~~~ bash
#! /bin/bash

# remove open images
docker rm -f gdb-fortran-container
# build image
docker build -t gdb-elpine .
# run container, expose port 22 on host port 222
docker run -d --privileged --name gdb-fortran-container -p 222:22 -v $PWD:/usr/src/myapp -t gdb-elpine

~~~

Then we configure the debug options to use gdb through ssh. we will use for this example user and password but a key can also be used. Note that X11 is disabled as our container is not able to run x11. The following launch.json configuration is the one I used for my tests.

~~~ json
{
    "version": "0.2.0",
    // "preLaunchTask": "buildTask", executed inside the conatiner , not what I need 
    "cwd": "${workspaceRoot}",
    "configurations": [
        {
            "name": "Debug",
            "type": "gdb",
            "request": "launch",
            "target": "./foo",
            "cwd": "${workspaceRoot}",
            "ssh": {
                "forwardX11": false,
                "host": "127.0.0.1",
                "port":222,
                "cwd": "/usr/src/myapp/",
                // "keyfile": "/path/to/.ssh/key", // OR
                "password": "foo",
                "user": "foo",
                // Optional, content will be executed on the SSH host before the debugger call.
                "bootstrap": "cd /usr/src/myapp/; gfortran -g -o foo main.f90"
            }
        }
    ]
}

~~~

Note that the compilation is run inside the container baser on the "bootstrap" command.

When running gdb in ssh take into account that if you have a prelaunchtask ,it will be run in the remote machine in this case inside the docker image which likely might not be want you want, as it was my case when I had the build and run commands for the docker image in the prelaunch task, so I need to remember to have the docker container running before moving to the debug phase.

Finally you can run debug, and enjoy your bug catching from your container instance.

![](../../../../public/img/fortran/fortran_debug_docker.png)