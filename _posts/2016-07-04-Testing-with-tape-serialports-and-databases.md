---
layout: post
title: Testing with tape serialports and databases
tags: [typescript, javascript, testing ,debug , arduino, visualstudiocode]
techs: [Javascript , plus, SQLite, plus, Arduino]
---


## Test framework
 
At first I star using mmocha it is a nice, battle tested and easy to setup testing framework for javascript. However, I finally decide to switch to a simple test setup with tape. The reasons are varied:

- It does not require an specific framework, test files are run as any other node program i.e. you can just run a test case directly with node. No magic.

```
    node test_case.js
```

- As a result of the previous point debugging it is straight forward, just as any other node program. Although debugging in mocha is possible certainly it is not direct, and in my experience a little bit buggy. The debug workflow with tape on the other hand is direct and allow to debug your test case in the same way you would do for the main program.

Recently I moved a watering system I had in python to typescript, mainly to play with typescript and nodejs. This system uses the serial port, through a bluetooth connection to connect to an Arduino and a SQLite db to store readings. The functionality is exposed through a web interface driven by Express and using d3js. In order to prepare the unit tests case, I used tape for the reasons stated above. One of the tricky parts of the testing of this system are DB and serialport interfaces tests, which we I discuss in the following paragraphs.

### Test the database

In order to test the SQLite DB connection and interfaces there is no need to create any mock of it. If it is not necessary I try to avoid mocks, as they require maintenance and need to validate against the actual implementation which is not always the case, and both task can be costly. So in this case I will test the interfaces with the database directly against the sqlite3 driver. Using the original driver we can follow two approaches:

- Using a temporal file database.
- Using on memory database.

The last approach will allow us to have a clean test environment and. Whereas the first will allow us to use an already loaded database. We can indeed combine both approaches.

### Test serialport

Unfortunately it is not easy or straight forward to simulate our Arduino serialport communications.

For this we will create a fake module with the needed serial port functionality. for this we will use an npm module that mocks the serialport communications called virtual-serialport.


~~~ javascript


~~~

This approach requires us to have the mocked serialport behaviour aligned with that of our Arduino. Otherwise, we will see false negatives in our test cases. Both this mock will allow us to test the interfaces without the need of an actual Arduino. This is helpful to test in travisCI for example.




