import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Palletpedido } from 'src/app/interfaces/interfaces';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { ControlpedidoService } from 'src/app/services/controlpedido.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pedido-pal',
  templateUrl: './pedido-pal.page.html',
  styleUrls: ['./pedido-pal.page.scss'],
})
export class PedidoPalPage implements OnInit {
  pedido = {
    c_codigo_tem: '',
    c_codigo_emp: '',
    c_codigo_pdo: '',
    c_codigo_pre: '',
  };
  titulo = 'Pallets';
  palletpedido: Palletpedido[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService,
    public alertController: AlertController,
    private ControlpedidoService: ControlpedidoService
  ) {}

  async ngOnInit() {
    console.log('ngOnInit');
    await this.f_get_parametros();
    console.log('f_get_parametros');
    await this.ultilService.showLoading('Cargando detalle..');
    await this.GetPalles_Det_Pedido();
    await this.ultilService.loading.dismiss();
  }

  f_get_parametros() {
    return new Promise(async (resolve) => {
      this.pedido.c_codigo_tem =
        this.activatedRoute.snapshot.paramMap.get('tem');
      this.pedido.c_codigo_emp =
        this.activatedRoute.snapshot.paramMap.get('emp');
      this.pedido.c_codigo_pdo =
        this.activatedRoute.snapshot.paramMap.get('ped');
      this.pedido.c_codigo_pre =
        this.activatedRoute.snapshot.paramMap.get('pre');
      resolve(true);
    });
  }

  GetPalles_Det_Pedido() {
    return new Promise((resolve) => {
      var json = {
        c_codigo_pdo: this.pedido.c_codigo_pdo,
        c_codigo_tem: this.pedido.c_codigo_tem,
        c_codigo_emp: this.pedido.c_codigo_emp,
        c_codigo_pre: this.pedido.c_codigo_pre,
      };

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=5&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.palletpedido = JSON.parse(resp);
            console.log(this.palletpedido);
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

  LiberarPallet(c_codigo_pal: string) {
    console.log(c_codigo_pal);

    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        mode: 'ios',
        cssClass: 'custom-alert',
        header: '¿DESEA LIBERAR EL PALLET?',
        subHeader: 'Liberar Pallet',
        message:
          'Se liberará el pallet del pedido y quedará disponible para ligarlo a otro pedido.',

        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: async () => {
              resolve(false);
            },
          },
          {
            text: 'Si',
            role: 'confirm',
            handler: async () => {
              var json = {
                c_codigo_tem: environment.c_codigo_tem,
                c_codigo_emp: environment.c_codigo_emp,
                c_terminal_ccp: environment.terminal_app,
                c_idcaja_ccp: c_codigo_pal,
              };

              console.log(JSON.stringify(json));

              this.ControlpedidoService.sp_Appcontrolpedido(
                '/ControlPedidos?as_empresa=' +
                  environment.codempresa +
                  '&as_operation=5&as_json=' +
                  JSON.stringify(json)
              ).subscribe(
                (resp: string) => {
                  var arrayresp = resp.split('|');
                  if (arrayresp.length > 0) {
                    if (arrayresp[0] == '1') {
                      this.GetPalles_Det_Pedido();
                      this.ultilService.presentToast(
                        'Liberado',
                        arrayresp[1],
                        1500,
                        'checkmark-done-outline',
                        'success',
                        'bien',
                        true
                      );

                      resolve(true);
                    } else {
                      this.ultilService.presentToastok(
                        'Atención!',
                        arrayresp[1],
                        1500,
                        'warning-outline',
                        'warning',
                        'alerta',
                        true
                      );
                      resolve(false);
                    }
                  } else {
                    this.ultilService.presentToast(
                      'Error!',
                      'Ocurrio un error Interno.',
                      1500,
                      'warning-outline',
                      'danger',
                      'error',
                      true
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
                    'danger',
                    'error',
                    true
                  );
                  resolve(false);
                }
              );
            },
          },
        ],
      });

      await alert.present();

      const { role } = await alert.onDidDismiss();
      console.log(`Dismissed with role: ${role}`);
    });
  }

  async doRefresh(event: any) {
    console.log(event);
    await this.GetPalles_Det_Pedido();
    console.log('getPedidos');
    await event.target.complete();
    console.log('event.target.complete');
  }
}
