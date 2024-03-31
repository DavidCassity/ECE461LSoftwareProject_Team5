from flask import Flask, send_from_directory, request, jsonify, redirect, url_for
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from flask_bcrypt import Bcrypt
from flask import jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import os

#User class that inherits UserMixin
class User(UserMixin):
    def __init__(self, username):
        self.id = username

app = Flask(__name__, static_folder="./build", static_url_path="/")
CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

#Create key and initalize Flask-Login
app.secret_key = "secretkey"
login_manager = LoginManager()
login_manager.init_app(app)

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



@login_manager.user_loader
def load_user(user_id):
    myquery={"usernameID":user_id}
    user = users.find_one(myquery)
    if user is not None:
        print("User cookie")
        return User(user)
    return None

@app.route('/login', methods=["GET"])
def login_page():
    return send_from_directory(app.static_folder, "index.html")

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
            current_user = User(usernameID)
            login_user(current_user)
            return jsonify({'authenticated': True}), 200
        else:
            return jsonify({'authenticated': False}), 401
    else:
        return jsonify({'authenticated': False}), 401

    print(usernameID, password)

    # Retrieve user from the database
    #user = db.users.find_one({'username': usernameID})

@app.route('/projects', methods=['GET'])
def view_projects():
    user = str(current_user.id)
    print(user)
    if current_user.is_authenticated:
        return jsonify({'authenticated': True, 'userID': user}), 200
    #otherwise, return to login page
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
        'members': [],
        'checkOut': {
            ownerID: []
        },
        'availability': [],
        'capacity': []
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
                {
                    "$push": {"members": usernameID},
                    "$set": {f"checkOut.{usernameID}": []}
                }
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
        
@app.route('/projects/<int:hwset>/<int:amount>/<boolean: checkout', methods=['POST'])
def updateProject(hwset, amount, checkout):
    if current_user.is_authenticated:
        data = request.json
        projectID = data.get('projectID')
        usernameID = current_user.id

        myquery = {"projectID": projectID}
        project = projects.find_one(myquery)

        if project is not None:
            message = ""
            error = False
            if checkout:
                error, message = hardware_checkout(project, hwset, amount)
                
            else:
                error, message = hardware_checkin(project, hwset, amount)

            return jsonify({'authenticated': True, 'error': error, 'message': message}), 200
        
        else:
            return jsonify({'authenticated': False}), 404
        

def hardware_checkout(project, hwset, amount):
    if project['availability'][hwset] >= amount:
        project['availability'][hwset] -= amount
        project['checkOut'][current_user.id][hwset] += amount
        return False, 'Hardware successfully checked out'
    
    else:
        return True, 'Attempted to check out more hardware than available'
    
    
def hardware_checkin(project, hwset, amount):
    if project['checkOut'][current_user.id][hwset] >= amount:
        project['availability'][hwset] += amount
        project['checkOut'][current_user.id][hwset] -= amount   
        return False, 'Hardware successfully checked in'
    
    else:
        return True, 'Attempted to check in more hardware than checked out'
    


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 80))