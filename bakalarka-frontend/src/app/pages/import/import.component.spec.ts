import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ImportComponent } from './import.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatButtonModule,
  MatRadioModule,
  MatListModule,
  MatTabsModule,
  MatSidenavModule,
  MatDividerModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSelectModule,
} from "@angular/material";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const ATTRS_MOCK = [
  "Hello world",
  "Meno a priezvisko",
  "  (Meno a   priezvisko)",
]

describe('ImportComponent', () => {
  let component: ImportComponent;
  let fixture: ComponentFixture<ImportComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatRadioModule,
        MatListModule,
        MatTabsModule,
        MatSidenavModule,
        MatDividerModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatSelectModule,

        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
      ],
      declarations: [ImportComponent]
    })


    fixture = TestBed.createComponent(ImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('click on source should reset form', () => {
    const onApplySpy = spyOn(component, 'resetForm');
    debugElement
        .query(By.css('.source mat-radio-button'))
        .nativeElement.click();
    expect(onApplySpy).toHaveBeenCalled();
  })

  it('should not be able to start import at the init od component', () => {
    let disabled = document.querySelector("button.btn-lg.float-right")['disabled']
    expect(component.disableImport).toBeTruthy()
    expect(disabled).toBeTruthy()
  })

  it('function _adjustKeys should return correctly adjusted keys', () => {
    let newAttrs = component._adjustKeys(ATTRS_MOCK)
    expect(newAttrs).toEqual([
      "Hello_world",
      "Meno_a_priezvisko",
      "Meno_a_priezvisko",
    ])
  })
})
