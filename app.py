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
HWSet1 = client.Hardware.HWSet1
HWSet2 = client.Hardware.HWSet2

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


    # Retrieve user from the database
    #user = db.users.find_one({'username': usernameID})
@app.route('/logout')
@login_required
def logout():
    logout_user()

@app.route('/projects', methods=['GET'])
def view_projects():
    if current_user.is_authenticated:
        user = str(current_user.id)
        print('Current User: ', user)
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
        
        HWSet1_data = HWSet1.find_one({})
        HWSet2_data = HWSet2.find_one({})
        availability = [HWSet1_data['availability'], HWSet2_data['availability']]
        capacity = [HWSet1_data['capacity'], HWSet2_data['capacity']]

        return jsonify({'authenticated': True, 'userID': user, 'projects': projectList, 'availability': availability, 'capacity': capacity}), 200
    else:
        # Handle the case when the user is not authenticated
        return jsonify({'authenticated': False, 'error': 'User is not authenticated'}), 401


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
    current_hwset = None
    if hwset == 0:
        current_hwset = HWSet1.find_one({})
    else:
        current_hwset = HWSet2.find_one({}) 

    if current_hwset['availability'] >= amount:
        current_hwset['availability'] -= amount
        project['checkOut'][current_user.id][hwset] += amount

        # Update the project document in the projects collection
        projects.update_one(
            {"projectID": project['projectID']},
            {"$set": {
            f"checkOut.{current_user.id}": project["checkOut"][current_user.id]
            }}
        )

        # Update the hardware document in the hardware collection
        if hwset == 0:
            HWSet1.update_one(
                {},
                {"$set": {
                "availability": current_hwset["availability"]
                }}
            )
        else:
            HWSet2.update_one(
                {},
                {"$set": {
                "availability": current_hwset["availability"]
                }}
            )
        return False, 'Hardware successfully checked out'
    
    else:
        return True, 'Attempted to check out more hardware than available'
    
    
def hardware_checkin(project, hwset, amount):
    current_hwset = None
    if hwset == 0:
        current_hwset = HWSet1.find_one({})
    else:
        current_hwset = HWSet2.find_one({}) 

    if project['checkOut'][current_user.id][hwset] >= amount:
        current_hwset['availability'] += amount
        project['checkOut'][current_user.id][hwset] -= amount

        # Update the project document in the projects collection
        projects.update_one(
            {"projectID": project['projectID']},
            {"$set": {
            f"checkOut.{current_user.id}": project["checkOut"][current_user.id]
            }}
        )

        # Update the hardware document in the hardware collection
        if hwset == 0:
            HWSet1.update_one(
                {},
                {"$set": {
                "availability": current_hwset["availability"]
                }}
            )
        else:
            HWSet2.update_one(
                {},
                {"$set": {
                "availability": current_hwset["availability"]
                }}
            )
        return False, 'Hardware successfully checked in'
    
    else:
        return True, 'Attempted to check in more hardware than checked out'
    


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 80))