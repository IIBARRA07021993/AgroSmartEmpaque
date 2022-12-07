import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx'
import { AlertController, IonInput } from '@ionic/angular';
import { Pedidosdet, Pellet } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';


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
    v_nombre_dis: ''
  }


  pedidos_det: Pedidosdet[] = [];
  codigo: string = '';
  pallet: Pellet[] = [];
  precentacion_add: string[] = [];


  constructor(
    private apiserv: ApiService,
    private ultilService: UtilService,
    private barcodeScanner: BarcodeScanner,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private keyboard: Keyboard
  ) {



  }


  async ionViewWillEnter() {
    console.log('ionViewWillEnter');
    await this.fn_getPedidos_det(this.pedido.c_codigo_tem.trim()
      + this.pedido.c_codigo_emp.trim()
      + this.pedido.c_codigo_pdo.trim());
    await this.codpal.setFocus()

  }


  async ngOnInit() {
    console.log('ngOnInit');
    await this.f_get_parametros();
    console.log('f_get_parametros')
    await this.ultilService.showLoading('Cargando detalle..')
    await this.fn_getPedidos_det(this.pedido.c_codigo_tem.trim()
      + this.pedido.c_codigo_emp.trim()
      + this.pedido.c_codigo_pdo.trim());

    await this.ultilService.loading.dismiss();
    console.log('f_get_parametros')
    await this.codpal.setFocus()

  }

  f_get_parametros() {
    return new Promise(async (resolve) => {
      this.pedido.c_codigo_tem = this.activatedRoute.snapshot.paramMap.get('tem')
      this.pedido.c_codigo_emp = this.activatedRoute.snapshot.paramMap.get('emp')
      this.pedido.c_codigo_pdo = this.activatedRoute.snapshot.paramMap.get('ped')
      this.pedido.v_nombre_dis = this.activatedRoute.snapshot.paramMap.get('dis')
      resolve(true);

    })


  }
  fn_get_pallet_pededito_det(det: Pedidosdet) {
    let ls_precentacion = det.c_codigo_pro.trim() + det.c_codigo_eti.trim() + det.c_codigo_col.trim()
    console.log(ls_precentacion);

    if (det.n_pallets_emp > 0) {
      this.router.navigateByUrl(
        'pedido-pal/'
        + this.pedido.c_codigo_tem.trim() + '/'
        + this.pedido.c_codigo_emp.trim() + '/'
        + this.pedido.c_codigo_pdo.trim() + '/'
        + ls_precentacion.trim()

      );
    } else {



      this.ultilService.presentToast(
        'Atención',
        'No hay pallets surtidos para esta presentación.',
        1500,
        'warning-outline',
        'warning');



    }



  }

  async enterkey() {


    if (this.pedidos_det[0].c_estatus_pdo == '3') {
      this.codigo = ""
      this.codpal.setFocus()
      this.ultilService.AlertaOK('Atención ', 'Pedido Surtido! ',
                                  'El pedido se encuentra surtido, Para agregar más pallets es necesario cambiar el estatus a surtiendo.', 'OK')
    } else {


      console.log('paso 1')
      await this.ultilService.showLoading('Valiando Pallet...')
      console.log('showLoading');
      await this.fn_usp_control_pedidos_app('1')
      console.log('paso 3')
      await this.ultilService.loading.dismiss();
      console.log('dismiss');
    }
  }


  fn_usp_control_pedidos_app(Operacion: string) {
    return new Promise(async (resolve) => {
      var json = {
        c_codigo_tem: this.pedido.c_codigo_tem,
        c_codigo_emp: this.pedido.c_codigo_emp,
        c_codigo_pal: this.codigo,
        c_codigo_pdo: this.pedido.c_codigo_pdo
      }


      console.log(json)
      console.log(JSON.stringify(json))
      this.apiserv.StoredProcedureput(
        'usp_control_pedidos_app?as_operation=' + Operacion + '&as_json=' + JSON.stringify(json)
      ).subscribe((resp: string) => {

        console.log(resp)
        var arrayresp = resp.split('|');
        console.log(arrayresp);

        if (arrayresp.length > 0) {

          if (arrayresp[0] == '1') {

            this.ultilService.presentToastok(
              'Pallet Agregado!',
              arrayresp[1],
              2500,
              'checkmark-outline',
              'success');

            this.fn_getPedidos_det(this.pedido.c_codigo_tem.trim()
              + this.pedido.c_codigo_emp.trim()
              + this.pedido.c_codigo_pdo.trim());

            this.codigo = ""
            this.codpal.setFocus()
            resolve(true);
          } else {
            switch (arrayresp[0]) {
              case '2':
                this.codigo = ""
                this.codpal.setFocus()
                this.ultilService.AlertaOK('Atención ', 'Pallet No Existe! ', arrayresp[1], 'OK')
                break;
              case '3':
                this.codigo = ""
                this.codpal.setFocus()
                this.ultilService.AlertaOK('Atención ', 'Pallet Con Pedido!', arrayresp[1], 'OK')
                break;
              case '4':
                this.Alerta_exedecajas();
                break;
              case '5':
                this.Alerta_Presentacion();
                break;
              default:
                this.codigo = ""
                this.codpal.setFocus()
                this.ultilService.AlertaOK('Atención ', 'Error!', arrayresp[1], 'OK')
                break;
            }

            resolve(true);
          }

        } else {
          this.codigo = ""
          this.codpal.setFocus()
          this.ultilService.presentToast(
            'Error!',
            'No hay datos de respuesta del API',
            1500,
            'warning-outline',
            'danger');

          resolve(false);
        }

      }, (error) => {

        console.error(JSON.stringify(error))
        this.codigo = ""
        this.codpal.setFocus()
        this.ultilService.presentToast(
          'Error!',
          'Ocurrio un error en la Peticion al API',
          1500,
          'warning-outline',
          'danger');

        resolve(false)

      })

    })


  }



  async fn_scanner() {

    await this.barcodeScanner.scan().then(async barcodeData => {
      this.codigo = barcodeData.text
      console.log('Barcode data', barcodeData);
      await this.enterkey()
    }).catch(err => {
      console.log('Error', err);
      alert(JSON.stringify(err));
    });

  }


  fn_getPedidos_det(id: string) {
    return new Promise((resolve) => {
      this.pedidos_det = [];
      this.apiserv.getapi('v_pedidosappdet/' + id).subscribe((resp: Pedidosdet[]) => {
        if (resp.length > 0) {
          resp.forEach(element => {
            this.pedidos_det.push(element)
          });
          console.log(this.pedidos_det);
        }
        resolve(true)



      }, (error) => {

        console.error(JSON.stringify(error))
        this.ultilService.presentToast(
          'Error',
          'Ocurrio un error en la Peticion al API',
          1500,
          'warning-outline',
          'danger');
        resolve(false)

      }
      )
    })

  }



  async Alerta_exedecajas() {
    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'custom-alert',
      header: 'Atención',
      subHeader: 'Pedido : ' + this.pedido.c_codigo_pdo,
      message: 'Al agregar este pallet se excedería las cajas solicitadas. ¿Desea agregar el pallet?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.codigo = ""
            this.codpal.setFocus()
            console.log('No Agregar pallet');
          },
        },
        {
          text: 'Si',
          role: 'confirm',
          handler: async () => {
            console.log('paso 1')
            await this.ultilService.showLoading('Valiando Pallet...')
            console.log('showLoading');
            await this.fn_usp_control_pedidos_app('2')
            console.log('paso 3')
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
      message: 'Existen Presentación en el Pallet que no están en el pedido. ¿Desea agregar al pedido esta presentación?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.codigo = ""
            this.codpal.setFocus()
            console.log('No Agregar Presentacion');
          },
        },
        {
          text: 'Si',
          role: 'confirm',
          handler: async () => {

            console.log('paso 1')
            await this.ultilService.showLoading('Valiando Pallet...')
            console.log('showLoading');
            await this.fn_usp_control_pedidos_app('3')
            console.log('paso 3')
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



}


