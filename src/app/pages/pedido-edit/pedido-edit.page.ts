import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { AlertController, IonInput } from '@ionic/angular';
import { Pedidosdet, Pellet } from 'src/app/interfaces/interfaces';
import { ControlpedidoService } from 'src/app/services/controlpedido.service';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { MenuService } from 'src/app/services/menu.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pedido-edit',
  templateUrl: './pedido-edit.page.html',
  styleUrls: ['./pedido-edit.page.scss'],
})
export class PedidoEditPage implements OnInit {
  @ViewChild('codpal', { static: false }) codpal!: IonInput;

  pedido = {
    c_codigo_tem: '',
    c_codigo_emp: '',
    c_codigo_pdo: '',
    v_nombre_dis: '',
  };

  pedidos_det: Pedidosdet[] = [];
  codigo: string = '';
  pallet: Pellet[] = [];
  precentacion_add: string[] = [];

  lb_exedercajas = false;
  lb_agregarpresentacion = false;
  constructor(
    private getdatoserv: GetdatosService,
    private ultilService: UtilService,
    private barcodeScanner: BarcodeScanner,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private keyboard: Keyboard,
    private ControlpedidoService: ControlpedidoService,
    private menuserv: MenuService
  ) {}

  async ionViewWillEnter() {
    console.log('ionViewWillEnter');
    await this.GetParametros();
    await this.ultilService.showLoading('Cargando detalle..');
    await this.GetDetallePedido();
    await this.ultilService.loading.dismiss();
    await this.codpal.setFocus();
  }

  ngOnInit() {}

  GetParametros() {
    return new Promise(async (resolve) => {
      this.pedido.c_codigo_tem =
        this.activatedRoute.snapshot.paramMap.get('tem');
      this.pedido.c_codigo_emp =
        this.activatedRoute.snapshot.paramMap.get('emp');
      this.pedido.c_codigo_pdo =
        this.activatedRoute.snapshot.paramMap.get('ped');
      this.pedido.v_nombre_dis =
        this.activatedRoute.snapshot.paramMap.get('dis');
      resolve(true);
    });
  }

  GoPalletsPedidos(det: Pedidosdet) {
    let ls_precentacion =
      det.c_codigo_pro.trim() +
      det.c_codigo_eti.trim() +
      det.c_codigo_col.trim();
    console.log(ls_precentacion);

    if (det.n_pallets_emp > 0) {
      this.router.navigateByUrl(
        'pedido-pal/' +
          this.pedido.c_codigo_tem.trim() +
          '/' +
          this.pedido.c_codigo_emp.trim() +
          '/' +
          this.pedido.c_codigo_pdo.trim() +
          '/' +
          ls_precentacion.trim()
      );
    } else {
      this.ultilService.presentToast(
        'Atención',
        'No hay pallets surtidos para esta presentación.',
        1500,
        'warning-outline',
        'warning',
        'alerta',
        true
      );
    }
  }

  async enterkey() {
    if (this.pedidos_det[0].c_estatus_pdo == '3') {
      this.codigo = '';
      this.codpal.setFocus();
      this.ultilService.AlertaOK(
        'Atención ',
        'Pedido Surtido! ',
        'El pedido se encuentra surtido, Para agregar más pallets es necesario cambiar el estatus a surtiendo.',
        'OK',
        'alerta',
        true
      );
    } else {
      console.log('paso 1');
      await this.ultilService.showLoading('Valiando Pallet...');
      console.log('showLoading');
      await this.ProcesarPallet('1');
      console.log('paso 3');
      await this.ultilService.loading.dismiss();
      console.log('dismiss');
    }
  }

  ProcesarPallet(Operacion: string) {
    return new Promise(async (resolve) => {
      var json = {
        c_codigo_tem: this.pedido.c_codigo_tem,
        c_codigo_emp: this.pedido.c_codigo_emp,
        c_codigo_pal: this.codigo,
        c_codigo_pdo: this.pedido.c_codigo_pdo,
      };

      console.log(json);
      console.log(JSON.stringify(json));
      this.ControlpedidoService.sp_Appcontrolpedido(
        '/ControlPedidos?as_empresa=' +
          environment.codempresa +
          '&as_operation=' +
          Operacion +
          '&as_json=' +
          JSON.stringify(json)
      ).subscribe(
        (resp: string) => {
          console.log(resp);
          var arrayresp = resp.split('|');
          console.log(arrayresp);

          if (arrayresp.length > 0) {
            if (arrayresp[0] == '1') {
              this.ultilService.presentToastok(
                'Pallet Agregado!',
                arrayresp[1],
                2500,
                'checkmark-outline',
                'success',
                'bien',
                true
              );

              this.GetDetallePedido();

              this.codigo = '';
              this.codpal.setFocus();
              resolve(true);
            } else {
              switch (arrayresp[0]) {
                case '2':
                  this.codigo = '';
                  this.codpal.setFocus();
                  this.ultilService.AlertaOK(
                    'Atención ',
                    'Pallet No Existe! ',
                    arrayresp[1],
                    'OK',
                    'alerta',
                    true
                  );
                  break;
                case '3':
                  this.codigo = '';
                  this.codpal.setFocus();
                  this.ultilService.AlertaOK(
                    'Atención ',
                    'Pallet Con Pedido!',
                    arrayresp[1],
                    'OK',
                    'alerta',
                    true
                  );
                  break;
                case '4':
                  if (this.lb_exedercajas) {
                    this.Alerta_exedecajas();
                  } else {
                    this.codigo = '';
                    this.codpal.setFocus();
                    this.ultilService.AlertaOK(
                      'Atención ',
                      'Excedió cajas!',
                      arrayresp[1],
                      'OK',
                      'alerta',
                      true
                    );
                  }

                  break;
                case '5':
                  if (this.lb_agregarpresentacion) {
                    this.Alerta_Presentacion();
                  } else {
                    this.codigo = '';
                    this.codpal.setFocus();
                    this.ultilService.AlertaOK(
                      'Atención ',
                      'Otra Presentación!',
                      arrayresp[1],
                      'OK',
                      'alerta',
                      true
                    );
                  }

                  break;
                default:
                  this.codigo = '';
                  this.codpal.setFocus();
                  this.ultilService.AlertaOK(
                    'Atención ',
                    'Error!',
                    arrayresp[1],
                    'OK',
                    'error',
                    true
                  );
                  break;
              }

              resolve(true);
            }
          } else {
            this.codigo = '';
            this.codpal.setFocus();
            this.ultilService.presentToast(
              'Error!',
              'No hay datos de respuesta del API',
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
          this.codigo = '';
          this.codpal.setFocus();
          this.ultilService.presentToast(
            'Error!',
            'Ocurrio un error en la Peticion al API',
            1500,
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

  async fn_scanner() {
    await this.barcodeScanner
      .scan()
      .then(async (barcodeData) => {
        if (barcodeData.text !== '') {
          this.codigo = barcodeData.text;
          console.log('Barcode data', barcodeData);
          await this.enterkey();
        }
      })
      .catch((err) => {
        console.log('Error', err);
        alert(JSON.stringify(err));
      });
  }

  GetDetallePedido() {
    return new Promise((resolve) => {
      var json = {
        c_codigo_pdo: this.pedido.c_codigo_pdo,
        c_codigo_tem: this.pedido.c_codigo_tem,
        c_codigo_emp: this.pedido.c_codigo_emp,
      };

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=4&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.pedidos_det = JSON.parse(resp);
            console.log(this.pedidos_det);
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

  async Alerta_exedecajas() {
    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'custom-alert',
      header: 'Atención',
      subHeader: 'Pedido : ' + this.pedido.c_codigo_pdo,
      message:
        'Al agregar este pallet se excedería las cajas solicitadas. ¿Desea agregar el pallet?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.codigo = '';
            this.codpal.setFocus();
            console.log('No Agregar pallet');
          },
        },
        {
          text: 'Si',
          role: 'confirm',
          handler: async () => {
            console.log('paso 1');
            await this.ultilService.showLoading('Valiando Pallet...');
            console.log('showLoading');
            await this.ProcesarPallet('2');
            console.log('paso 3');
            await this.ultilService.loading.dismiss();
            console.log('dismiss');
            console.log('Agregar Presentacion');
            console.log('Agregar pallet');
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log(`Dismissed with role: ${role}`);
  }

  async Alerta_Presentacion() {
    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'custom-alert',
      header: 'Atención',
      subHeader: 'Pedido : ' + this.pedido.c_codigo_pdo,
      message:
        'Existen Presentación en el Pallet que no están en el pedido. ¿Desea agregar al pedido esta presentación?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.codigo = '';
            this.codpal.setFocus();
            console.log('No Agregar Presentacion');
          },
        },
        {
          text: 'Si',
          role: 'confirm',
          handler: async () => {
            console.log('paso 1');
            await this.ultilService.showLoading('Valiando Pallet...');
            console.log('showLoading');
            await this.ProcesarPallet('3');
            console.log('paso 3');
            await this.ultilService.loading.dismiss();
            console.log('dismiss');
            console.log('Agregar Presentacion');
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log(`Dismissed with role: ${role}`);
  }

  async GetPermisos() {
    /*lb_exedercajas = false 
      lb_agregarpresentacion  = false */
    await this.menuserv
      .GetPermisoEspeciales('70', '0198')
      .then((resolve: boolean) => {
        this.lb_exedercajas = resolve;
      })
      .catch((error) => {
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
        this.lb_exedercajas = false;
      });

    await this.menuserv
      .GetPermisoEspeciales('70', '0197')
      .then((resolve: boolean) => {
        this.lb_agregarpresentacion = resolve;
      })
      .catch((error) => {
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
        this.lb_agregarpresentacion = false;
      });
  }
}
