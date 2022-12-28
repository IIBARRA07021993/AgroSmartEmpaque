import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EyeProducto } from 'src/app/models/producto.model';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buscarproductos',
  templateUrl: './buscarproductos.component.html',
  styleUrls: ['./buscarproductos.component.scss'],
})
export class BuscarproductosComponent implements OnInit {
  producto: EyeProducto;
  productos: EyeProducto[] = [];
  texto_filtro: string = '';

  constructor(
    private modalController: ModalController,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService
  ) {}

  async ionViewWillEnter() {
    await this.ultilService.showLoading('Cargando Productos...');
    await this.buscarProducto();
    await this.ultilService.loading.dismiss();
  }

  ngOnInit() {}

  fn_filtro(evento: any) {
    console.log(evento);
    this.texto_filtro = evento.detail.value;
  }

  cerrar() {
    this.modalController.dismiss(this.producto);
  }

  seleccionarProducto(producto: EyeProducto) {
    console.log('Producto Seleccionado');
    console.log(producto);
    this.producto = producto;
    this.cerrar();
  }

  buscarProducto() {
    return new Promise((resolve) => {
      var json = { c_codigo_pro : '%%'};

      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=14&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.productos = JSON.parse(resp);
            console.log(this.productos);
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
    await this.buscarProducto()
    console.log('buscarProducto');
    await event.target.complete();
    console.log('event.target.complete');
  }

}
