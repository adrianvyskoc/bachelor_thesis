import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { AdmissionsFilterService } from './admissions-filter.service';

const GENDER_MOCKS = [{ Pohlavie: "žena" }, { Pohlavie: "muž" }, { Pohlavie: "muž" }, { Pohlavie: "žena" }, { Pohlavie: "muž" }, { Pohlavie: "muž" }]

const SCHOOL_TYPE_QUERY = 'gymnasium'
const SCHOOL_TYPE_MOCKS = [{ typ_skoly: 'Športové gymnázium' }, { typ_skoly: 'Gymnázium' }, { typ_skoly: 'Stredná odborná škola' }, { typ_skoly: 'Konzervatórium' }, { typ_skoly: 'Stredná odborná škola' }, { typ_skoly: 'Špeciálna škola' }]

const GRADUATION_QUERY = 2018
const GRADUATION_MOCKS = [{ Maturita_1: 2018 }, { Maturita_1: 2010 }, { Maturita_1: 2017 }, { Maturita_1: 2017 }, { Maturita_1: 2011 }, { Maturita_1: 2011 }, { Maturita_1: 2016 }, { Maturita_1: 2017 }, { Maturita_1: 2018 }]

let STUDY_TYPE_QUERY = "4"
const STUDY_TYPE_MOCKS = [{ Program_1: 'study-3' }, { Program_1: 'study-4' }, { Program_1: 'study-3' }, { Program_1: 'study-4' }, { Program_1: 'study-3' }, { Program_1: 'study-4' }, { Program_1: 'study-3' }, { Program_1: 'study-3' }]

const DEGREE_QUERY = 'Bakalársky'
const DEGREE_MOCKS = [{ stupen_studia: 'Inžiniersky' }, { stupen_studia: 'Bakalársky' }, { stupen_studia: 'Bakalársky' }, { stupen_studia: 'Inžiniersky' }, { stupen_studia: 'Bakalársky' }, { stupen_studia: 'Bakalársky' },{ stupen_studia: 'Inžiniersky' }]

const ABROAD_MOCKS = [{ Občianstvo: 'Slovenská republika' }, { Občianstvo: 'Afganistan' }, { Občianstvo: 'Poľská republika' }, { Občianstvo: 'Slovenská republika' }, { Občianstvo: 'Slovenská republika' }, { Občianstvo: 'Česká republika' }]


describe('AdmissionsFilterService', () => {
  let service: AdmissionsFilterService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AdmissionsFilterService
      ]
    })

    service = TestBed.get(AdmissionsFilterService)
  });

  it('filter by gender returns correct values', () => {
    const filtered = service.filterByGender(GENDER_MOCKS, "muž")
    expect(filtered.length).toBeLessThanOrEqual(GENDER_MOCKS.length)
    expect(filtered).toBeDefined()
    expect(filtered).toBeTruthy()

    filtered.every(item => expect(item.Pohlavie).toEqual("muž"))
  })

  it('filter by school type returns correct values', () => {
    const filtered = service.filterBySchoolType(SCHOOL_TYPE_MOCKS, SCHOOL_TYPE_QUERY)
    expect(filtered.length).toBeLessThanOrEqual(SCHOOL_TYPE_MOCKS.length)
    expect(filtered).toBeDefined()
    expect(filtered).toBeTruthy()

    if(SCHOOL_TYPE_QUERY == 'gymnasium')
      filtered.every(item => expect(['Gymnázium', 'Športové gymnázium'].indexOf(item.typ_skoly) > -1).toBeTruthy())
    else if(SCHOOL_TYPE_QUERY == 'technical')
      filtered.every(item => expect(item.typ_skoly).toEqual('Stredná odborná škola'))
    else if(SCHOOL_TYPE_QUERY == 'other')
      filtered.every(item => expect(['Gymnázium', 'Športové gymnázium', 'Stredná odborná škola'].indexOf(item.typ_skoly) == -1).toBeTruthy())
  })

  it('filter by graduation year returns correct values', () => {
    const filtered = service.filterByGraduationYear(GRADUATION_MOCKS, GRADUATION_QUERY)
    expect(filtered.length).toBeLessThanOrEqual(SCHOOL_TYPE_MOCKS.length)
    expect(filtered).toBeDefined()
    expect(filtered).toBeTruthy()

    filtered.every(item => expect(item.Maturita_1).toEqual(GRADUATION_QUERY))
  })

  it('filter by study type returns correct values', () => {
    const filtered = service.filterByStudyType(STUDY_TYPE_MOCKS, STUDY_TYPE_QUERY)
    expect(filtered.length).toBeLessThanOrEqual(STUDY_TYPE_MOCKS.length)
    expect(filtered).toBeDefined()
    expect(filtered).toBeTruthy()

    if(STUDY_TYPE_QUERY == "4")
      return filtered.filter(admission => expect(admission.Program_1[admission.Program_1.length - 1]).toEqual(STUDY_TYPE_QUERY))
    else if(STUDY_TYPE_QUERY == "2")
      return filtered.filter(admission => expect(admission.Program_1[admission.Program_1.length - 1]).toEqual(STUDY_TYPE_QUERY))
    else
      return filtered.filter(admission => expect(admission.Program_1[admission.Program_1.length - 1] != "2" && admission.Program_1[admission.Program_1.length - 1] != "4").toBeTruthy())
  })

  it('filter by degree returns correct values', () => {
    const filtered = service.filterByDegree(DEGREE_MOCKS, DEGREE_QUERY)
    expect(filtered.length).toBeLessThanOrEqual(DEGREE_MOCKS.length)
    expect(filtered).toBeDefined()
    expect(filtered).toBeTruthy()

    filtered.every(item => expect(item.stupen_studia).toEqual(DEGREE_QUERY))
  })

  it('filter abroad students returns correct values', () => {
    const filtered = service.filterAbroadStudents(ABROAD_MOCKS)
    expect(filtered.length).toBeLessThanOrEqual(ABROAD_MOCKS.length)
    expect(filtered).toBeDefined()
    expect(filtered).toBeTruthy()

    filtered.every(item => expect(item.Občianstvo).not.toEqual('Slovenská republika'))
  })
})
