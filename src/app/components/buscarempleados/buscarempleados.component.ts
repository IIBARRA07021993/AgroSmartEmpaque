import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NomEmpleado } from 'src/app/models/empleado.model';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buscarempleados',
  templateUrl: './buscarempleados.component.html',
  styleUrls: ['./buscarempleados.component.scss'],
})
export class BuscarempleadosComponent implements OnInit {

  empleado: NomEmpleado;
  empleados: NomEmpleado[] = [];
  texto_filtro :string = '' ;

  constructor(private modalController: ModalController,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService) { }

  async ionViewWillEnter() {
    await this.ultilService.showLoading('Cargando Empleados...');
    await this.buscarEmpleados();
    await this.ultilService.loading.dismiss();
  }

  ngOnInit() {}

  fn_filtro(evento: any) {
    console.log(evento);
    this.texto_filtro = evento.detail.value;
  }

  cerrar() {
    this.modalController.dismiss(this.empleado);
  }

  seleccionarEmpleado(empleado: NomEmpleado) {
    console.log('Etiqueta Seleccionado');
    console.log(empleado);
    this.empleado = empleado;
    this.cerrar();
  }


  buscarEmpleados( ) {
    return new Promise((resolve) => {
      var json = { c_codigo_emp : '%%'};

      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=20&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.empleados = JSON.parse(resp);
            console.log(this.empleados);
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
    await this.buscarEmpleados()
    await event.target.complete();
  }


}
