import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';


import { MatTableModule, MatPaginatorModule, MatSortModule, MatTooltipModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdmissionsComponent } from './admissions.component';
import { ChartModule } from 'src/app/plugins/chart/chart.module';
import { MapModule } from 'src/app/plugins/map/map.module';
import { GeoChartModule } from 'src/app/plugins/geo-chart/geo-chart.module';

describe('AdmissionsComponent', () => {
  let component: AdmissionsComponent;
  let fixture: ComponentFixture<AdmissionsComponent>;
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
        ChartModule,
        MapModule,
        RouterTestingModule,
        GeoChartModule
      ],
      declarations: [AdmissionsComponent]
    })


    fixture = TestBed.createComponent(AdmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('click on button "Filtrovať" should emit filter function', () => {
    const onApplySpy = spyOn(component, 'onFilter');
    debugElement
        .query(By.css('.filterForm button'))
        .nativeElement.click();
    expect(onApplySpy).toHaveBeenCalled();
  })
})
