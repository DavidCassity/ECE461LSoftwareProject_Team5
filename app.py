from flask import Flask, send_from_directory,request,json
from flask_cors import cross_origin, CORS
import json
import os


app = Flask(__name__, static_folder="./build", static_url_path="/")
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/', methods=["GET"])
def home():
    return send_from_directory(app.static_folder, "index.html")


@app.route('/login', methods=["GET"])
def login():
    return send_from_directory(app.static_folder, "index.html")


@app.route('/project-management')
def projectManagement():
    return send_from_directory(app.static_folder, "index.html")

@app.route('/signup')
def signup():
    return send_from_directory(app.static_folder, "index.html")


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 81))