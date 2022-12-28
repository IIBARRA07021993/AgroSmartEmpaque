import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EyePalletVirtual } from 'src/app/models/palletvir.model';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buscarpallet',
  templateUrl: './buscarpallet.component.html',
  styleUrls: ['./buscarpallet.component.scss'],
})
export class BuscarpalletComponent implements OnInit {
  pallet: EyePalletVirtual;
  pallets: EyePalletVirtual[] = [];
  texto_filtro: string = '';

  constructor(
    private modalController: ModalController,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService
  ) {}

  async ionViewWillEnter() {
    await this.ultilService.showLoading('Cargando Pallet...');
    await this.buscarPalletvirtual();
    await this.ultilService.loading.dismiss();
  }

  ngOnInit() {}

  fn_filtro(evento: any) {
    console.log(evento);
    this.texto_filtro = evento.detail.value;
  }

  cerrar() {
    this.modalController.dismiss(this.pallet);
  }

  seleccionarPallet(pallet: EyePalletVirtual) {
    console.log('Pallet Seleccionado');
    console.log(pallet);
    this.pallet = pallet;
    this.cerrar();
  }

  buscarPalletvirtual() {
    return new Promise((resolve) => {
      var json = {
        c_codigo_tem: environment.c_codigo_tem,
        c_codigo_emp: environment.c_codigo_emp,
        c_codigo_pal: '%%',
        c_codsec_pal: '%%',
      };
      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=17&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.pallets = JSON.parse(resp);
            console.log(this.pallets);
            resolve(true);
          },
          (error) => {
            console.error(JSON.stringify(error));
            this.ultilService.presentToast(
              'Error!',
              'Ocurrio un error Interno.',
              500,
              'warning-outline',
              'danger','error' , true
            );
            resolve(false);
          }
        );
    });
  }

  async doRefresh(event) {
    console.log(event);
    await this.buscarPalletvirtual();
    console.log('buscarPalletvirtual');
    await event.target.complete();
    console.log('event.target.complete');
  }
}
