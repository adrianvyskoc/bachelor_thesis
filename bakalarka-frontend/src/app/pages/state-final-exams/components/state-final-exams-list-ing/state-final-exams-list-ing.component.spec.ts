import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateFinalExamsListIngComponent } from './state-final-exams-list-ing.component';

describe('StateFinalExamsListIngComponent', () => {
  let component: StateFinalExamsListIngComponent;
  let fixture: ComponentFixture<StateFinalExamsListIngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateFinalExamsListIngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateFinalExamsListIngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
