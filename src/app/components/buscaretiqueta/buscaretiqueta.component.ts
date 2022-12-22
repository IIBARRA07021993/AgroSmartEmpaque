import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EyeEtiqueta } from 'src/app/models/etiqueta.model';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buscaretiqueta',
  templateUrl: './buscaretiqueta.component.html',
  styleUrls: ['./buscaretiqueta.component.scss'],
})
export class BuscaretiquetaComponent implements OnInit {
  etiqueta: EyeEtiqueta;
  etiquetas: EyeEtiqueta[] = [];
  texto_filtro :string = '' ;
  constructor(private modalController: ModalController,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService) { }

    async ionViewWillEnter() {
      await this.ultilService.showLoading('Cargando Etiquetas...');
      await this.buscarEtiqueta();
      await this.ultilService.loading.dismiss();
    }
  
  ngOnInit() {

  }

  fn_filtro(evento: any) {
    console.log(evento);
    this.texto_filtro = evento.detail.value;
  }

  cerrar() {
    this.modalController.dismiss(this.etiqueta);
  }

  seleccionarEtiqueta(etiqueta: EyeEtiqueta) {
    console.log('Etiqueta Seleccionado');
    console.log(etiqueta);
    this.etiqueta = etiqueta;
    this.cerrar();
  }


  buscarEtiqueta( ) {
    return new Promise((resolve) => {
      var json = { c_codigo_eti : '%%'};

      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=15&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.etiquetas = JSON.parse(resp);
            console.log(this.etiquetas);
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
