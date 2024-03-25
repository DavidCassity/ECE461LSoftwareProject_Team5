from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from flask_bcrypt import Bcrypt
from flask import jsonify
import os

app = Flask(__name__, static_folder="./build", static_url_path="/")
CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

# Get uri from login.txt
uri = ""
with open("login.txt", "r") as file:
    uri = file.read()

client = MongoClient(uri, server_api=ServerApi('1'))
users = client.Users.users
projects = client.Projects.projects

# Bcrypt for password hashing
bcrypt = Bcrypt(app)

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

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
        'owned_projects' : [],
        'joined_projects': []
    }

    myquery = {"usernameID":usernameID}
    x = users.find_one(myquery)

    if x is None:
        users.insert_one(new_user)
        return jsonify({'validUsernameID': True}), 200
    else:
        return jsonify({'validUsernameID': False}), 401

@app.route('/login', methods=["POST"])
def login():
    data = request.json
    usernameID = data.get('username')
    password = data.get('password')

    myquery={"usernameID":usernameID}
    x=users.find_one(myquery)

    if x is not None:
        match = bcrypt.check_password_hash(x['password'], password)
        if match:
            return jsonify({'authenticated': True}), 200
        else:
            return jsonify({'authenticated': False}), 401
    else:
        return jsonify({'authenticated': False}), 401

@app.route('/projects', methods=["POST"])
@cross_origin()
def projectHandler():
    try:
        data = request.json  # Parse JSON data from the request body
        action = data.get('action')

        if action == 'join':
            return joinProject(data)
        elif action == 'create':
            return createProject(data)
        else:
            return jsonify({'error': 'Invalid action specified'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def createProject(data):
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

    myquery = {"projectID": projectID}
    x = projects.find_one(myquery)

    if x is None:
        # Insert the new project
        projects.insert_one(new_project)
        projects.update_one(
            {"projectID": projectID},
            {"$push": {"members": ownerID}}
        )

        # Update the user's owned_projects
        users.update_one(
            {"usernameID": ownerID},
            {"$push": {"owned_projects": projectID}}
        )

        # Update the user's joined_projects
        users.update_one(
            {"usernameID": ownerID},
            {"$push": {"joined_projects": projectID}}
        )

        return jsonify({'validProjectID': True}), 200
    else:
        return jsonify({'validProjectID': False}), 401
    
def joinProject(data):
    usernameID = data.get('usernameID')
    projectID = data.get('projectID')
    password = data.get('password')

    myquery = {"projectID": projectID}
    project = projects.find_one(myquery)

    if project is not None:
        # Check password
        if bcrypt.check_password_hash(project['password'], password):
            
            # Update project's "members" list with usernameID
            projects.update_one(
                {"projectID": projectID},
                {"$push": {"members": usernameID}}
            )

            # Update user's "joined_projects" list with projectID
            users.update_one(
                {"usernameID": usernameID},
                {"$push": {"joined_projects": projectID}}
            )

            return jsonify({'authenticated': True}), 200
        else:
            return jsonify({'authenticated': False, 'error': 'Incorrect password'}), 401
    else:
        return jsonify({'authenticated': False, 'error': 'Project not found'}), 404

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 80))