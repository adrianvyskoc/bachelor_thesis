import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelImportComponent } from './model-import.component';

describe('ModelImportComponent', () => {
  let component: ModelImportComponent;
  let fixture: ComponentFixture<ModelImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
