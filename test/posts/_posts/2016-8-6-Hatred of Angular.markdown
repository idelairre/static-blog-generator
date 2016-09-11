---
layout: post
author: Ian Delairre
title: "Hatred of Angular"
date: 2016-09-15 15:10:15 -0400
comments: true
categories:
---

I've been booting up some old Angular projects and found myself running into retrospectives on Angular and numerous articles about "Why Angular will fail", e.g., ["Angular, just say no"](https://gist.github.com/tdd/5ba48ba5a2a179f2d0fa) which explains "why you should avoid the entire thing at all costs unless you want to spend the next few years in hell." The points these articles make about Angular's somewhat unstructured development, changing goals, audience and requirements are interesting. Some of the comparisons are arbitrary, e.g., comparing Angular to jQuery, but most of these pieces are well considered. ["The Problem with Angular"](http://www.quirksmode.org/blog/archives/2015/01/the_problem_wit.html) is particularly interesting because it reveals Angular's paradoxical design motivations, which I see as the heart of the matter.

<!-- more -->

## Angular was never meant for front-end developers

Evidently Angular was made for designers:

> When AngularJS was first created, almost five years ago, it was not originally intended for developers. It was a tool targeted more at designers who needed to quickly build persistent HTML forms. Over time it has changed to accommodate a variety of scenarios and developers have picked it up and used it to build more and more complex applications. - Rob Eisenberg

Interesting. If Angular does one thing well, its forms and validation. An excellent use-case for Angular is an application with a large amount of forms. However, templates with very little restriction on what logic you can use, combined with invisible models that must be divined from said templates, combined with its module loader plunges the hapless developer into a private hell. Directives like `ng-if` and `ng-repeat` clutter your templates and Angular's weird prejudice against compiling html or controlling view logic in controllers often mean you will have tons of inline code. Encapsulating and hiding this logic in smaller directives and components is desirable but allows Angular to appear superficially clean.

Consider input masks, for instance, the logic behind making a simple mask in Angular is fairly complex considering that you must use two apis (`directive` and `filter`). However, the real pain point will be getting your directive to use your filter since directives must be defined using three very complex methods, namely `compile`, `link`, `controller`, which themselves expose various complex objects like `$scope`, `$element`, `$attrs`, `$formatter`, `$parser`, etc. Meanwhile, the api for interfacing with a model or other directives through the `require` property is marred by opaque syntax for locating controllers (wtf are `^`, `?`, `^?` supposed to mean?). The grunt work of writing a directive is configuring and declaring methods on a bunch of properties that do not seem to resemble the JavaScript entities you are trying to manipulate. This is a deeply unintuitive process.

As, mnemon1ck notes in his article ["Why you should not use Angularjs"](https://medium.com/@mnemon1ck/why-you-should-not-use-angularjs-1df5ddf6fc99#.jq15wqim5), the api for directives is massive: [link](https://docs.angularjs.org/api/ng/service/$compile#!) and causes no end of problems considering the number of questions on StackExchange.

Beyond the most simple forms and validations. Creating directives is a deeply confusing and fails to resemble doing anything in JavaScript. Angular seems almost like another language. Its prejudice against DOM manipulation (which is shared by React and other frameworks but handled much more gracefully by them) has led to a bizarre and sprawling directive api. What was the motivation behind this api?

## Angular was meant for back-end Java programmers

> Angular is aimed at large enterprise IT back-enders and managers who are confused by JavaScript’s insane proliferation of tools. [...] Enterprise IT managers also like the fact that Angular closely mirrors the preferences of their back-end developers. I had an illuminating Twitter conversation with Joe Pearson of weather.com, who told me that they had recently switched to Angular, mostly for the sake of their Java developers.

This is revealing, however this notion that Angular was made for IT professionals who wanted an opinionated framework in the face of endless JavaScript libraries and design patterns conflicts with the claim that it was made for designers. If both these statements are true than this tension is built into Angular's design.

Lets step back.

At this stage, there is really no need for Angular's "opinionated" proprietary services like `$http` and `$resource.` While `$http` is not bad, it does exactly what it needs to do, adding it as a dependency in an es6 class is kind of a drag since you will end up writing `$http` about three times before you can use it. Using a library like Axios becomes preferable here. `$resource`, however, is a real time waster, after a refactor, I found that the entities that `$resource` creates don't behave like normal JavaScript objects and I had to slice them out of arrays, assign their properties to normal objects and all kinds of other gymnastics to get them to behave correctly. Why bother with this when you could make them function like Backbone models or even vanilla JS objects?

However, in terms of developer ergonomics, after messing around with making an Android app, a "mature" Angular app that makes extensive use of directives and components seems to have the same expressiveness as xml. Passing variables into your components through html attributes is a real strength of Angular, however, this is where the benefits of inspiration from xml and Java ends.

The declarative and somewhat paranoid syntax of Java is not really suited to JavaScript. Angular 1 was not really going in this direction with the exception of its paranoid use of dependency injection. But the transition to TypeScript Angular 2 has made and the extensive use of decorators really smells of Java. The workflow for building Angular 2 apps in TypeScript with an advanced IDE really feels like programming in Java. Here I'm referring to the overhead of using a strongly typed compiled language, i.e., Java's policy of making you program with a nit-picky secretary that is always asking "Are you sure you meant to do that?". Programming in TypeScript and Java can feel like typing with boxing gloves on.

But I digress, a framework that is meant to simultaneously satisfy back-end Java developers and web designers is going to be an absolute clusterfuck.

## The good

By now its clear that Google had some conflicting design principles and some contempt and maybe condescension towards JavaScript's more unstructured functional way of doing things. But what are the advantages of "Angular's way of doing things"?

Off the bat, I can say that Angular lays out exactly what you can do to a thing. When I came to Angular as a newbie developer, I had no idea what JavaScript's capabilities were, I didn't know that certain things were possible. The directive API, despite being a mess, describes and structures how you can manipulate objects. For better or for worse, it railroads you into solving problems and thinking about things in its scoped and particular way. Had I begun building directives and components rather than full webapps I might have been better off as a developer. Then again, I started Angular before the component api was added, so I was accosted with the full brunt of Angular's design problems from the start.

I usually only came to directives when I had a problem or a requirement that wasn't satisfied with existing libraries, which is a testament to the adaptability of Angular and the cumulative experience of its community. Of course, this is programming on easy mode and one does not cultivate an adventurous problem solver™ spirit. It also made those moments of digging around in the guts of directives without full knowledge of how they worked a deeply confusing and hellish task.

But my attitude then and now is "Hey, if you need something built fast, I can do it in Angular."

## Verdict: Angular is decent for rapid prototyping/small projects

I've come across this claim before and I buy it. From personal experience (4 projects in Angular, 2 of which are production apps), if you have more than 8 views and 12 components in your app you have reached your limit with Angular. This might sound small or arbitrary, but by this time your app will have a bunch of services, filters, and directives floating around in there, you will have a relatively deep component tree, your view templates will be getting tangled, and you will be running into Angular specific performance problems. Another good indication that "you need to stop" is if you are messing with the `$scope` digest cycle and manually assigning watchers, you are now fighting the framework and its time to reconsider what you are doing or move to something more flexible.

This is a critical moment, you either want to get out now and salvage all your non-Angular code, transition to Angular 2 if you want to keep betting on Google (which will be expensive and hard), or freeze your app's dependencies and consider it "done" (i.e., commit heresy and wait until your app stops working in contemporary browsers). Google has not left users with much of a choice and my feeling is that they jumped the gun on a useful and [relatively healthy framework](https://idelairre.github.io/the-state-of-angular-1-in-2016) with a lot of potential by avoiding hard design decisions and starting over.

My most recent project, which was small, tightly scoped, and made heavy use of forms, left me feeling "Hey, that wasn't so bad" since it played to Angular's strengths. My big projects that I'm slowly transitioning to Angular 2 by using ng-forward and ng-upgrade have left me feeling near-suicidal. I have an Angular/electron app that is particularly painful to work on and I imagine people who made Cordova apps in Angular are feeling similar pains. Take it for what its worth.
