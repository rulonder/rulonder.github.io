---
layout: post
title: Twisted gardener
---

## The problem

The Summer is on , that means a lot of heat for everyone , including plants. Currently, with this heat they need watering almost everyday. On the other hand it is a great time to go to the beach and get some refreshing bath. However this means that we wont be able to provide the plant their water. 

## The solution

The easy solution would be to buy some watering timer, but they are expensive and they require some continous water supply which I lack in my tiny apartment balcony. Besides being a hack kind of guy I liked to idea of doing it by my own.
The initial plan was to have a server providing the soil humidity data though internet while allowing to active the watering of the plants. The water pump and the sensors are managed by an arduino which connects to the server via bluetooth.

## The implementation

As a big fan of python I decided to use it for this development, as I need both serial communications and an http server, twisted was a nice framework , providing asynchronous capabilities. The downside is that I would need to stick with python 2.7. Another good point it is that twisted is easy to test and provides dedicated tools for this matter, although this can be seen as a drawback as it is increases your dependencies, increasing the complexity of the tests.

As a big fan of python as I might be I however consider that for GUIs the most versatile solution is to use HTML & Javascript as it provides a multiplatform compatibility out of the box and a wide range of libraries and framework so you can easily customize the GUI with great freedom. Therefore I decided to use D3js in order to represent the data collected by the humidity sensors, this is a great library that offers great flexibility to visualize your data but on the other hand it is not as simple to use as other more limited solutions.

You can find the code in the following repo: [Gardener](https://github.com/rulonder/Gardener)

## Arduino

An Arduino will be in charge of interfacing between the server and the sensors and pump. The code is very simple, it just reads the serial port to see if a valid command have been recieved, either pupmping some water or reading the soil humidity.

~~~ c
/* Simple Serial ECHO script : Written by ScottC 03/07/2012 */
#include<stdlib.h>
/* Use a variable called byteRead to temporarily store
   the data coming from the computer */
byte byteRead;
int analogPin = 0;
int readVal = 0;
int pumpPin = 2;
float avegValue = 0.0;
char holder[7];

void setup() {                
// Turn the Serial Protocol ON
  Serial.begin(9600);
  pinMode(pumpPin,OUTPUT);
}

void loop() {

  if (Serial.available()) {
    /* read the most recent byte */
    byteRead = Serial.read();
    /*ECHO the value that was read, back to the serial port. */
    processInput((char)byteRead);
  }
}

void processInput(char Input) {
  
  // do something different depending on the 
  switch (Input) {
  case 'p': 
    pump()  ;
    returnValue("\"Done\"",false);
    break;
  case 'r':   
    returnValue(getSensorReading(),false);
    break;
  default:    
    returnValue("\"unknownCommand\"",true);
    break;
  } 
}

String getSensorReading(){
     /*  check if data has been sent from the computer: */
     avegValue = 0;
     for (int i=0; i<10;i++) {
         avegValue += analogRead(analogPin);
     }
     avegValue = avegValue/10.0;
         // read the input pin
     String g= (String)dtostrf( avegValue, 7, 3,holder);
     return g;
}

void returnValue(String value, boolean error){
  String Error = "null";
  if (error) {
    Error = "1";
  };
  String g= "{\"value\" :"+value+",\"error\":"+Error+"}";  
  Serial.println(g);
}

void pump() {
  digitalWrite(pumpPin, HIGH);
  delay(2000);
  digitalWrite(pumpPin,LOW); 
}

~~~

The pump is not directly driven from the Arduino but through a mosfet.

## User interface

The user interface is just a graph of the lasts humidity values draw by D3.js and a button to manually ask for the pump.

## Testing Twisted

In order to test the twisted program we will use Trial which is de facto tool for this kind of testing. Usually making unit testing of serial port communications is not an easy task, as it is difficult to mock a serial port.





