Arduino Cloud Compiler
======================

A web service for compiling Arduino sketches

NOTE:
This is a work in progress. It should not be used in production.

Installation
======================

```
$ npm install
```

Usage
======================

```
$ npm start
```

Open terminal and run the following command where `test.ino` is your local sketch

```
$ curl --data-binary "@test.ino" http://localhost:3000
```