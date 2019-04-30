import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { DataService } from 'src/app/shared/data.service';

const YEAR_MOCK = "2007-2008"

const ADMISSIONS_MOCK = [
  {
    "id":152769,"AIS_ID":96649,"school_id":605786,"created_at":"2019-04-29T14:28:20.000Z","updated_at":"2019-04-29T14:28:20.000Z","stupen_studia":"Bakalársky"
  },
  {
    "id":153484,"AIS_ID":96650,"school_id":null,"created_at":null,"updated_at":null,"stupen_studia":"Bakalársky"
  }
]

const TABLES_MOCK = [
  {
    attrs: [
      "kod_kodsko",
      "created_at",
      "updated_at"
    ],
    years: []
  }
]


describe('DataService', () => {
  let service: DataService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        DataService
      ]
    })

    service = TestBed.get(DataService)
    httpMock = TestBed.get(HttpTestingController)
  });

  it('should return correct admission', () => {
    service.getAdmission(1).subscribe((admission) => {
      expect(admission).toEqual(ADMISSIONS_MOCK[0])
    })

    const req = httpMock.expectOne(`http://localhost:3333/api/getAdmission/1`, 'call for admission');
    expect(req.request.method).toBe('GET');

    req.flush(ADMISSIONS_MOCK[0])
    httpMock.verify()
  })

  it('should return correct admissions', () => {
    service.getData('Admissions')
    service.getAdmissionsUpdateListener()
      .subscribe(data => {
        expect(data).toEqual(ADMISSIONS_MOCK)
      })

    const req = httpMock.expectOne(`http://localhost:3333/api/getAdmissions/all`, 'call for admissions')
    expect(req.request.method).toBe('GET')

    req.flush(ADMISSIONS_MOCK)
    httpMock.verify()
  })

  it('should return correct table columns', () => {
    service.getAttrNames('ineko_schools').subscribe((data: any) => {
      expect(data).toEqual(TABLES_MOCK)
    })

    const req = httpMock.expectOne(`http://localhost:3333/api/tableColumns?tableName=ineko_schools`, 'call for table columns')
    expect(req.request.method).toBe('GET')

    req.flush(TABLES_MOCK)
    httpMock.verify()
 })

 it('year should be set correctly', () => {
   expect(service.getYear().value).toEqual('all')
   service.setYear(YEAR_MOCK)
   expect(service.getYear().value).toEqual(YEAR_MOCK)
 })
})
