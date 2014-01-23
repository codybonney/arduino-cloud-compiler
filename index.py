from flask import Flask, request, render_template
import string
import random
import os.path
import ino.runner


def random_string(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))

app = Flask(__name__)

@app.route('/')
def submission():
    return render_template('landing.html')


@app.route('/compile', methods=['POST'])
def compile_sketch():
    sketch_id = random_string()
    compiled_dir = "/Users/cody/Projects/github/arduino-cloud-compiler/compiled/" + sketch_id + "/"

    # create a directory for the compiled sketch
    os.mkdir(compiled_dir)
    os.chdir(compiled_dir)

    # initialize
    ino.runner.main(['ino', 'init'], compiled_dir)

    # write the sketch.ino file
    sketch_file = open("src/sketch.ino", "w+")
    sketch_file.write(request.form["sketch"])
    sketch_file.close()

    # build the project
    ino.runner.main(['ino', 'build'], compiled_dir)

    return 'compiling'

if __name__ == '__main__':
    app.run(debug=True)
