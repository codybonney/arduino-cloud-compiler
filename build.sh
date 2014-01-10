#!/bin/sh

# src/sketch.ino
/usr/local/bin/ino preproc -o .build/uno/src/sketch.cpp src/sketch.ino

# build dependancies
/Applications/Arduino.app/Contents/Resources/Java/hardware/tools/avr/bin/avr-gcc -mmcu=atmega328p -DF_CPU=16000000L -DARDUINO=105 -I/Applications/Arduino.app/Contents/Resources/Java/hardware/arduino/cores/arduino -ffunction-sections -fdata-sections -g -Os -w -I/Applications/Arduino.app/Contents/Resources/Java/hardware/arduino/variants/standard -I/Applications/Arduino.app/Contents/Resources/Java/hardware/arduino/cores/arduino -I/Applications/Arduino.app/Contents/Resources/Java/hardware/arduino/cores/arduino/avr-libc -I/Applications/Arduino.app/Contents/Resources/Java/libraries/EEPROM -I/Applications/Arduino.app/Contents/Resources/Java/libraries/Esplora -I/Applications/Arduino.app/Contents/Resources/Java/libraries/Ethernet -I/Applications/Arduino.app/Contents/Resources/Java/libraries/Ethernet/utility -I/Applications/Arduino.app/Contents/Resources/Java/libraries/Firmata -I/Applications/Arduino.app/Contents/Resources/Java/libraries/GSM -I/Applications/Arduino.app/Contents/Resources/Java/libraries/LiquidCrystal -I/Applications/Arduino.app/Contents/Resources/Java/libraries/Robot_Control -I/Applications/Arduino.app/Contents/Resources/Java/libraries/Robot_Control/utility -I/Applications/Arduino.app/Contents/Resources/Java/libraries/Robot_Motor -I/Applications/Arduino.app/Contents/Resources/Java/libraries/SD -I/Applications/Arduino.app/Contents/Resources/Java/libraries/SD/utility -I/Applications/Arduino.app/Contents/Resources/Java/libraries/Servo -I/Applications/Arduino.app/Contents/Resources/Java/libraries/SoftwareSerial -I/Applications/Arduino.app/Contents/Resources/Java/libraries/SPI -I/Applications/Arduino.app/Contents/Resources/Java/libraries/Stepper -I/Applications/Arduino.app/Contents/Resources/Java/libraries/TFT -I/Applications/Arduino.app/Contents/Resources/Java/libraries/TFT/utility -I/Applications/Arduino.app/Contents/Resources/Java/libraries/WiFi -I/Applications/Arduino.app/Contents/Resources/Java/libraries/WiFi/utility -I/Applications/Arduino.app/Contents/Resources/Java/libraries/Wire -I/Applications/Arduino.app/Contents/Resources/Java/libraries/Wire/utility -iquote src  -MM .build/uno/src/sketch.cpp > .build/uno/src/sketch.d

# Scanning dependencies of src
cat .build/uno/src/sketch.d > .build/uno/src/dependencies.d;

# src/sketch.cpp
/Applications/Arduino.app/Contents/Resources/Java/hardware/tools/avr/bin/avr-g++ -mmcu=atmega328p -DF_CPU=16000000L -DARDUINO=105 -I/Applications/Arduino.app/Contents/Resources/Java/hardware/arduino/cores/arduino -ffunction-sections -fdata-sections -g -Os -w -I/Applications/Arduino.app/Contents/Resources/Java/hardware/arduino/variants/standard -I/Applications/Arduino.app/Contents/Resources/Java/hardware/arduino/cores/arduino -I/Applications/Arduino.app/Contents/Resources/Java/hardware/arduino/cores/arduino/avr-libc -fno-exceptions -iquote src  -o .build/uno/src/sketch.o -c .build/uno/src/sketch.cpp

# Linking firmware.elf
/Applications/Arduino.app/Contents/Resources/Java/hardware/tools/avr/bin/avr-gcc -mmcu=atmega328p -Wl,-Os -Wl,--gc-sections -o .build/uno/firmware.elf .build/uno/src/sketch.o .build/uno/arduino/libarduino.a -lm

# Converting to firmware.hex
/Applications/Arduino.app/Contents/Resources/Java/hardware/tools/avr/bin/avr-objcopy -O ihex -R .eeprom .build/uno/firmware.elf .build/uno/firmware.hex