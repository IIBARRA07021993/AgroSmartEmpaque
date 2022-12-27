import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList } from '@ionic/angular';
import { Bandas } from 'src/app/interfaces/interfaces';
import { ArmadopaletService } from 'src/app/services/armadopalet.service';
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
    private ultilService: UtilService,
    private armadopal: ArmadopaletService,
    private router: Router,
    public alertController: AlertController
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
        c_codigo_tem: environment.c_codigo_tem,
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

  async fn_accionbanda(banda: Bandas) {
    await this.fn_valida_parar_banda(banda).then(async (resolve) => {
      if (resolve) {
        await this.fn_parar_banda(banda).then((resolve) => {
          if (resolve) {
            this.getBandas();
          }
        });
      }
    });
    await this.listabandas.closeSlidingItems();
  }

  fn_valida_parar_banda(banda: Bandas) {
    return new Promise((resolve) => {
      var json = {
        c_codigo_tem: environment.c_codigo_tem,
        c_codigo_emp: environment.c_codigo_emp,
        c_codigo_bnd: banda.c_codigo_bnd,
        v_pc_bnd: environment.terminal_app,
      };

      console.log(JSON.stringify(json));

      this.armadopal
        .sp_AppControlEstiba(
          '/ControlEstiba?as_empresa=' +
            environment.codempresa +
            '&as_operation=1&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            var arrayresp = resp.split('|');
            if (arrayresp.length > 0) {
              if (arrayresp[0] == '1') {
                resolve(true);
              } else {
                this.ultilService.presentToastok(
                  'Atención!',
                  arrayresp[1],
                  1500,
                  'warning-outline',
                  'warning'
                );
                resolve(false);
              }
            } else {
              this.ultilService.presentToast(
                'Error!',
                'Ocurrio un error Interno.',
                1000,
                'warning-outline',
                'danger'
              );
              resolve(false);
            }
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

  fn_parar_banda(banda: Bandas) {
    return new Promise((resolve) => {
      var json = {
        c_codigo_tem: environment.c_codigo_tem,
        c_codigo_emp: environment.c_codigo_emp,
        c_codigo_bnd: banda.c_codigo_bnd,
        c_codigo_sel: banda.c_codigo_sel,
        c_codigo_prq: banda.c_codigo_prq,
        c_codigo_usu: environment.usuario_login,
      };

      console.log(JSON.stringify(banda));

      this.armadopal
        .sp_AppControlEstiba_Put(
          '/ControlEstiba?as_empresa=' +
            environment.codempresa +
            '&as_operation=2&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            var arrayresp = resp.split('|');
            if (arrayresp.length > 0) {
              if (arrayresp[0] == '1') {
                this.ultilService.presentToastok(
                  'Atención!',
                  arrayresp[1],
                  5000,
                  'checkmark-done-outline',
                  'success'
                );
                resolve(true);
              } else {
                this.ultilService.presentToast(
                  'Error!',
                  arrayresp[1],
                  1500,
                  'warning-outline',
                  'danger'
                );

                resolve(false);
              }
            } else {
              this.ultilService.presentToast(
                'Error!',
                'Ocurrio un error Interno.',
                1500,
                'warning-outline',
                'danger'
              );
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
              'danger'
            );
            resolve(false);
          }
        );
    });
  }

  fn_newpal(banda: Bandas) {
    this.router.navigate(['/paletvirtual'], { queryParams: banda });
  }


  async Confirmar_Parar_Banda(banda: Bandas) {
    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'custom-alert',
      header: '¿DESEA PARAR ESTA BANDA?',
      subHeader: 'Programa Empaque #: ' + banda.c_codigo_prq,
      message: 'Banda: ' + banda.c_codigo_bnd + ' - ' + banda.v_nombre_bnd + 
              ' <br/><br/>Estiba de Proceso: ' + banda.c_codigo_sel + 
              ' <br/><br/>Lote: ' + banda.c_codigo_lot + ' - ' + banda.v_nombre_lot + 
              ' <br/><br/>Cultivo: ' + banda.c_codigo_cul + ' - ' + banda.v_nombre_cul + 
              " <br/><br/>NOTA: Se dejará libre la banda para signarle una nueva Estiba de Proceso.",
     

      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: async () => {
            await this.listabandas.closeSlidingItems();
          },
        },
        {
          text: 'Si',
          role: 'confirm',
          handler: async () => {
            await this.fn_accionbanda(banda);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log(`Dismissed with role: ${role}`);
  }
}
