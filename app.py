from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from flask_bcrypt import Bcrypt
import os

app = Flask(__name__, static_folder="./build", static_url_path="/")
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# MongoDB connection
uri = "mongodb+srv://davidcassity:1@swproject.g87xiyc.mongodb.net/?retryWrites=true&w=majority&appName=SWProject"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client.Users

# Bcrypt for password hashing
bcrypt = Bcrypt(app)

@app.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    data = request.json
    usernameID = data.get('usernameID')
    password = data.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = {
        'usernameID': usernameID,
        'password': hashed_password,
        'owned_projects' : {},
        'joined_projects': {}
    }

    result = db.users.insert_one(new_user)

    if result.inserted_id:
        return jsonify({'message': 'User created successfully'}), 201
    else:
        return jsonify({'message': 'Error creating user'}), 500

@app.route('/', methods=["GET"])
@app.route('/login', methods=["GET"])
@app.route('/project-management')
@app.route('/signup')
def serve_static():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 81))