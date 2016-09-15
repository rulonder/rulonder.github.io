---
layout: post
title: Sensors for an Arduino watering system
tags: [ arduino ,c ,sensor]
techs: [ Arduino]
---

## Pump

For my simple watering system I am going to use a small 5V pump, which is good enough for the few pots I have. Although the voltage is low the Intensity used is well beyond the capabilities of the Arduino board, so I need a interface in between, in this case I will use a mosfet , as it is an easy and effective way to drive our pump from the digital output of the Arduino.

Be careful not to connect the power supply of the pump to the 5v output of your Arduino or you will burn it. So remember to connect to an external power supply.

![](../../../../public/img/gardener/Pump.png)

The code on the Arduino side is just a simple digital IO handling.

```  c

/*
.
*/
// declare pump pin 
int pumpPin = 4;
/*
.
*/
void setup() {
// Pump pin initialization
  pinMode(pumpPin,OUTPUT);
}
/*
.
*/
void pump() {
   digitalWrite(pumpPin, HIGH);
   delay(2000);
   digitalWrite(pumpPin,LOW);
}

```

## Ambient temperature and humidity.

For the measurement of the environment temperature and humidity values I am going to use a cheap DHT-11 sensor. I have to say that I am not really satified with this sensor, although the price is really cheap the measurements are not very precise.

The sensor is directly connected to the arduino.


## Soil Humidity Sensor

One of the most important parts is to measure the soil humidity so I can know it our plant are getting the necessary water.

One important thing to take into consideration that the sensor will degrade over the time due to the electrolysys. So in order to save our sensor over time I will just power it when it is strictly necessary. So I will use two pins of the arduino , one to switch on the sensor and the second one to perform the reading.

## Tank Level Gauge

We will measure the remaining water level in the tank, using an ultrasonic sensor. I will use a cheap sr-04 ultrasonic sensor.

This sensor only needs two pins to be connected to the arduino, beside the power supply although one pin configurations are also possible.

In order to interact with it from our arduino I am going to use the newping library. The following code allow for the reading.

```  c
#include <NewPing.h>

#define TRIGGER_PIN  12  // Arduino pin tied to trigger pin on ping sensor.
#define ECHO_PIN     11  // Arduino pin tied to echo pin on ping sensor.
#define MAX_DISTANCE 200 // Maximum distance we want to ping for 
NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); 
/*
.
*/
// Read distance measurement
float readDistance() { 
  unsigned int uS = sonar.ping(); // Send ping, get ping time in microseconds (uS).
  return (uS / US_ROUNDTRIP_CM); // Convert ping time to distance and print result (0 = outside set distance range, no ping echo)
}

```

Therefore we will connect our sensor to the pins 12 and 11 of the arduino

![](../../../../public/img/gardener/Ultrasonic.png)
