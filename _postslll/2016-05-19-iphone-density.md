---
layout: post
title: Iphone density map
tags: [python javascript data-analysis]
color: '#949667'
---

## Motivation

Plain simple I just wanted to play with retrieving data from twitter and display it in a heatmap. Twitter is a great source of information and their API is easy to interact with, and there are tons of libraries making it even easier. So the question I plan to answer is:

- how are Iphones distributed along Madrid?

I choose this question as Iphone users can be easily identified from a twitter post, or at least those using the twitter app, so just retrieving data during a day is mostly enough to have some representative data.

## Retrieve data

In order to retrieve the data I used the node.js library twip. It will use the stream library to retrieve the tweets and save them to a file.

~~~ javascript

iconst Twit = require('twit')
const fs = require('fs')

const T = new Twit({
consumer_key: '',
consumer_secret: '',
access_token: '',
access_token_secret: ''
})
// output file, with append mode
const file = fs.createWriteStream("my_file.txt")

// define location , Madrid
const madrid = [-3.75, 40.38, -3.62, 40.47] 
//listen stream data
const stream = T.stream('statuses/filter', { locations: madrid })
stream.on('message', function (tweet) {
    file.write(JSON.stringify(tweet)+"\n")
})
stream.on('error', function (error) {
    console.log(error.messsage)
})

~~~  


After running the file for some days there is enough data to do some analysis. I run it on a raspberry pi, using pm2 . I first tried to use python and tweepy but I run into some problems as you need to have python > 2.7.9 due to some SSL bugs fixed from that version, otherwise you will get and error message trying to connect to the twitter API


