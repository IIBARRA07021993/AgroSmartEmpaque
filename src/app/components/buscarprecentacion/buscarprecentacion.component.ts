import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EyePresentacion } from 'src/app/models/presentacion.model';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buscarprecentacion',
  templateUrl: './buscarprecentacion.component.html',
  styleUrls: ['./buscarprecentacion.component.scss'],
})
export class BuscarprecentacionComponent implements OnInit {
  @Input() argumentos: any;
  presentacion: EyePresentacion;
  presentacions: EyePresentacion[] = [];

  constructor(
    private modalController: ModalController,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService
  ) {}

  ngOnInit() {
    console.log(this.argumentos);
    console.log(this.argumentos.c_codigo_sel);
    console.log(this.argumentos.c_codigo_bnd);
  }

  async ionViewWillEnter() {
    await this.ultilService.showLoading('Cargando Productos...');
    await this.buscarPresentacion();
    await this.ultilService.loading.dismiss();
  }

  cerrar() {
    this.modalController.dismiss(this.presentacion);
  }

  seleccionarPresentacion(presentacion: EyePresentacion) {
    console.log('Presentacion Seleccionado');
    console.log(presentacion);
    this.presentacion = presentacion;
    this.cerrar();
  }

  buscarPresentacion() {
    return new Promise((resolve) => {
      var json = {
        c_codigo_tem: environment.c_codigo_tem,
        c_codigo_emp: environment.c_codigo_emp,
        c_codigo_sel: this.argumentos.c_codigo_sel,
        c_codigo_bnd: this.argumentos.c_codigo_bnd,
      };

      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=19&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.presentacions = JSON.parse(resp);
            console.log(this.presentacions);
            resolve(true);
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

  async doRefresh(event) {
    console.log(event);
    await this.buscarPresentacion();
    await event.target.complete();
  }
}
