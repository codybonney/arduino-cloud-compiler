from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
@app.route('/<name>', methods=['GET', 'POST'])
def login(name=None):
    if request.method == 'POST':
        return 'POST request'
    else:
        return render_template('landing.html', name=name)

if __name__ == '__main__':
    app.run(debug=True)
