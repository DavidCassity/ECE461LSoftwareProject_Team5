from flask import Flask, send_from_directory, request, jsonify, redirect, url_for
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from flask_bcrypt import Bcrypt
from flask import jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, confirm_login, logout_user, current_user
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
app.config['PERMANENT_SESSION_LIFETIME'] = 3600 # In seconds, 3600 for 1 hour, 1800 for 30 minutes, 600 for 10 minutes
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

@app.route('/getuser', methods=["GET"])
def get_user():
    if current_user.is_authenticated:
        return jsonify({'authenticated': True, 'usernameID': current_user.id}), 200
    else:
        return jsonify({'authenticated': False}), 401
    
@app.route('/logout', methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True, "message": "User successfully logged out."}), 200


@app.route('/projects', methods=['GET'])
def view_projects():
    if current_user.is_authenticated:
        confirm_login()
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
    # Check if the user is logged in
    if not current_user.is_authenticated:
        return jsonify({'error': 'User session is expired'}), 401
    confirm_login()
    ownerID = current_user.id
    projectID = data.get('projectID')
    description = data.get('description')
    password = data.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_project = {
        'projectID': projectID,
        'description': description,
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
    # Check if the user is logged in
    if not current_user.is_authenticated:
        return jsonify({'authenticated': False, 'error': 'User session is expired'}), 404
    confirm_login()
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

@app.route('/leave/<projectID>', methods=['POST'])
def leave_project(projectID):
    # Check if the user is logged in
    if not current_user.is_authenticated:
        return jsonify({'error': 'User session is expired'}), 404
    confirm_login()
    try:
        data = request.json
        userID = data.get('userID')
        
        # Retrieve the project
        project = projects.find_one({'projectID': projectID})
        if project is None:
            return jsonify({'error': 'Project not found'}), 404
        
        # Remove the user from the project's members list
        projects.update_one({'projectID': projectID}, {'$pull': {'members': userID}})
        
        # Remove the project from the user's joined_projects list
        users.update_one({'usernameID': userID}, {'$pull': {'joined_projects': projectID}})
        
        # Return the hardware to the respective hardware sets
        for hwset, amount in enumerate(project['checkOut'][userID]):
            if amount > 0:
                if hwset == 0:
                    HWSet1.update_one({}, {"$inc": {"availability": amount}})
                else:
                    HWSet2.update_one({}, {"$inc": {"availability": amount}})
        
        # Remove the user from the project's checkOut list
        projects.update_one({'projectID': projectID}, {'$unset': {f'checkOut.{userID}': 1}})
        
        return jsonify({'message': 'Successfully left the project'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/projects/<projectID>', methods=['DELETE'])
def delete_project(projectID):
    # Check if the user is logged in
    if not current_user.is_authenticated:
        return jsonify({'error': 'User session is expired'}), 404
    confirm_login()
    try:
        project = projects.find_one({'projectID': projectID})
        if project is None:
            return jsonify({'error': 'Project not found'}), 404

        # Remove the project from the database
        result = projects.delete_one({'projectID': projectID})

        if result.deleted_count == 1:
            # Remove the project from the user's joined_projects list
            users.update_many({"joined_projects": projectID}, {"$pull": {"joined_projects": projectID}})

            # If the user is the owner of the project, remove it from owned_projects list as well
            if current_user.id == project['ownerID']:
                users.update_many({}, {"$pull": {"owned_projects": projectID}})

            # Return the hardware to the respective hardware sets
            for member in project['members']:
                for hwset, amount in enumerate(project['checkOut'][member]):
                    if amount > 0:
                        if hwset == 0:
                            HWSet1.update_one({}, {"$inc": {"availability": amount}})
                        else:
                            HWSet2.update_one({}, {"$inc": {"availability": amount}})

            return jsonify({'message': 'Successfully deleted the project'}), 200
        else:
            return jsonify({'error': 'Project not found or you do not have permission to delete it'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
@app.route('/projects/<int:hwset>/<int:amount>/<string:checkoutStr>', methods=['POST'])
def updateProject(hwset, amount, checkoutStr):
    checkout = checkoutStr.lower() == 'true'
    if current_user.is_authenticated:
        confirm_login()
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
    # Check if the user is logged in
    if not current_user.is_authenticated:
        return False, 'User session is expired. Please log in again'
    confirm_login()
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
    # Check if the user is logged in
    if not current_user.is_authenticated:
        return False, 'User session is expired. Please log in again'
    confirm_login()
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
    
# Commented out code
# @app.route('/favicon.ico')
# def favicon():
#     return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

    
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 80))