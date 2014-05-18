import os
from flask import Flask, render_template

app = Flask(__name__)

API_KEY = os.environ['API_KEY']

@app.route('/')
def hello_world():
	return render_template('hello_maps.html', api_key=API_KEY )
   

if __name__ == '__main__':
    #app.debug = True
    app.run()
