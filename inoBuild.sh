#!/bin/sh

if [ "$1" = "" ]
then
    echo "Usage: $0 <full path to directory> [note]"
    exit
fi

# navigate to the directory
cd $1;

# build the project
ino build;