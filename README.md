Arduino Cloud Compiler
======================

A web service for compiling Arduino sketches.

NOTE: This is a work in progress. It should not be used in production!

Installation
======================

Install the Node.js dependencies.

```
$ npm install
```

Set the permissions of the shell files.

```
$ chmod 775 ino*.sh
```

Usage
======================

Start the server

```
$ npm start
```

Open terminal and run the following command where `test.ino` is your local sketch and `localhost` is the machine running the compiler.

```
$ curl --data-binary "@test.ino" http://localhost:3000
```