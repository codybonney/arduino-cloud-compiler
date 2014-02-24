Arduino Cloud Compiler
======================

A web service for compiling Arduino sketches.
Currently working on OS X

##### NOTE: This is a work in progress. It should not be used in production!

Dependencies
======================
Python 2.7
Pip
Ino

Installation
======================


Usage
======================

### Using cURL
```
curl --data-binary "@./examples/cURL/example.ino" http://192.168.1.33:5000/compile
```
