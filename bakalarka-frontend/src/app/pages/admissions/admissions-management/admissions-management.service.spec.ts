import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { AdmissionsManagementService } from './admissions-management.service';

const SURNAME_MOCK = 'Novák'
const ADMISSIONS_MOCK = [
  {
    "Por": 701,
    "Priezvisko": "Novák",
    "Meno": "Dávid",
    "Absolvovaná_VŠ": null,
    "Abs_VŠ_program_odbor_text": null,
    "Abs_VŠ_program_odbor": null,
    "Abs_VŠ": null,
    "Alt_pr_1": null,
    "Alt_pr_2": null,
    "Alternatívny_program_1": null,
    "Alternatívny_program_2": null,
    "Body_celkom": "28.40"
  },
  {
    "Por": 702,
    "Priezvisko": "Novák",
    "Meno": "Martin",
    "Absolvovaná_VŠ": null,
    "Abs_VŠ_program_odbor_text": null,
    "Abs_VŠ_program_odbor": null,
    "Abs_VŠ": null,
    "Alt_pr_1": null,
    "Alt_pr_2": null,
    "Alternatívny_program_1": null,
    "Alternatívny_program_2": null,
    "Body_celkom": "83.80"
  }
]

describe('AdmissionsManagementService', () => {
  let service: AdmissionsManagementService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AdmissionsManagementService
      ]
    })

    service = TestBed.get(AdmissionsManagementService)
    httpMock = TestBed.get(HttpTestingController)
  });

  it('should return correct admission for surname', () => {
    service.getAdmissionsByName(SURNAME_MOCK).subscribe((admissions: []) => {
      admissions.forEach((admission) => {
        expect(admission['Priezvisko']).toEqual(SURNAME_MOCK)
      })
    })

    const req = httpMock.expectOne(`http://localhost:3333/api/admissionsBySurname?surname=Novák`, 'call for admission by surname');
    expect(req.request.method).toBe('GET');

    req.flush(ADMISSIONS_MOCK)
    httpMock.verify()
  })
})
