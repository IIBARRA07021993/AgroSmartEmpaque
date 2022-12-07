import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';

import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  getapi(url) {
    const header = {
      headers: new HttpHeaders()
        .set('Basic', `${environment.api_token}`)
        .set('Access-Control-Allow-Origin', '*')
    }
    return this.http.get(environment.url_api_app + url, header)

      .pipe(

        catchError(err => {
          console.warn(JSON.stringify(err))
          return throwError(JSON.stringify(err))
        })
      )
  }

  StoredProcedureput(url: string) {
    const header = {
      headers: new HttpHeaders()
        .set('Basic', `${environment.api_token}`)
        .set('Access-Control-Allow-Origin', '*')
    }
    return this.http.put(environment.url_api_app + url, header)
      .pipe(
        catchError(err => {
          console.warn(JSON.stringify(err))
          return throwError(JSON.stringify(err))
        })
      );


  }

  StoredProcedureGET(url: string) {
    const header = {
      headers: new HttpHeaders()
        .set('Basic', `${environment.api_token}`)
        .set('Access-Control-Allow-Origin', '*')
    }
    return this.http.get(environment.url_api_app + url, header)
      .pipe(
        catchError(err => {
          console.warn(JSON.stringify(err))
          return throwError(JSON.stringify(err))
        })
      );


  }


  delete(id) {
    const header = {
      headers: new HttpHeaders()
        .set('Basic', `${environment.api_token}`)
        .set('Access-Control-Allow-Origin', '*')
    }

    return this.http.delete(environment.url_api_app + id, header);
  }

  post(url, body) {
    const header = {
      headers: new HttpHeaders()
        .set('Basic', `${environment.api_token}`)
        .set('Access-Control-Allow-Origin', '*')
        .set('Content-Type', 'application/json')
    }

    return this.http.post(environment.url_api_app + url, body, header);
  }


  put(url, id, body) {
    const header = {
      headers: new HttpHeaders()
        .set('Basic', `${environment.api_token}`)
        .set('Access-Control-Allow-Origin', '*')
        .set('Content-Type', 'application/json')
    }

    return this.http.put(environment.url_api_app + url + '/' + id, body, header);
  }

}
