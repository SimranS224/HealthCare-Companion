import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private router:Router) { }
  patientId = '';
  visitId = '';
  position = -1;

  public createAccount() {
    console.log("An account has been created");
    return true;
  }

  public addResponses(intro,urgency,treatment,medication){
    let endpoint = `http://medexpress-265520.appspot.com/add-response/${this.patientId}/${this.visitId}`
    let prompt_1 = {
      reason: intro,
    }

    let prompt_2 = {
      urgency: urgency,
    }


    let prompt_3 = {
      treatment: treatment,
    }

    let prompt_4 = {
      medication:medication
    }

    this.http.post(endpoint,prompt_1).subscribe(data=>{console.log('Added prompt 1')})
    this.http.post(endpoint,prompt_2).subscribe(data=>{console.log('Added prompt 2')})
    this.http.post(endpoint,prompt_3).subscribe(data=>{console.log('Added prompt 3')})
    this.http.post(endpoint,prompt_4).subscribe(data=>{console.log('Added prompt 4')})
    this.router.navigate(['/queue'])



  }

  public checkIn(){
    let endpoint = `https://medexpress-265520.appspot.com/doctor-visit/${this.patientId}`
    this.http.post(endpoint,{}).subscribe(
      data=>{
        this.visitId = data['visitId']
        this.getPosition(this.patientId)
        this.router.navigate(['/checkin'])
      }
    )
  }

  public getPosition(patientId){
    let endpoint = `https://medexpress-265520.appspot.com/queue-position/${patientId}`
    this.http.get(endpoint).subscribe(
      data=>{
        this.position = data['Position']
        console.log(this.position)
      }
    )
  }
  public login(email,password){
    console.log(`logging in, ${email}, ${password}`)
    let endpoint = 'https://medexpress-265520.appspot.com/login'
    let body = {
      email:email,
      password:password
    }
    console.log(body);
    this.http.post(endpoint,JSON.parse(JSON.stringify(body))).subscribe(
      data => {
        this.patientId = data['patientId']
        this.router.navigate(['/actions'])
        
      }
    )
  }
}
