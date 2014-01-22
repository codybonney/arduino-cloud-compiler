from flask import Flask, request
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return 'POST request'
    else:
        return 'GET request'

if __name__ == '__main__':
    app.run(debug=True)