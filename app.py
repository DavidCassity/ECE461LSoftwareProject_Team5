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
app.config['PERMANENT_SESSION_LIFETIME'] = 600 # 3600 for 1 hour, 1800 for 30 minutes, 600 for 10 minutes
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
        return User(user['usernameID'])
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
            print("Incorrect password")
            return jsonify({'authenticated': False}), 401
    else:
        print("User not found")
        return jsonify({'authenticated': False}), 401

    print(usernameID, password)

    # Retrieve user from the database
    #user = db.users.find_one({'username': usernameID})
@app.route('/logout')
@login_required
def logout():
    logout_user()

@app.route('/projects', methods=['GET'])
def view_projects():
    user = str(current_user.id)
    print('Current User: ', user)
    if current_user.is_authenticated:
        user_cur = users.find_one({'usernameID': user})
        print(user_cur)

        project_names = user_cur['joined_projects']
        projectList = []
        for project in project_names:
            project_data = projects.find_one({'projectID': project})
            if project_data:
                # Convert ObjectId to string for serialization
                project_data['_id'] = str(project_data['_id'])
                projectList.append(project_data)

        return jsonify({'authenticated': True, 'userID': user, 'projects': projectList}), 200
    #otherwise, return to login page
    return jsonify({'authenticated': False}), 401

@app.route('/projects', methods=["POST"])
@cross_origin()
def projectHandler():
    try:
        print("Raw request body:", request.data)  # Print raw request body
        data = request.json  # Parse JSON data from the request body
        print("Parsed JSON data:", data)  # Print parsed JSON data
        action = data.get('action')
        
        if action == 'join':
            return joinProject(data)
        elif action == 'create':
            print("Creating project")
            return createProject(data)
        else:
            print("Invalid action specified")
            return jsonify({'error': 'Invalid action specified'}), 400
    except Exception as e:
        print("Exception:", e)
        return jsonify({'error': str(e)}), 400
    

"""
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
            print("Invalid action specified")
            return jsonify({'error': 'Invalid action specified'}), 400
    except Exception as e:
        print("Exception: ", e)
        return jsonify({'error': str(e)}), 400
"""

def createProject(data):
    ownerID = current_user.id
    projectID = data.get('projectID')
    password = data.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_project = {
        'projectID': projectID,
        'password': hashed_password,
        'ownerID' : ownerID,
        'members': [ownerID],
        'checkOut': {
            ownerID: [0, 0]
        },
        'availability': [100, 100],
        'capacity': [100, 100]
    }

    myquery = {"projectID": projectID}
    x = projects.find_one(myquery)

    if x is None:
        # Insert the new project
        projects.insert_one(new_project)

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
    usernameID = current_user.id
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
                    "$set": {f"checkOut.{usernameID}": [0, 0]}
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
        
@app.route('/projects/<int:hwset>/<int:amount>/<string:checkoutStr>', methods=['POST'])
def updateProject(hwset, amount, checkoutStr):
    checkout = checkoutStr.lower() == 'true'
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

        # Update the project document in the projects collection
        projects.update_one(
            {"projectID": project['projectID']},
            {"$set": {
            "availability": project["availability"],
            f"checkOut.{current_user.id}": project["checkOut"][current_user.id]
            }}
        )
        return False, 'Hardware successfully checked out'
    
    else:
        return True, 'Attempted to check out more hardware than available'
    
    
def hardware_checkin(project, hwset, amount):
    if project['checkOut'][current_user.id][hwset] >= amount:
        project['availability'][hwset] += amount
        project['checkOut'][current_user.id][hwset] -= amount   

        # Update the project document in the projects collection
        projects.update_one(
            {"projectID": project['projectID']},
            {"$set": {
            "availability": project["availability"],
            f"checkOut.{current_user.id}": project["checkOut"][current_user.id]
            }}
        )
        return False, 'Hardware successfully checked in'
    
    else:
        return True, 'Attempted to check in more hardware than checked out'
    


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 80))