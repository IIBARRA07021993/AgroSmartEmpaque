import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Device } from "@awesome-cordova-plugins/device/ngx";

import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { SqliteService } from 'src/app/services/sqlite.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.page.html',
  styleUrls: ['./configuraciones.page.scss'],
})
export class ConfiguracionesPage implements OnInit {


  configSer = {
    url_api_app: '',
    terminal_app: ''
  }

  constructor(
    private sqliteServ: SqliteService,
    private configServ: ConfiguracionService,
    private device: Device,
    public navCtrl: NavController
  ) { }

  async ngOnInit() {
    await this.configServ.getappconfig();

    this.configSer.url_api_app = environment.url_api_app
    this.configSer.terminal_app = environment.terminal_app
  }


  fn_cargar_modelo() {
    this.configSer.terminal_app = this.device.model
    environment.terminal_app = this.device.model
  }

  async of_save_appconfig() {
    console.log(this.configSer);
    await this.sqliteServ.fn_delete_table("appconfig");
    await this.configServ.fn_save_appconfig(this.configSer).then((data) => {
      this.navCtrl.pop();
    }).catch((e) => {
      console.log(e)
      alert(JSON.stringify(e))
      this.navCtrl.pop();

    });
  }



}
