from flask import Flask, request, jsonify, make_response
import string
import random
import os
import os.path
import ino.runner
import time
import shutil
from ino.exc import Abort

# local machine
host = '192.168.1.33'
compiled_path = "/Users/cody/Projects/github/arduino-cloud-compiler/compiled/"


app = Flask(__name__)


def random_string(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))


def send_response(sketch=None, firmware=None, error=None, start_time=0, sketch_id=None):
    end_time = time.time()

    processing_time_seconds = round((end_time - start_time), 2)
    processing_time_ms = int(processing_time_seconds * 1000)

    firmware_size_bytes = None
    firmware_size_kilobytes = None

    if firmware is not None:
        firmware_size_bytes = len(firmware)
        firmware_size_kilobytes = round((float(firmware_size_bytes)/1024), 2)

    return jsonify(
        sketch=sketch,
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
    except Abort as e:
        return send_response(
            error=str(e),
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
        sketch=sketch,
        firmware=hex_data,
        start_time=start_time,
        sketch_id=sketch_id
    )


@app.route('/')
def submission():
    return app.send_static_file('landing.html')


@app.route('/clear')
def clear():
    try:
        projects = len([name for name in os.listdir(compiled_path)])
    except:
        projects = 0

    shutil.rmtree(compiled_path)
    os.mkdir(compiled_path)

    return 'Removed ' + str(projects) + ' compiled projects from the server.'


@app.route('/<sketch>.json')
def project(sketch):
    start_time = time.time()

    # fetch sketch data
    try:
        sketch_file = open(compiled_path + sketch + '/src/sketch.ino', "r")
        sketch_data = sketch_file.read()
        sketch_file.close()
    except:
        return send_response(
            error="unable to read sketch file"
        )

    # fetch compiled data
    try:
        compiled_hex_file = open(compiled_path + sketch + '/.build/uno/firmware.hex', "r")
        hex_data = compiled_hex_file.read()
        compiled_hex_file.close()
    except:
        return send_response(
            error="unable to read compiled file"
        )

    return send_response(
        sketch=sketch_data,
        firmware=hex_data,
        start_time=start_time,
        sketch_id=sketch
    )


@app.route('/<sketch>/firmware.hex')
def project_firmware(sketch):

    # fetch compiled data
    try:
        compiled_hex_file = open(compiled_path + sketch + '/.build/uno/firmware.hex', "r")
        hex_data = compiled_hex_file.read()
        compiled_hex_file.close()
    except:
        return send_response(
            error="unable to read compiled file"
        )

    response = make_response(hex_data)
    response.headers["Content-Disposition"] = "attachment; filename=firmware.hex"

    return response


@app.route('/<sketch>/sketch.ino')
def project_sketch(sketch):

    # fetch sketch data
    try:
        sketch_file = open(compiled_path + sketch + '/src/sketch.ino', "r")
        sketch_data = sketch_file.read()
        sketch_file.close()
    except:
        return send_response(
            error="unable to read sketch file"
        )
    response = make_response(sketch_data)
    response.headers["Content-Disposition"] = "attachment; filename=sketch.ino"

    return response



@app.route('/compile', methods=['POST'])
def compile_sketch():
    return compile_arduino_sketch(request.form["sketch"])

if __name__ == '__main__':
    app.run(debug=True, host=host)
