import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SorteoService {

  constructor(private http: HttpClient) { }

  sp_AppSorteoProcesos(url: string) {
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
}
