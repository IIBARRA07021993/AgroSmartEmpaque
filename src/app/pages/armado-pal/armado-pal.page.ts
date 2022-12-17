import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';
import { Bandas } from 'src/app/interfaces/interfaces';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-armado-pal',
  templateUrl: './armado-pal.page.html',
  styleUrls: ['./armado-pal.page.scss'],
})
export class ArmadoPalPage implements OnInit {
  @ViewChild('listabandas') listabandas: IonList;
  bandas: Bandas[] = [];

  constructor(
    private getdatoserv: GetdatosService,
    private ultilService: UtilService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    console.log('ionViewWillEnter');
    await this.ultilService.showLoading('Cargando Bandas..');
    await this.getBandas();
    await this.ultilService.loading.dismiss();
  }

  getBandas() {
    return new Promise((resolve) => {

      var json = {
        c_codigo_tem:  environment.c_codigo_tem,
        c_codigo_emp: environment.c_codigo_emp,
      };

      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=10&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.bandas = JSON.parse(resp);
            console.log(this.bandas);
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

  async doRefresh(event) {
    console.log(event);
    await this.getBandas();
    console.log('getPedidos');
    await event.target.complete();
    console.log('event.target.complete');
  }

  fn_newpal() {}

  fn_accionbanda() {
    this.listabandas.closeSlidingItems();
  }




  
}
