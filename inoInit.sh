#!/bin/sh

if [ "$1" = "" ]
then
    echo "Usage: $0 <full path to directory> [note]"
    exit
fi

# create the temporary directory for compiling
mkdir -p $1;

# navigate to the directory
cd $1;

# initialize ino project
ino init;