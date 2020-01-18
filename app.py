from flask import Flask,Blueprint, flash, g, redirect, render_template, request, session, url_for, Response
import requests
import json
from credentials import firebase,gcp_access_token
from flask_cors import CORS
import datetime
app = Flask(__name__)

CORS(app)


#Patient Methods
def create_patient(_id,first_name,last_name,phone,e_name,e_num):
    patient_endpoint ="https://uoft-hacks-2f135.firebaseio.com/patients.json?access_token=" + gcp_access_token 
    patient_body = {
        "localId":_id,
        "first_name":first_name,
        "last_name":last_name,
        "phone_num":phone,
        "emergency_contact_name":e_name,
        "emergency_contact_number":e_num
    }
    r = requests.post(patient_endpoint,data=json.dumps(patient_body))
    return r.json()

def get_todays_patients():
    result = []
    for patient in patients:
        visits = patient['visits']
        for visit in visits:
            try:
                checkIn = visit['checkInTime'].split()[0]
                now = datetime.datetime.now().strftime("%d/%m/%Y")
                if checkIn == now and not patient['visitSummary']:
                    result.append({patient:checkIn})
            except:
                return []
    return result

def get_patient_from_local(localId):
    patient_endpoint ="https://uoft-hacks-2f135.firebaseio.com/patients.json?access_token=" + gcp_access_token 
    all_patients = requests.get(patient_endpoint).json()
    for patient in all_patients:
        if all_patients[patient]['localId'] == localId:
            return patient

def find_earliest_visit(visits):
    #return visit id of most recent time
    recent_id = ""
    earliest_time = None
    for visit in visits:
        time = visit['checkInTime']
        if not earliest_time:
            recent_id = visit 
            earliest_time = time 
        else:
            if time > earliest_time:
                recent_id = visit 
                earliest_time = time
    return recent_id
#Routes
@app.route('/register',methods=['POST'])
def register_user():
    if request.method == 'POST':
        #User Auth
        email = request.form.get('email')
        password = request.form.get('password')

        #Patient Details
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        phone_num = request.form.get('phone_num')
        emergency_contact_name = request.form.get('emergency_contact_name')
        emergency_contact_number = request.form.get('emergency_contact_number')

        #Creating the user
        endpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + firebase
        registration_body = {
            'email':email,
            'password':password,
            'returnSecureToken':True
        }
        r = requests.post(endpoint,data=registration_body)
        if r.status_code == 200:
            localId = r.json()['localId']
            patient = create_patient(localId,first_name,last_name,phone_num,emergency_contact_name,emergency_contact_number)
            if patient:
                return Response(json.dumps({"Message":"Successfully Created User","patientId":patient['name']}), status=200, mimetype='application/json')
            else:
                print(patient)
    return "Something went wrong"

@app.route('/login',methods=['POST'])
def login():
    if request.method == 'POST':
        #Login Details
        email = request.form.get('email')
        password = request.form.get('password')

        #Authenticate User
        endpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + firebase
        login_body = {
            'email':email,
            'password':password,
            'returnSecureToken':True
        }
        r = requests.post(endpoint,data=login_body)
        if r.status_code == 200:
            localId = r.json()['localId']
            patient_id = get_patient_from_local(localId)
            response = {"Message":"Successful Sign In","patientId":patient_id}
            return Response(json.dumps(response), status=200, mimetype='application/json')
        return Response("{'Message':'Invalid Credentials'}", status=404, mimetype='application/json')
    return Response("{'Message':'Invalid Credentials'}", status=404, mimetype='application/json')

@app.route('/doctor-visit/<profile_id>',methods=['POST'])
def create_visit(profile_id):
    #Query Param: profileID
    endpoint = "https://uoft-hacks-2f135.firebaseio.com/patients/" + profile_id +  "/visits.json?access_token=" + gcp_access_token 
    visit_body = {
        "checkInTime":datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    }

    #Add visit
    r = requests.post(endpoint,data=json.dumps(visit_body))
    if r.status_code == 200:
        print(r.json())
        return Response(json.dumps({'Message':'Successfully created visit','visitId':r.json()['name']}), status=200, mimetype='application/json')
    return Response("{'Message':'Invalid Credentials'}", status=404, mimetype='application/json')

@app.route('/add-response/<profile_id>/<visit_id>',methods=['POST'])
def add_response(profile_id,visit_id):
    #Get prompt
    prompt_num = request.form.get('prompt_num')

    #Get message
    message = request.form.get('message')

    #Set prompt
    prompt = "prompt_{}".format(prompt_num)

    #Set body
    body = {
        prompt:message
    }

    #Add message
    endpoint = "https://uoft-hacks-2f135.firebaseio.com/patients/" + profile_id +  "/visits/" + visit_id + ".json?access_token=" + gcp_access_token 
    r = requests.patch(endpoint,data=json.dumps(body))
    if r.status_code == 200:
        return Response("{'Message':'Successfully added response'}", status=200, mimetype='application/json')
    return Response("{'Message':'Invalid Credentials'}", status=404, mimetype='application/json')


@app.route('/patient/<patient_id>',methods=['GET'])
def patient_details(patient_id):
    endpoint = "https://uoft-hacks-2f135.firebaseio.com/patients/" + patient_id + ".json?access_token=" + gcp_access_token 
    r = requests.get(endpoint)
    if r.status_code == 200:
        print(r.json())
        return Response(json.dumps(r.json()),status=200,mimetype='application/json')

@app.route('/visit-details/<patient_id>/<visit_id>',methods=['GET'])
def visit_details(patient_id,visit_id):
    endpoint = "https://uoft-hacks-2f135.firebaseio.com/patients/" + patient_id +  "/visits/" + visit_id + ".json?access_token=" + gcp_access_token 
    r = requests.get(endpoint)
    return Response(json.dumps(r.json()),status=200,mimetype='application/json')

@app.route('/queue-position/<patient_id>',methods=['GET'])
def find_pos_in_que(patient_id):
    #Queue = users with date visited == today, ordering = earliest to latest
    todays_patients = get_todays_patients()
    queue = sorted(todays_patients.items(), key=lambda x: x[1])
    pos = 0
    for patient in queue:
        if queue[0] == patient_id:
            return Response(json.dumps({"Position":pos}))
        pos += 1
    return Response(json.dumps({"Message":"Something went wrong"}))

@app.route('/recent-visitor',methods=['GET'])
def get_recent_visitor():
    #Return the patient id, and visit id of the most recently checked in patient
    todays_patients = get_todays_patients()
    queue = sorted(todays_patients.items(), key=lambda x: x[1])
    print(queue)
    return Response(json.dumps({"Message":"Hello"}))
    # recent_visitor = {}
    # patient_endpoint ="https://uoft-hacks-2f135.firebaseio.com/patients.json?access_token=" + gcp_access_token 
    # all_patients = requests.get(patient_endpoint).json()
    # for patient in all_patients:
    #     visits = all_patients[patient]['visits']
    #     earliest_visit = find_earliest_visit(visits)
    #     if not recent_visitor:
    #         recent_visitor = {"patientId":patient,"visitId":earliest_visit}
    #     else:
    #         current_recent_visit = recent_visitor['visitId']
    #         if get_time(earliest_visit) > get_time(current_recent_visit):
    #             recent_visitor = {"patientId":patient,"visitId":earliest_visit}
    # return Response(json.dumps(recent_visitor),status=200,mimetype='application/json')
