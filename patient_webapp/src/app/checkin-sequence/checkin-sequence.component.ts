import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-checkin-sequence',
  templateUrl: './checkin-sequence.component.html',
  styleUrls: ['./checkin-sequence.component.scss']
})
export class CheckinSequenceComponent implements OnInit {

  constructor(private interactionService:AuthService) { }
  intro = ''
  urgency = ''
  treatment = ''
  medication = ''
  prompt = 1;

  ngOnInit() {
  }

  updatePrompt(){
    this.prompt++;
  }

  updateIntro(value:string){
    this.intro = value
  }

  updateUrgency(value:string){
    this.urgency = value;
  }

  updateTreatment(value:string){
    this.treatment = value;
  }

  updateMedication(value:string){
    this.medication=value;
  }

  submitResponses(){
    this.interactionService.addResponses(this.intro,this.urgency,this.treatment,this.medication);
  }

}
