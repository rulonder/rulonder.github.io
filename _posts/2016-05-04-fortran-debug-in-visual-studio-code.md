---
layout: post
title: Fortran debugging in OSx with visual studio code
---
## Debug fortran code in OSx

I have recently switch to a macbook air from a lenovo, overall i am quite happy with the change, the macbook is a delight to use, you have the best of linux terminal and the best of windows user interface and programs e.g. office. No to mention the long lasting battery, it almost seems an engineering miracle.

One of the programming languages I usually use is good old Fortran, so I wanted to keep using it in my mac. So the first step was to install gfortran, this was dumb simple using Homebrew to install gcc which includes gfortran.

~~~
    brew install gcc
~~~

### Debugging with lldb (Fail)

Great so now I can compile fortran programs. but usually I end up needing to debug them, one of my favorites editors currently is Visual Studio Code, I think microsoft is doing a great job with this piece of software, not to mention that is multiplatform. So after installing the fortran language extension I decided to move forward and add debugging capabilities. For that I decided to install the gdb plugin.

After installing it and installing gdb through Homebrew my first surprise was that gdb didn't run properly on OSX, this was a little bit of dessilution on my new Mac, the are several workoround to make it work but are a little bit tedious and I my onw opinion not very clear and a little bit hacky. Fortunately there is another option besides gdb , that is lldb which is already installed in my Mac , please note that I have Xcode already installed so I do not know if it is part of the initial configuration or if it was installed with Xcode. So lets try with lldb. In order to make the lldb functinality avalible in Visual Studio Code, you need to make lldb-mi availble in your path, this can be achieved just creating a symbolic link to your /usr/bin folder.

~~~
    ln -s /Applications/Xcode.app/Contents/Developer/usr/bin/lldb-mi /usr/local/bin/lldb-mi
~~~

Then using lldb-mi with the compiled fortan program in order to debug it seems to work well, you can use breakpoints and resume the program but you cannot see the variables so you only get some crippled debugging capabilities which are not enough.So far I have not been able to find a way to make lldb understand fortran variables, so I will get back to gdb.

### Debugging with gdb

So if I want to go beyond the breakpoint functionality it seems that I will need to use gdb. So we will start installing it with the following comand.

~~~
    brew install gdb
~~~

This will certantly install gdb and you can initiate it from the command line for example but so far it does not allow you to run the Fortran binary unless you use sudo, so we need to fix it. In order to use it I had to add the -p option in taskgated as described in [stackoverflow](https://stackoverflow.com/questions/33162757/how-to-install-gdb-debugger-in-mac-osx-el-capitan)

Now we can use gdb from the command line and run the program. So let's move to Visual Studio Code.

First we are going to create a task to build the binary, this can be just a call to Make command but for this case I'm going to call directly gfortran. Just edit the file tasks.json inside the folder .vscode , and set the following configuration.

~~~ json 
{
    "version": "0.1.0",
    "name": "buildTask",
    "command": "gfortran",
    "isShellCommand": true,
    // this is neccesary when called from the debug task
    "cwd": "${workspaceRoot}",   
     "args": [
                "-o", "foo", "-g","-O0", "main.f90"
            ]
}
~~~

Then we are going to config our debug to use gdb and call the build right before with the "preLaunchTask" property.

~~~ json
{
    "version": "0.2.0",
    "preLaunchTask": "buildTask",
    "configurations": [
        {
            "name": "Debug",
            "type": "gdb",
            "request": "launch",
            "target": "./foo",
            "cwd": "${workspaceRoot}"
        }
    ]
}
~~~ 

With this configuration we can debug and see some varibles, great! . However , there is still some pending functionalities, for instances arrays, pointers and othe non basiac types and structures are not properly displayed in the debugger.

For instance a simple integer array will not properly displayed in the watch area. However you can still access the array values using the debug console avaliable. you can use the following commands:

To access the first item of the array

~~~
 print *((integer *)array + 0) 
~~~

To access the first 4 items of the array

~~~
 print *((integer *)array + 0)@4 
~~~

![](../../../../public/img/fortran/fortran_vs_debug.png)

Obiously these commands are not really user friendly, and the debug experience in other IDEs such as visual studio with intel fortran are much more pleasant.



## Debugging with Docker

So OSx is not very friendly with the gdb debugging , but there are more options to debug our program. One of those is to use Docker, with a simple dockerfile we can get a running enviroment where we can compile and run our fortran program. Although it will be a linux binary , in some cases this  might even be desirable.

So first we create a Dockerfile that can execute gfortran, gdb, and a ssh server. we need to expose the port 22.

The port 22 will be port 222 in our system


Then we configure the debug options to use gdb through ssh. we will use for this example user and password but a key can also be used. Note that X11 is disabled as our container is not able to run x11.

Next thing is to prepare our dockerfile. for this we will use alpine as the baseline. Unfortunately the gdb loaded with alpine does not include gdbserver, so I have to relay on the manual compilation of gdb , although for this configuration we are not going to use the gdbserver.

Besides we need to install the ssh server and create the necessary keys.

With this configuration if you just try to build and run your image and debug some code on it you will notice that the debugger will not stop at your breakpoints although you will be able to run the program inside gdb. in order to allow gdb to stop the program execution at the desired break points you need to run the container with the --privileged flag.

Note that as the copy files is in the docker file, it needs to be build each time.

When running gdb in ssh take into account that the prelaunchtask will be run in the remote machine in this case inside the docker image.