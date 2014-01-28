from flask import Flask, request, jsonify
import string
import random
import os.path
import ino.runner
import time
from ino.exc import Abort

host = '192.168.1.33'
compiled_path = "/Users/cody/Projects/github/arduino-cloud-compiler/compiled/"
app = Flask(__name__)


def random_string(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))


def send_error(error_message="Unkown Error", start_time=0):
    end_time = time.time()

    processing_time_seconds = round((end_time - start_time), 2)
    processing_time_ms = int(processing_time_seconds * 1000)

    return jsonify(
        error=error_message,
        processing_time_seconds=processing_time_seconds,
        processing_time_ms=processing_time_ms
    )


def send_success(hex="Missing HEX data", start_time=0):
    end_time = time.time()

    processing_time_seconds = round((end_time - start_time), 2)
    processing_time_ms = int(processing_time_seconds * 1000)

    return jsonify(
        firmware_hex=hex,
        processing_time_seconds=processing_time_seconds,
        processing_time_ms=processing_time_ms
    )


def compile_arduino_sketch(sketch):
    start_time = time.time()
    sketch_id = random_string()
    compiled_dir = compiled_path + sketch_id + "/"

    # create a directory for the compiled sketch
    try:
        os.mkdir(compiled_dir)
    except OSError:
        return send_error("could not create directory", start_time)

    # change into created directory
    try:
        os.chdir(compiled_dir)
    except OSError:
        return jsonify(error="could not change to created directory")

    # initialize build
    try:
        ino.runner.main(['ino', 'init'], compiled_dir)
    except:
        return jsonify(error="unable to initialize build")

    # write the sketch.ino file
    try:
        sketch_file = open("src/sketch.ino", "w+")
        sketch_file.write(sketch)
        sketch_file.close()
    except:
        return jsonify(error="unable to write sketch file")

    # build the project
    try:
        ino.runner.main(['ino', 'build'], compiled_dir)
    except Abort as e:
        return send_error(str(e), start_time)

    # fetch compiled data
    try:
        compiled_hex_file = open(".build/uno/firmware.hex", "r")
        hex_data = compiled_hex_file.read()
        compiled_hex_file.close()
    except:
        return jsonify(error="unable to read compiled file")

    return send_success(hex_data, start_time)


@app.route('/')
def submission():
    return app.send_static_file('landing.html')


@app.route('/compile', methods=['POST'])
def compile_sketch():
    return compile_arduino_sketch(request.form["sketch"])

if __name__ == '__main__':
    app.run(debug=True, host=host)
