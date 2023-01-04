import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OpcionesMenu } from '../interfaces/interfaces';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  permisosespeciales: OpcionesMenu[] = [];
  constructor(private http: HttpClient, private ultilService: UtilService) {}

  sp_AppOpcionesMenu(url: string) {
    const header = {
      headers: new HttpHeaders()
        .set('Basic', `${environment.api_token}`)
        .set('Access-Control-Allow-Origin', '*'),
    };
    return this.http.get(environment.url_api_app + url, header).pipe(
      catchError((err) => {
        console.warn(JSON.stringify(err));
        return throwError(JSON.stringify(err));
      })
    );
  }

  GetPermisoEspeciales(as_sistema: string, as_permiso: string) {
    return new Promise((resolve) => {
      var json = {
        c_codigo_usu: environment.usuario_login,
        c_codigo_sis: as_sistema,
        c_codigo_sme: as_permiso,
      };

      this.sp_AppOpcionesMenu(
        '/GetOpcionesMenu?as_empresa=' +
          environment.codempresa +
          '&as_operation=2&as_json=' +
          JSON.stringify(json)
      ).subscribe(
        (resp: string) => {
          console.log(resp);
          this.permisosespeciales = JSON.parse(resp);
          console.log(this.permisosespeciales.length);
          if (this.permisosespeciales.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => {
          console.error(JSON.stringify(error));
          this.ultilService.presentToast(
            'Error!',
            'Ocurrio un error Interno.',
            500,
            'warning-outline',
            'danger',
            'error',
            true
          );
          resolve(false);
        }
      );
    });
  }
}
