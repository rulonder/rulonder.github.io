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

As a big fan of python I decided to use it for this development, as I need both serial communications and an http server, twisted was a nice framework , providing asynchronous capabilities. The downside is that I would need to stick with python 2.7.




