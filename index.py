from flask import Flask, request, jsonify
import string
import random
import os.path
import ino.runner
from ino.exc import Abort

host = '192.168.1.33'
compiled_path = "/Users/cody/Projects/github/arduino-cloud-compiler/compiled/"
app = Flask(__name__)


def random_string(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))


def compile_arduino_sketch(sketch):
    sketch_id = random_string()
    compiled_dir = compiled_path + sketch_id + "/"

    # create a directory for the compiled sketch
    try:
        os.mkdir(compiled_dir)
    except OSError:
        return jsonify(error="could not create directory")

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
        return jsonify(error=str(e))

    # fetch compiled data
    try:
        compiled_hex_file = open(".build/uno/firmware.hex", "r")
        hex_data = compiled_hex_file.read()
        compiled_hex_file.close()
    except:
        return jsonify(error="unable to read compiled file")

    return jsonify(data=hex_data)


@app.route('/')
def submission():
    return app.send_static_file('landing.html')


@app.route('/compile', methods=['POST'])
def compile_sketch():
    return compile_arduino_sketch(request.form["sketch"])


@app.route('/compile/json', methods=['POST'])
def compile_sketch_json():
    return jsonify(hex=compile_arduino_sketch(request.form["sketch"]))


if __name__ == '__main__':
    app.run(debug=True, host=host)
