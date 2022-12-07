import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ConfiguracionService } from './services/configuracion.service';
import { SqliteService } from './services/sqlite.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

 
  constructor(private platform: Platform,
              private sqliteServices:SqliteService,
              private configServ: ConfiguracionService
              ) {



  }  
  
  async ngOnInit() {
    if ( await this.platform.ready()){
        console.log('App OK');
        await this.sqliteServices.fn_crear_db();
        await this.configServ.fn_crear_appconfig();
    } ;


  }



}
