**Reflective log**

A writeup of thoughts on creating websites using HTML5, CSS3 and JavaScript for both the clientside and server side processing

**Node JS**

NodeJS seems an extremely useful and versatile technology which makes it extremely easy to create webservers.
However no technology is perfect, NodeJS seems to not tell you in which file or at which line some errors occur such as when a variable is referenced before it is defined. This leads to searching the source code for it and having to add lots of console.logs to find the issue.

The vast range of packages(modules) avaliable for Node JS via NPM is extremely useful and makes creating systems much easier. There is a package for just about everything.

Another annoying feature of NodeJS is that if you forget an await somewhere it can be difficult to debug if you have multiple layers to your application as the promise will be passed around not the result of the promise.

**CSS3**

CSS grids seem useful however somewhat confusing and I still feel I don't understand them fully.

CSS variables seem very useful, probably more so for applications larger than this one as they would allow for potentially reduced file size leading to faster loading times.They also make the code much more readable as it gives certain colours semantic meaning for instance columnBorderColour over #000000.

**Google Auth**

The Google authentication seems pretty seamless and intuative however intitially I was saving the user details client side and sending their details in plain text to the server. I later learnt that you are meant to send the token that is fetched from the Google servers which can be used to get the clients details on the server.

**JavaScript**

**URL parameters**

As a better alternative to global variables aswell as persistant storage accross reloads URL parameters can be very useful. The API seems very straight forward with browsers allowing you to search for a specific parameter by name in 3 lines of code.
Setting URL parameters is equally easy.


**Functional programming in JS**

Functional concepts such as mapping are avaliable in JavaScript however they do not seem syntatically much shorter than creating a for loop to do the same thing. I have used several forEach loops and maps within the project as I think they are more readable than a standard for loop.

**HTML stuff**

**Aria Tags**

The documentation online for aria tags seems very poor. It either seems very brief and not cover how to use the tags or extremely indepth such as the W3C standards on aria tags

**Misc**

**Jquery**

Every problem I Google for comes up with JQuery results.It is really annoying.

**Automated documentation**

I haven't created any automated documentation for this project but there is a nice NPM package for it called JSDOC which pulls all the comments out your code and puts them into a nice looking and eay to navigate web page.
