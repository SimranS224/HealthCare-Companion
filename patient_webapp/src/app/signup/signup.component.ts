import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { User } from '../shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    public user: User;
    firstname = '';
    lastname = '';
    phoneNumber = ''
    contactName = '';
    contactNumber = '';
    email = '';
    password = '';

    updateFirstName(value:string){
        this.firstname = value;
    }

    updateLastName(value:string){
        this.lastname = value;
    }

    updatePhoneNumber(value:string){
        this.phoneNumber = value;
    }

    updateContactName(value:string){
        this.contactName = value;
    }

    updateContactNumber(value:string){
        this.contactNumber = value; 
    }

    updateEmail(value:string){
        this.email = value;
    }
    
    updatePassword(value:string){
        this.password = value;
    }



    constructor(private http:HttpClient,private router:Router) {
        this.user = new User();
    }


    ngOnInit() {}

    registerUser(){
        let registration_body = {
            email:this.email,
            password:this.password,
            first_name:this.firstname,
            last_name:this.lastname,
            phone_num:this.phoneNumber,
            emergency_contact_name:this.contactName,
            emergency_contact_number:this.contactNumber,
        }

        let endpoint = "http://127.0.0.1:5000/register"
        this.http.post(endpoint,JSON.parse(JSON.stringify(registration_body))).subscribe(
            data =>{
                this.router.navigate(['/login'])
            }
        )
    }
}
