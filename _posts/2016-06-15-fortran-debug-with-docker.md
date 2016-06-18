---
layout: post
title: Fortran debugging with Docker in Visual Studio Code
tags: [fortran debug gdb docker visualstudiocode]
---
## Debugging with Docker

As we saw in our previous post OSx is not very friendly with the gdb debugging , but there are more options to debug our program. One of those is to use Docker, with a simple dockerfile we can get a running and reproducible enviroment where we can compile and run our fortran program. Although it will be a linux binary , in some cases this might even be desirable.

So first we create a Dockerfile that can execute gfortran, gdb, and a ssh server. we need to expose the port 22.

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

One option is to use a copy instruction in order to copy our source to the container, however that implies that we will need to rebuild the container each time we update the code, a more flexible approach is to mount a volume in the container linked to our source path, that way our source will be synchronized in the container.

The port 22 will be port 222 in our system


Then we configure the debug options to use gdb through ssh. we will use for this example user and password but a key can also be used. Note that X11 is disabled as our container is not able to run x11.

Next thing is to prepare our dockerfile. for this we will use alpine as the baseline. Unfortunately the gdb loaded with alpine does not include gdbserver, so I have to relay on the manual compilation of gdb , although for this configuration we are not going to use the gdbserver.

Besides we need to install the ssh server and create the necessary keys.

With this configuration if you just try to build and run your image and debug some code on it you will notice that the debugger will not stop at your breakpoints although you will be able to run the program inside gdb. in order to allow gdb to stop the program execution at the desired break points you need to run the container with the --privileged flag.

Note that as the copy files is in the docker file, it needs to be build each time.

When running gdb in ssh take into account that if you have a prelaunchtask ,it will be run in the remote machine in this case inside the docker image which likely might not be want you want, as it was my case when I have the build and run commands for the docker image in the prelaunch task.