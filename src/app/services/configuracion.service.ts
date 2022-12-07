import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SqliteService } from './sqlite.service';


@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(private sqliteServ: SqliteService

  ) { }


  async fn_crear_appconfig() {
    let sql_configapp = "CREATE TABLE IF NOT EXISTS appconfig(" +
      "v_url_api_app varchar (200)  NULL," +
      "v_terminal_app varchar (200)  NULL)"

    await this.sqliteServ.storage.executeSql(sql_configapp, [])
      .then(() => console.log('Executed SQL :' + sql_configapp))
      .catch((e) => {
        alert('Error 1 :' + JSON.stringify(e));
        console.log('Error 1 :' + JSON.stringify(e))
      });
  }


  async fn_save_appconfig(configSer) {

    let sqlcad = 'INSERT INTO appconfig (v_url_api_app, v_terminal_app) VALUES(?,?)'
    await this.sqliteServ.storage.executeSql(sqlcad, [configSer.url_api_app, configSer.terminal_app])
      .then(async (data) => {
        this.getappconfig();
        console.log('Executed SQL :' + sqlcad)
      }).catch((e) => {
        alert('Error 2 :' + JSON.stringify(e));
        console.log('Error 2 :' + JSON.stringify(e))
      });
  }


  async getappconfig() {
    let sqlcad = 'select * from appconfig'
    await this.sqliteServ.storage.executeSql(sqlcad, [])
      .then((resp) => {
        console.log('Executed SQL :' + sqlcad)
        console.log(resp.rows.length);
        if (resp.rows.length > 0) {
          environment.url_api_app = resp.rows.item(0).v_url_api_app
          environment.terminal_app = resp.rows.item(0).v_terminal_app
          console.log(environment.url_api_app);
          console.log(environment.terminal_app);

        }
      }).catch((e) => {
        alert('Error 3:' + JSON.stringify(e));
        console.log('Error 3:' + JSON.stringify(e))

      });
  }







}



