import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    constructor(
      public router: Router,
      private _authService:AuthService
    ) {}
    email = ''
    password = ''

    updateEmail(value:string){
        this.email = value;
    }

    updatePassword(value:string){
        this.password=value;
    }

    ngOnInit() {}

    onLoggedin() {
        this._authService.login(this.email,this.password);
    }
}
