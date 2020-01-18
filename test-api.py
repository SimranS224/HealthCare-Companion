import requests
import json
# registration_body = {
#     "email":"test18@test.com",
#     "password":"test123",
#     "first_name":"moiz",
#     "last_num":"blahmed",
#     "phone_num":"4168540289",
#     "emergency_contact_name":"Lisa",
#     "emergency_contact_number":"2938383"
# }
# endpoint = "http://localhost:5000/register"
# r = requests.post(endpoint,data=registration_body)
# print(r.content)

# login_body = {
#     'email':"test1@test.com",
#     'password':"test123",
# }
# endpoint = "http://localhost:5000/login"
# r = requests.post(endpoint,data=login_body)
# print(r.status_code)

# endpoint = "http://localhost:5000/doctor-visit/-LyrMD1NZpOBifyANjIm"
# r = requests.post(endpoint,data={})
# print(r.content)

endpoint = "http://localhost:5000/patient/-LyrMD1NZpOBifyANjIm"
r = requests.get(endpoint)
print(r.content)