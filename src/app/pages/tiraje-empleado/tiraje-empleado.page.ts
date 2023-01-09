import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { BuscarempleadosComponent } from 'src/app/components/buscarempleados/buscarempleados.component';
import { TirajeEmpleado } from 'src/app/interfaces/interfaces';
import { NomEmpleado } from 'src/app/models/empleado.model';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-tiraje-empleado',
  templateUrl: './tiraje-empleado.page.html',
  styleUrls: ['./tiraje-empleado.page.scss'],
})
export class TirajeEmpleadoPage implements OnInit {
  @ViewChild('inputempleado', { static: false }) inputempleado!: IonInput;
  @ViewChild('inputfolioini', { static: false }) inputfolioini!: IonInput;
  @ViewChild('inputfoliofin', { static: false }) inputfoliofin!: IonInput;

  empleado: NomEmpleado = new NomEmpleado();
  empleados: NomEmpleado[] = [];

  tirajeempleado: TirajeEmpleado[] = [];

  c_empleado_cte: string = '';
  c_folioinicial_cte: string = '';
  c_foliofinal_cte: string = '';
  b_empleadoasignado: boolean = false;

  titulo: string = 'Control Tiraje';

  constructor(
    private modalController: ModalController,
    private ultilService: UtilService,
    private getdatoserv: GetdatosService
  ) {}

  async ionViewWillEnter() {
    this.inputfolioini.setFocus();
  }

  ngOnInit() {}

  TirajeEmpleadoSave() {
    console.log(this.c_empleado_cte);
    console.log(this.c_folioinicial_cte);
    console.log(this.c_foliofinal_cte);
  }

  async buscarEmpleado() {
    const modal = await this.modalController.create({
      component: BuscarempleadosComponent,
      componentProps: {
        c_codigo_emp: '%%',
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.empleado = dataReturned.data;
        this.c_empleado_cte = this.empleado.c_codigo_emp;
        this.inputempleado.value = this.empleado.c_codigo_emp;
        this.inputempleado.setFocus();
      }
    });
    return await modal.present();
  }

  async buscarEmpleadoPorCodigo(codigo: string) {
    this.c_empleado_cte = codigo.padStart(6, '0');
    console.log(this.c_empleado_cte);
    return new Promise((resolve) => {
      var json = { c_codigo_emp: this.c_empleado_cte };
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

            if (this.empleados.length > 0) {
              this.empleado = this.empleados[0];
              this.c_empleado_cte = this.empleado.c_codigo_emp;
              this.inputempleado.setFocus();
              resolve(true);
            } else {
              this.ultilService.presentToast(
                'ATENCION!',
                'El Código del Empleado [' +
                  this.c_empleado_cte +
                  '] NO existe o esta Inactivo en el catálogo.',
                1500,
                'warning-outline',
                'warning',
                'alerta',
                true
              );
              this.Limpiar(3);
              resolve(false);
            }
          },
          (error) => {
            console.error(JSON.stringify(error));
            this.ultilService.presentToast(
              'Error!',
              'Ocurrio un error Interno.',
              1500,
              'warning-outline',
              'danger',
              'error',
              true
            );
            this.Limpiar(3);
            resolve(false);
          }
        );
    });
  }

  async buscarFolio(codigo: string, tipo: number) {
    console.log(codigo);
    codigo = codigo.padStart(10, '0');
    console.log(codigo);
    if (tipo == 1) {
      this.c_folioinicial_cte = codigo;
    } else {
      this.c_foliofinal_cte = codigo;
    }

    return new Promise((resolve) => {
      var json = {
        c_codigo_tem: environment.c_codigo_tem,
        c_codigo_emp: environment.c_codigo_emp,
        c_codigo: codigo,
      };
      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=21&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.tirajeempleado = JSON.parse(resp);
            console.log(this.tirajeempleado);

            if (this.tirajeempleado.length > 0) {
              this.c_folioinicial_cte =
                this.tirajeempleado[0].c_folioinicial_emt;
              this.c_foliofinal_cte = this.tirajeempleado[0].c_foliofinal_emt;
              this.c_empleado_cte = this.tirajeempleado[0].c_empleado_emt;

              this.inputfolioini.disabled = true;
              this.inputfoliofin.disabled = true;

              if (this.c_empleado_cte !== '') {
                this.b_empleadoasignado = true;
                this.buscarEmpleadoPorCodigo(this.c_empleado_cte);
              } else {
                this.b_empleadoasignado = false;
              }
              this.inputempleado.setFocus();

              resolve(true);
            } else {
              this.inputfolioini.disabled = false;
              this.inputfoliofin.disabled = false;
              this.b_empleadoasignado = false;

              if (tipo == 1) {
                this.inputfoliofin.setFocus();
              } else {
                this.inputempleado.setFocus();
              }
              resolve(false);
            }
          },
          (error) => {
            console.error(JSON.stringify(error));
            this.ultilService.presentToast(
              'Error!',
              'Ocurrio un error Interno.',
              1500,
              'warning-outline',
              'danger',
              'error',
              true
            );
            if (tipo == 1) {
              this.c_folioinicial_cte = '';
            } else {
              this.c_foliofinal_cte = '';
            }
            resolve(false);
          }
        );
    });
  }

  Limpiar(tipo: number) {
    switch (tipo) {
      case 0:
        this.c_folioinicial_cte = '';
        this.c_foliofinal_cte = '';
        this.c_empleado_cte = '';
        this.empleado = new NomEmpleado();
        this.b_empleadoasignado = false;
        break;
      case 1:
        this.c_folioinicial_cte = '';
        break;
      case 2:
        this.c_foliofinal_cte = '';
        break;
      case 3:
        this.c_empleado_cte = '';
        this.empleado = new NomEmpleado();
        break;
      default:
        break;
    }
  }
}
