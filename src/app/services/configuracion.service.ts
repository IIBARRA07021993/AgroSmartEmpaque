import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Temporadas } from '../interfaces/interfaces';
import { GetdatosService } from './getdatos.service';
import { SqliteService } from './sqlite.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {

temporadas : Temporadas [] = [] ;

  constructor(private sqliteServ: SqliteService, 
     private ultilService: UtilService,
     private getdatoserv: GetdatosService,) {}

  async fn_crear_appconfig() {
    let sql_configapp =
      'CREATE TABLE IF NOT EXISTS appconfig(' +
      'v_url_api_app varchar (200)  NULL,' +
      'v_terminal_app varchar (200)  NULL,'+
      'c_codigo_emp varchar(2)  NULL )';

    await this.sqliteServ.storage
      .executeSql(sql_configapp, [])
      .then(() => console.log('Executed SQL :' + sql_configapp))
      .catch((e) => {

        this.ultilService.presentToast(
          'Error SQLite!',
          'Ocurrio un error Interno.',
          1500,
          'warning-outline',
          'danger'
        );
        console.log('Error 1 :' + JSON.stringify(e));
      });
  } 

  async fn_save_appconfig(configSer) {
    let sqlcad =
      'INSERT INTO appconfig(v_url_api_app, v_terminal_app , c_codigo_emp) VALUES(?,?,?)';
    await this.sqliteServ.storage
      .executeSql(sqlcad, [configSer.url_api_app, configSer.terminal_app , configSer.c_codigo_emp ])
      .then(async (data) => {
        this.getappconfig();
        console.log('Executed SQL :' + sqlcad);
      })
      .catch((e) => {
        this.ultilService.presentToast(
          'Error SQLite88!',
          'Ocurrio un error Interno.',
          1500,
          'warning-outline',
          'danger'
        );
        console.log('Error 2 :' + JSON.stringify(e));
      });
  }

  async getappconfig() {
    let sqlcad = 'select * from appconfig';
    await this.sqliteServ.storage
      .executeSql(sqlcad, [])
      .then((resp) => {
        console.log('Executed SQL :' + sqlcad);
        console.log(resp.rows.length);
        if (resp.rows.length > 0) {
          environment.url_api_app = resp.rows.item(0).v_url_api_app;
          environment.terminal_app = resp.rows.item(0).v_terminal_app;
          environment.c_codigo_emp = resp.rows.item(0).c_codigo_emp;
          console.log(environment.url_api_app);
          console.log(environment.terminal_app);
          console.log(environment.c_codigo_emp);
        }
      })
      .catch((e) => {
        this.ultilService.presentToast(
          'Error SQLite!',
          'Ocurrio un error Interno.',
          1500,
          'warning-outline',
          'danger'
        );

        console.log('Error 3:' + JSON.stringify(e));
      });
     
  }


  getTemporada( as_tem  : string, as_activo : string) {
    return new Promise((resolve) => {

      var json = {
        c_codigo_tem: as_tem,
        c_activo_tem: as_activo,
      };

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=8&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.temporadas   = JSON.parse(resp);
            environment.c_codigo_tem =  this.temporadas[0].c_codigo_tem
            console.log( environment.c_codigo_tem  );
            resolve(true);
          },
          (error) => {
            console.error(JSON.stringify(error));
            this.ultilService.presentToast(
              'Error!',
              'Ocurrio un error Interno.',
              500,
              'warning-outline',
              'danger'
            );
            resolve(false);
          }
        );
    });
  }



}
