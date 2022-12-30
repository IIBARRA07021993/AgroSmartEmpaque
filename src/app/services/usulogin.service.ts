import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SqliteService } from './sqlite.service';
import { UtilService } from './util.service';



@Injectable({
  providedIn: 'root',
})
export class UsuloginService {
  constructor(
    private sqliteServ: SqliteService,
    private ultilService: UtilService
  ) {}

  async fn_crear_appusulogin() {
    let sql_configapp =
      'CREATE TABLE IF NOT EXISTS appusulogin(' +
      'c_codigo_usu varchar (20)  NULL,'+
      'c_codigo_emp varchar (2)  NULL)';

    await this.sqliteServ.storage
      .executeSql(sql_configapp, [])
      .then(() => console.log('Executed SQL :' + sql_configapp))
      .catch((e) => {
        this.ultilService.presentToast(
          'Error SQLite!',
          'Ocurrio un error Interno.',
          1500,
          'warning-outline',
          'danger',
          'error',
          true
        );
        console.log('Error 1 :' + JSON.stringify(e));
      });
  }

  async fn_save_appusulogin(configSer) {
    let sqlcad = 'INSERT INTO appusulogin( c_codigo_usu, c_codigo_emp ) VALUES(?,?)';
    await this.sqliteServ.storage
      .executeSql(sqlcad, [configSer.c_codigo_usu,configSer.c_codigo_emp])
      .then(async (data) => {
        this.getappusulogin();
        console.log('Executed SQL :' + sqlcad);
      })
      .catch((e) => {
        this.ultilService.presentToast(
          'Error SQLite!',
          'Ocurrio un error Interno.',
          1500,
          'warning-outline',
          'danger',
          'error',
          true
        );
        console.log('Error 2 :' + JSON.stringify(e));
      });
  }



  async getappusulogin() {
    let sqlcad = 'select * from appusulogin';
    await this.sqliteServ.storage
      .executeSql(sqlcad, [])
      .then((resp) => {
        console.log('Executed SQL :' + sqlcad);
        console.log(resp.rows.length);
        if (resp.rows.length > 0) {
          environment.usuario_login = resp.rows.item(0).c_codigo_usu;
          environment.codempresa = resp.rows.item(0).c_codigo_emp;
          console.log(environment.usuario_login);
          console.log(environment.codempresa);
        }
      })
      .catch((e) => {
        this.ultilService.presentToast(
          'Error SQLite!',
          'Ocurrio un error Interno.',
          1500,
          'warning-outline',
          'danger',
          'error',
          true
        );

        console.log('Error 3:' + JSON.stringify(e));
      });
  }
}
