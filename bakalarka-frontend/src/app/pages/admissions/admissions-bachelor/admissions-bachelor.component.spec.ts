import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';


import { MatTableModule, MatPaginatorModule, MatSortModule, MatTooltipModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdmissionsBachelorComponent } from './admissions-bachelor.component';
import { TimeChartModule } from 'src/app/plugins/time-chart/time-chart.module';
import { StatisticsTableComponent } from './components/statistics/statistics-table/statistics-table.component';

describe('AdmissionsBachelorComponent', () => {
  let component: AdmissionsBachelorComponent;
  let fixture: ComponentFixture<AdmissionsBachelorComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSelectModule,

        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        TimeChartModule,
      ],
      declarations: [AdmissionsBachelorComponent, StatisticsTableComponent]
    })


    fixture = TestBed.createComponent(AdmissionsBachelorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('click on button "Exportovať všetky tabuľky" should emit export function exportAllTables', () => {
    const onApplySpy = spyOn(component, 'exportAllTables');
    debugElement
        .query(By.css('.jumbotron button:nth-of-type(1)'))
        .nativeElement.click();
    expect(onApplySpy).toHaveBeenCalled();
  })

  it('click on button "Exportovať viditeľné údaje" should emit export function exportVisible', () => {
    const onApplySpy = spyOn(component, 'exportVisible');
    debugElement
        .query(By.css('.jumbotron button:nth-of-type(2)'))
        .nativeElement.click();
    expect(onApplySpy).toHaveBeenCalled();
  })

  it('click on button "Exportovať všetky údaje" should emit export function exportAll', () => {
    const onApplySpy = spyOn(component, 'exportAll');
    debugElement
        .query(By.css('.jumbotron button:nth-of-type(3)'))
        .nativeElement.click();
    expect(onApplySpy).toHaveBeenCalled();
  })

  it('click on button "Exportovať vyfiltrované údaje" should emit export function exportFiltered', () => {
    const onApplySpy = spyOn(component, 'exportFiltered');
    debugElement
        .query(By.css('.jumbotron button:nth-of-type(4)'))
        .nativeElement.click();
    expect(onApplySpy).toHaveBeenCalled();
  })
})
