from flask import Flask, request, render_template

app = Flask(__name__)


@app.route('/compile', methods=['POST'])
def compile_sketch():
    return 'compiling'

if __name__ == '__main__':
    app.run(debug=True)
