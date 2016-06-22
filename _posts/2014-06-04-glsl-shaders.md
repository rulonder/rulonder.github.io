---
layout: post
title: GLSL Shaders 
tags: [3d javascript glsl three.js]
color: '#949667'
techs: [WebGL]
---

## Using Shaders with THREE.js

Recently I finished the udacity course on 3D interactive graphics , which I would recommend to any one interested in the topic, the course is build around THREE.js which is a javascript library that leverages all the hassle to use WebGl, making easy to represent 3d scenes on the browser.

One of the thing I got really curious about is the use of shaders, basically with a shader you can program directly on the GPU in order to define how the scene is gonna be rendered. Unfortunately this does not allow to run parallel operations in the GPU as with CUDA or OpenCL, as there is no straight way to retrieve results, the only result you get is the canvas image. There are two main shaders, vertex shader which translates the vertices of our 3d object into the positions in the image populating the variable gl_Position, and the fragment shader which gives the final color to be represented as described in the variable gl_FragColor.

Although it is not necessary as THREE.js provides most of tools and utils you need to make almost any 3d scene, you can also provide your own custom shaders. The shaders are defined in GLSL which stands for OpenGL Shading Language. This code is passed directly as a string to THREE.js but it can be described in a specific script tag inside the html.

~~~html
	<script type="x-shader/x-vertex" id="vertexshader">
	void main() {
  		gl_Position = projectionMatrix *
                	modelViewMatrix *
                	vec4(position,1.0);
		}
	</script>
	
	<script type="x-shader/x-fragment" id="fragmentshader">
	void main() {
  		gl_FragColor = vec4(1.0,  // R
                      	1.0,  // G
                      	0.5,  // B
                      	1.0); // A
		}	
    </script>
~~~

So the data will retrieve the following way.

~~~ javascript
	// get the shaders
	var vertexShader = document.querySelector('#vertexshader').textContent;
	var fragmentShader = document.querySelector('#fragmentshader').textContent;	
~~~

Let's build something, we can start with a simple plane mesh that will be colored by our shader in an uniform way.

~~~ javascript
	// create the shaders material
	var shaderMaterial = new THREE.ShaderMaterial({
		vertexShader:   vertexShader,
		fragmentShader: fragmentShader
	});
	var width = 900, heigh = 600;
	var plane = new THREE.PlaneGeometry(width,heigh)
	// create a new mesh 
	var mesh = new THREE.Mesh(
	   plane,
	   shaderMaterial);
~~~

This will create a simple plane colored in green as described in our fragment shader. You will something similar to:

![](https://raw.githubusercontent.com/rulonder/shaders_test/gh-pages/shader1.png)

[Try me](http://rulonder.github.io/shaders_test/)

## GLSL variables 

In the GLSL several kind of variables can be defined.

Variables defined as "varying" will be shared between the vertex and the corresponding fragment shader, and will be interpolated between vertices. They are set in the vertex shader and read in the fragment shader, note how they are they declared on both shaders.

"uniform" variables are shared between all the shaders, like a global variable. 

"attribute" variables are provided from the javascript side and change per vertex.

"attribute" and "uniform" variables are passed from the javascript side in the following way:

So let's play a little bit with the, for example we can add some noise to our plain color texture.

~~~ javascript

// add attribute for the noise in each vertex 
var attributes = {
  noise: {
    type: 'f', // a float
    value: [] // an empty array
  }
};

// add a uniform for the fog
var uniforms = {
  fog: {
    type: 'f', // a float
    value: 0
  }
};

// load them in the shader material

// create the final material
var shaderMaterial =
    new THREE.MeshShaderMaterial({
      uniforms:       uniforms,
      attributes:     attributes,
	  vertexShader:   vertexShader,
	  fragmentShader: fragmentShader
    });


~~~

Consequently we need to update the shaders to take into account these new variables.

~~~html
	<script type="x-shader/x-vertex" id="vertexshader">
	void main() {
  		gl_Position = projectionMatrix *
                	modelViewMatrix *
                	vec4(position,1.0);
		}
	</script>
	
	<script type="x-shader/x-fragment" id="fragmentshader">

	varying float vNoise;
	
	void main()
	{
	  		gl_FragColor = vec4(0.0,  // R
	                      	1.0*vNoise,  // G
	                      	0.0,  // B
	                      	1.0); // A
	  
						  
	}
    </script>
~~~

This will take the random noise of each vertex and will pass it to the fragment shader to apply it to final pixel color. You will get something as in the following image, a little bit different each time you refresh the windows.

![](https://raw.githubusercontent.com/rulonder/shaders_test/gh-pages/shader2.png)

[Try me](http://rulonder.github.io/shaders_test/index2.html)

You might notice that there is not much noise actually, that's because the noise it is only applied in each vertex and in this simple plane there are only 4 vertices that define the two triangles. These two triangles can be perceived in the image above. In between the values are interpolated as it is the noise value defined as "varying".

## Animate with uniform.

Finally let's use the uniform property to animate things a little bit. We will add the uniform variable in the shader, and we will update it using and update function that will wrap up the render call.

The uniform variables are accessible for both shader, in this case we will use it directly in the fragment shader. It will add some red to the plane adding a heartbeat effect.

we will update our render function to update this uniform variable.

~~~ javascript

    // init frame 
	var frame = 0;
	// add the mesh to the scene
	function render() {
	  uniforms.reddish.value =
    		Math.sin(frame);	
  	  // update the frame counter
      frame += 0.1;			
	  renderer.render(scene, camera);
	  requestAnimationFrame(render);
	}

~~~ 

And our fragment shader

~~~ GLSL

	varying float vNoise;
	uniform float reddish;
	void main()
	{
	  		gl_FragColor = vec4(reddish,  // R
	                      	1.0*vNoise,  // G
	                      	0.0,  // B
	                      	1.0); // A
	  
						  
	}

~~~

[Try me](http://rulonder.github.io/shaders_test/index3.html)