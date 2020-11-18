import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Country} from '../common/country';
import {map} from 'rxjs/operators';
import {State} from '../common/state';



@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) {
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    return this.httpClient.get<GetResponseStates>(`${this.statesUrl}/search/findByCountryCode?code=${countryCode}`).pipe(
      map(response => response._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    let currentYear = new Date().getFullYear();
    for (let tempYear = currentYear; tempYear < currentYear + 10; tempYear++) {
      data.push(tempYear);
    }

    return of(data);
  }

}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

