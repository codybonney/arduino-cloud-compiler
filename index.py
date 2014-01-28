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


def send_response(firmware=None, error=None, start_time=0, sketch_id=None):
    end_time = time.time()

    processing_time_seconds = round((end_time - start_time), 2)
    processing_time_ms = int(processing_time_seconds * 1000)

    firmware_size_bytes = None
    firmware_size_kilobytes = None

    if firmware is not None:
        firmware_size_bytes = len(firmware)
        firmware_size_kilobytes = round((float(firmware_size_bytes)/1024), 2)

    return jsonify(
        firmware=firmware,
        error=error,
        processing_time_seconds=processing_time_seconds,
        processing_time_ms=processing_time_ms,
        sketch_id=sketch_id,
        firmware_size_bytes=firmware_size_bytes,
        firmware_size_kilobytes=firmware_size_kilobytes
    )


def compile_arduino_sketch(sketch):
    start_time = time.time()
    sketch_id = random_string()
    compiled_dir = compiled_path + sketch_id + "/"

    # create a directory for the compiled sketch
    try:
        os.mkdir(compiled_dir)
    except OSError:
        return send_response(
            error="could not create directory",
            start_time=start_time
        )

    # change into created directory
    try:
        os.chdir(compiled_dir)
    except OSError:
        return send_response(
            error="could not change to created directory",
            start_time=start_time
        )

    # initialize build
    try:
        ino.runner.main(['ino', 'init'], compiled_dir)
    except:
        return send_response(
            error="unable to initialize build",
            start_time=start_time
        )

    # write the sketch.ino file
    try:
        sketch_file = open("src/sketch.ino", "w+")
        sketch_file.write(sketch)
        sketch_file.close()
    except:
        return send_response(
            error="unable to write sketch file",
            start_time=start_time
        )

    # build the project
    try:
        ino.runner.main(['ino', 'build'], compiled_dir)
    except Abort as e:
        return send_response(
            error=str(e),
            start_time=start_time
        )

    # fetch compiled data
    try:
        compiled_hex_file = open(".build/uno/firmware.hex", "r")
        hex_data = compiled_hex_file.read()
        compiled_hex_file.close()
    except:
        return send_response(
            error="unable to read compiled file",
            start_time=start_time
        )

    return send_response(
        firmware=hex_data,
        start_time=start_time,
        sketch_id=sketch_id
    )


@app.route('/')
def submission():
    return app.send_static_file('landing.html')


@app.route('/compile', methods=['POST'])
def compile_sketch():
    return compile_arduino_sketch(request.form["sketch"])

if __name__ == '__main__':
    app.run(debug=True, host=host)
