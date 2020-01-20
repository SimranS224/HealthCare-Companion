import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  constructor(public interactionService:AuthService) { }

  ngOnInit() {
  }

  checkIn(){
    this.interactionService.checkIn();
  }
}
