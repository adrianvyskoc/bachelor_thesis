import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(
    private http: HttpClient,
  ) { }

  getStatistics(year: string, duration: string): Observable<any[]> {
    const reqData = {
      rokNastup: year,
      rokObdobia: year,
      duration: duration,
    };
    return this.http.post<any[]>(`${environment.apiUrl}/api/statistics`, reqData)
  }

  getYearDatesStart(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.apiUrl}/api/statistics/year`)
  }

  getYearDatesDelete(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${environment.apiUrl}/api/statistics/yearForDelete`)
  }

  deleteStatisticsYear(year: string): Observable<Array<any>> {
    const reqData = {
      year: year
    };
    return this.http.post<any>(`${environment.apiUrl}/api/statistics/delete`, reqData)
  }

}
