---
layout: post
author: Ian Delairre
title: "Jekyll is broken"
date: 2016-09-6 6:54:00 -0400
comments: true
categories:
---

I'm practicing my controversial developer opinion piece blogging skills. Jekyll is not broken for everyone but it is behaving poorly for me, so I created my own static blog generator. My motivation stems from the fact that, after a year of working with JavaScript front-end frameworks and dabbling in Node, Jekyll's liquid templates, Ruby rake tasks, and what-not are looking just a little foreign and over-engineered. I'm also increasingly a fan of building my own tools and doing things in "my own style" when it comes to programming.

<!-- more -->

After trying a few static blogging platforms such as Hexo, I can say the developer ergonomics for JavaScript front-end frameworks really outclass any static blogging platform. There really should be a way to make the experience of building a static site more like building a componentized webapp. That is to say, it should not be painful to build a static site if I can program and "oh my God why is this so 'effing silly" should not be my reaction to using a static blog generator which is meant to make things easier.

So far, my experimental "framework" is looking a lot like Backbone, which I have much love for after developing my Chrome extension for Tumblr. Maybe this is a little archaic but I wanted to create something that would allow the creating of simple files that would export an overgalvanized hash containing a template, its data, and some rendering logic. More complex es6 classes could also be accommodated if I wanted to experiment with things like decorators. I also wanted to include the flexibility of using whatever template engine.

At this point it is unclear whether the "framework" is anything besides a few classes that give context to Handlebars templates and partials. However, I'm hoping the generation of the site, or the compilation of its html files, can be handled by a class that resembles a Backbone or Angular router which would treat routes as filesystem paths.

So far this logic is exposed and is not intrinsic to the framework. However, I'm hoping to take the messiness of dealing with the filesystem out of the user's hands. At this moment, the framework's organization and logic is pretty well tied to this static site, so it isn't really a framework. But I figure, since I'm now "going long" on this project--its my only way of updating my personal github.io page, I'll be expanding and simplifying it so the actual workflow of creating pages and posts precludes dealing with any programming. That'll be fun.

At least one other person has recommended creating your own static blog generator, I can only add chorus to this, especially since it has proved an intellectual exercise to reason out what the framework is, its api, and how and what to delegate to it. Here's to the future.
