import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EyeColor } from 'src/app/models/color.model';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buscarcolor',
  templateUrl: './buscarcolor.component.html',
  styleUrls: ['./buscarcolor.component.scss'],
})
export class BuscarcolorComponent implements OnInit {
  color: EyeColor;
  colores: EyeColor[] = [];

  texto_filtro: string = '';
  constructor(
    private modalController: ModalController,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService
  ) {}

  async ionViewWillEnter() {
    await this.ultilService.showLoading('Cargando Colores...');
    await this.buscarColor();
    await this.ultilService.loading.dismiss();
  }

  ngOnInit() {}

  fn_filtro(evento: any) {
    console.log(evento);
    this.texto_filtro = evento.detail.value;
  }

  cerrar() {
    this.modalController.dismiss(this.color);
  }

  seleccionarColor(color: EyeColor) {
    console.log('Color Seleccionado');
    console.log(color);
    this.color = color;
    this.cerrar();
  }

  buscarColor() {
    return new Promise((resolve) => {
      var json = { c_codigo_col : '%%'};

      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=16&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.colores = JSON.parse(resp);
            console.log(this.colores);
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
    await this.buscarColor()
    console.log('buscarColor');
    await event.target.complete();
    console.log('event.target.complete');
  }

}
