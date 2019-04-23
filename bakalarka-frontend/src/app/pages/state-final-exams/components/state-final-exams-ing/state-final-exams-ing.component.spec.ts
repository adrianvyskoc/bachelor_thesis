import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateFinalExamsIngComponent } from './state-final-exams-ing.component';

describe('StateFinalExamsIngComponent', () => {
  let component: StateFinalExamsIngComponent;
  let fixture: ComponentFixture<StateFinalExamsIngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateFinalExamsIngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateFinalExamsIngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
