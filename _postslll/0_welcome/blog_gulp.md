---
layout: post
title: Blogging Like a Hacker
---
# {{ title }}

This is my first attemp at creating a blog, and I had some wished in the way to handle it:

- Use static content : I plan to deploy it as a github page
- Use markdown to generate the entries: I feel confortable editing markdown.
- Automate the creation of the entries list, based on a configurable template

The easy solution , and probably the best way to go would have been to use jekyll as it is a very complete framework for this porpouse. Nevertheless, I wanted to take look a gulp , and learn about it so I decided to build it using it.

The workflow I would use for gulp is to generate html post pages from the markdown files, and generate an index.html with a list of the posts. all these htmls files are to be created from templates.

Another approach would have been to generate a single apge app, generating json files from the markdown files in order to ingested by the javascript code.
