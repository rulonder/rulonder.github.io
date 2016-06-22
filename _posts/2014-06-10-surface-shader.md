---
layout: post
title: Potential Field Sphere Shaders
tags: [3d javascript glsl three.js]
color: '#949667'
techs: [WebGL]
---

## GLSL shaders and potetential fields

As I described in the previous [post](../../../../2014/06/04/glsl-shaders/)I have been very interested in GLSL shaders programing and I wanted to play I little bit more with them.

One thing I wanted to play with, is alternative ways to describe surfaces. The ussual way is to describe a mesh of triangles that are efficiently processed by the GPU, but this post is not about efficiency but about playing with the shaders so I decided to try If I could describe a surface as a potential field, the surface will be defined by the potential level and the potential field equation while the normal can be derived from the gradient.

$$ normal = \nabla (S) $$
   
$$   S = 0 $$

This way a simple equation can represent an sphere with its normal, however the equipotential points need to be find, but this can be easily done inside the shaer, for instance using a simple newton-rapson method.

So I implemented this approach and you can see the results in the following link.

[Try me](http://rulonder.github.io/shaders_test/index5.html)

Take into account that the only mesh loaded from the javascript side is a simple plane defined by 4 vertices. All the hard work is performed inside the GPU.
