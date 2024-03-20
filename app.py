from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from flask_bcrypt import Bcrypt
import os

app = Flask(__name__, static_folder="./build", static_url_path="/")
CORS(app)
#app.config['CORS_HEADERS'] = 'Content-Type'

#Get uri from login.txt
uri = ""
with open("login.txt", "r") as file:
    uri = file.read()

# MongoDB connection
uri = ""
with open("login.txt", "r") as file:
    uri = file.read()

client = MongoClient(uri, server_api=ServerApi('1'))
db = client.Users
users = db.users
projects = client.Projects.projects

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

    myquery = {"usernameID":usernameID}
    x = users.find_one(myquery)

    if x is None:
        users.insert_one(new_user)
        return jsonify({'validUsernameID': True}), 200
    else:
        return jsonify({'validUsernameID': False}), 401

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route('/login', methods=["POST"])
def login():
    data = request.json
    usernameID = data.get('username')
    password = data.get('password')

    
    myquery={"usernameID":usernameID}
    x=users.find_one(myquery)
    print(x)

    if x is not None:
        match = bcrypt.check_password_hash(x['password'], password)
        print(match)
        if match:
            return jsonify({'authenticated': True}), 200
        else:
            return jsonify({'authenticated': False}), 401
    else:
        return jsonify({'authenticated': False}), 401

    print(usernameID, password)

    # Retrieve user from the database
    #user = db.users.find_one({'username': usernameID})

@app.route('/projects', methods=["POST"])
@cross_origin()
def createProject():
    data = request.json
    ownerID = data.get('ownerID')
    projectID = data.get('projectID')
    password = data.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_project = {
        'projectID': projectID,
        'password': hashed_password,
        'ownerID' : ownerID,
        'members': []
    }

    myquery = {"projectID":projectID}
    x = projects.find_one(myquery)

    if x is None:
        projects.insert_one(new_project)
        return jsonify({'validProjectID': True}), 200
    else:
        return jsonify({'validProjectID': False}), 401

def serve_static():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 80))