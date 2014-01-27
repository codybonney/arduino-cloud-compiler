from flask import Flask, request, render_template, url_for, jsonify
import json
import string
import random
import os.path
import ino.runner

host = '192.168.1.33'
compiled_path = "/Users/cody/Projects/github/arduino-cloud-compiler/compiled/"
app = Flask(__name__)


def random_string(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))


def compile_arduino_sketch(sketch):
    sketch_id = random_string()
    compiled_dir = compiled_path + sketch_id + "/"

    # create a directory for the compiled sketch
    os.mkdir(compiled_dir)
    os.chdir(compiled_dir)

    # initialize
    ino.runner.main(['ino', 'init'], compiled_dir)

    # write the sketch.ino file
    sketch_file = open("src/sketch.ino", "w+")
    sketch_file.write(sketch)
    sketch_file.close()

    # build the project
    ino.runner.main(['ino', 'build'], compiled_dir)

    # fetch compiled data
    compiled_hex_file = open(".build/uno/firmware.hex", "r")
    hex_data = compiled_hex_file.read()
    compiled_hex_file.close()

    return hex_data


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
