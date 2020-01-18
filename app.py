from flask import Flask,Blueprint, flash, g, redirect, render_template, request, session, url_for, Response
import requests
import json
from credentials import firebase,gcp_access_token
import datetime
app = Flask(__name__)
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
    print(r.json())
    return True
    
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
                return "Successfully registered user"
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
            return Response("{'Message':'Successful Sign In'}", status=200, mimetype='application/json')
        return Response("{'Message':'Invalid Credentials'}", status=404, mimetype='application/json')
    return Response("{'Message':'Invalid Credentials'}", status=404, mimetype='application/json')

@app.route('/doctor-visit/<profile_id>',methods=['POST'])
def create_visit(profile_id):
    #Query Param: profileID
    endpoint = "https://uoft-hacks-2f135.firebaseio.com/patients/" + profile_id +  "/visits.json?access_token=" + gcp_access_token 
    visit_body = {
        "dateVisited":datetime.date.today().strftime("%d/%m/%Y")
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



    










