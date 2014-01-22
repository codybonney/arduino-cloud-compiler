from flask import Flask, request, render_template

import sys
import os.path
import ino.runner

app = Flask(__name__)

@app.route('/compile', methods=['POST'])
def compile_sketch():
    compiled = "/Users/cody/Projects/github/arduino-cloud-compiler/compiled"

    os.chdir(compiled)
    ino.runner.main(['ino', 'init'])

    return 'compiling'

if __name__ == '__main__':
    app.run(debug=True)
