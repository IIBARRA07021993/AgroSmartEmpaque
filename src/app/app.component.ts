import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ConfiguracionService } from './services/configuracion.service';
import { SqliteService } from './services/sqlite.service';
import { UtilService } from 'src/app/services/util.service';
import { UsuloginService } from './services/usulogin.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

 
  constructor(private platform: Platform,
              private sqliteServices:SqliteService,
              private configServ: ConfiguracionService,
              private ultilService: UtilService,
              private usuloginService: UsuloginService
              ) {



  }  
  
  async ngOnInit() {
    if ( await this.platform.ready()){
        console.log('App OK');
        await this.sqliteServices.fn_crear_db();
        await this.configServ.fn_crear_appconfig();
        await this.ultilService.cargarsonidos();
        await this.usuloginService.fn_crear_appusulogin();
        //await this.usuloginService.getappusulogin();
    } ;


  }



}
