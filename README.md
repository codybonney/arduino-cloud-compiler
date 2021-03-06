Arduino Cloud Compiler
======================

A web service for compiling Arduino sketches.
##### NOTE: This is a work in progress. It should not be used in production!

![](http://codybonney.com/content/images/2014/Feb/arduino_cloud_compiler.png)

Currently "working" on
======================
* OS X 10.9
* Ubuntu 12

Dependencies
======================
* Python 2.7
* Pip
* Ino

Installation on Ubuntu
======================
Install Arduino

```
sudo apt-get update && sudo apt-get install arduino arduino-core
```

Install Pip

```
sudo apt-get install python-pip
```

Install virtualenv

```
sudo pip install virtualenv
```

Install virtualenvwrapper

```
sudo pip install virtualenvwrapper
```

Create a directory for storing your virtualenvs

```
mkdir ~/.virtualenvs
```

Set WORKON_HOME to your virtualenv directory

```
export WORKON_HOME=~/.virtualenvs
```

Open up the ~/.bashrc file

```
vi ~/.bashrc
```

Add this line to the end of the `~/.bashrc` file so that the virtualenvwrapper commands are loaded.

```
. /usr/local/bin/virtualenvwrapper.sh
```

Reload `~/.bashrc`

```
. ~/.bashrc
```

Create a new directory for the project

```
mkdir ~/Projects
mkdir ~/Projects/arduino-cloud-compiler
```

Navigate to the new directory

```
cd ~/Projects/arduino-cloud-compiler
```

Create a new virtualenv for the project

```
mkvirtualenv arduino-cloud-compiler
```

Activate the new virtualenv for the project

```
workon arduino-cloud-compiler
```

Install Flask

```
pip install flask
```

Install Ino

```
pip install ino
```


Copy
`~/Projects/github/arduino-cloud-compiler/lib/python2.7/site-packages/ino`
to
`/root/.virtualenvs/arduino-cloud-compiler/lib/python2.7/site-packages/ino`

Update the `host` and `compiled_path` variables in `index.py`

Start the server

```
python index.py
```

Installation on OS X
======================

#####Note: this is incomplete

Replace
`~/Projects/github/arduino-cloud-compiler/lib/python2.7/site-packages/ino/make/Makefile.sketch.jinja`
with
`~/Projects/github/arduino-cloud-compiler/lib/python2.7/site-packages/ino/make/OSX_Makefile.sketch.jinja`

Usage
======================

### Remove all compiled sketches from server
Navigate to `http://localhost:5000/clear` in your browser

### Compile a sketch using cURL
```
curl --data-binary "@./examples/cURL/example.ino" http://localhost:5000/compile
```
