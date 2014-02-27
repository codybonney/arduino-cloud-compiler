Arduino Cloud Compiler
======================

A web service for compiling Arduino sketches.

Currently working on:
* OS X 10.9
* Ubuntu 12

##### NOTE: This is a work in progress. It should not be used in production!

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

Install virtualenvwrapper

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

Navigate to the projects directory

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

Update the `host` and `compiled_path` variables in `index.py`

Update the target path in `arduino-cloud-compiler/lib/python2.7/site-packages/ino/make/Makefile.sketch.jinja`

Start the server

```
python index.py
```

Usage
======================

### Using cURL
```
curl --data-binary "@./examples/cURL/example.ino" http://192.168.1.33:5000/compile
```
