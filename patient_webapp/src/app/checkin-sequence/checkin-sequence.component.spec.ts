import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinSequenceComponent } from './checkin-sequence.component';

describe('CheckinSequenceComponent', () => {
  let component: CheckinSequenceComponent;
  let fixture: ComponentFixture<CheckinSequenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinSequenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
