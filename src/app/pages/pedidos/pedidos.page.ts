import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, IonList, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import { PedidoEditPage } from '../pedido-edit/pedido-edit.page';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  @ViewChild('listasliding') listapedido: IonList

  pedidos: Observable<any>
  ls_estatus: string;
  titulo: string = ''
  icono: string = ''
  texto_filtro: string = ''
  usuario_login: string
  lb_godetalle: boolean = true


  constructor(private router: Router,
    private apiserv: ApiService,
    private activatedRoute: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    public alertController: AlertController,
    private ultilService: UtilService,
  ) { }

  async ionViewWillEnter() {
    console.log('ionViewWillEnter');
    await this.getPedidos()

  }


  async ngOnInit() {
    console.log('ngOnInit');
    this.usuario_login = environment.usuario_login
    this.ls_estatus = this.activatedRoute.snapshot.paramMap.get('id');


  }

  async getPedidos() {
    return new Promise((resolve) => {
      this.setTitulo();
      this.pedidos = this.apiserv.getapi('v_pedidosapp')
      resolve(true)
    })
  }

  async doRefresh(event) {

    console.log(event);
    await this.getPedidos();
    console.log('getPedidos');
    await event.target.complete();
    console.log('event.target.complete');

  }

  setTitulo() {

    switch (this.ls_estatus) {
      case '1':
        this.titulo = 'Pendientes'
        this.icono = 'copy-outline'
        break;
      case '2':
        this.titulo = 'Surtiendo'
        this.icono = 'duplicate-outline'
        break;
      case '3':
        this.titulo = 'Surtido'
        this.icono = 'checkmark-done-outline'
        break;
      default:
        this.titulo = 'Pendientes'
        this.icono = 'copy-outline'
        break;
    }
  }


  async fn_estatus_surtido_ped(pedido: any) {
    this.lb_godetalle = false
    this.listapedido.closeSlidingItems()
    console.log('sliding');
    if (this.ls_estatus =='1' || this.ls_estatus =='2') {
      await this.Alerta_update_estatus(pedido , '3')
    }else{
      await this.Alerta_update_estatus(pedido , '2');
    }
  
  }

  fn_surtir_ped(pedido: any) {
    console.log(pedido);
    if (this.lb_godetalle) {
        this.router.navigateByUrl(
          'pedido-edit/'
          + pedido.c_codigo_tem + '/'
          + pedido.c_codigo_emp + '/'
          + pedido.c_codigo_pdo + '/'
          + pedido.v_nombre_dis
        );
    } else {
      this.lb_godetalle = true
    }
  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      header: 'Estatus Pedido',
      subHeader: 'Seleccione un Estatus',
      buttons: [{
        text: 'Pendiente',
        icon: 'copy-outline',
        cssClass: 'pendiente',
        data: '1',
        handler: () => {
          console.log('Pendiente clicked');
        }
      }, {
        text: 'Surtiendo',
        icon: 'duplicate-outline',
        cssClass: 'surtiendo',
        data: '2',
        handler: () => {
          console.log('Surtiendo clicked');
        }
      }, {
        text: 'Surtido',
        icon: 'checkmark-done-outline',
        cssClass: 'surtido',
        data: '3',
        handler: () => {
          console.log('Surtido clicked');
        }
      }]
    });
    await actionSheet.present();

    const { data } = await actionSheet.onDidDismiss();
    console.log('estatus = ' + data);
    this.ls_estatus = data
    await this.getPedidos();
    console.log('getPedidos');

  }

  fn_filtro_pedido(evento: any) {
    console.log(evento);
    this.texto_filtro = evento.detail.value;
  }


  async modal_pedido_edit(pedido: any) {
    console.log(pedido);
    const modal = await this.modalController.create({
      component: PedidoEditPage,
      componentProps: { pedido }
    });
    await modal.present();
    modal.onWillDismiss().then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    })



  }


  async Alerta_update_estatus(pedido: any , estatus_new :string ) {
    let msj =  ''
    if (this.ls_estatus =='1' || this.ls_estatus =='2') {
      msj = '¿Desea marcar el pedido como surtido?'
    } else {
      msj = '¿Desea marcar el pedido como surtiendo?'
    }

    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'custom-alert',
      header: 'Atención',
      subHeader: 'Pedido',
      message:  msj,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('No')
          },
        },
        {
          text: 'Si',
          role: 'confirm',
          handler: async () => {
            console.log('Si')
            await this.ultilService.showLoading('Actualizando estatus...')
            console.log('showLoading');
            await this.fn_update_estatus_ped(pedido , estatus_new );
            console.log('fn_update_estatus_ped')
            await this.ultilService.loading.dismiss();
            console.log('dismiss');
            await this.getPedidos();
            console.log('getPedidos');

          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log(`Dismissed with role: ${role}`);
  }



  fn_update_estatus_ped(pedido: any , estatus :string) {
    return new Promise(async (resolve) => {
      var json = {
        c_codigo_tem: pedido.c_codigo_tem,
        c_codigo_emp: pedido.c_codigo_emp,
        c_codigo_pdo: pedido.c_codigo_pdo,
        c_estatus_pdo: estatus
      }

      console.log(json)
      console.log(JSON.stringify(json))
      this.apiserv.StoredProcedureput('usp_control_pedidos_app?as_operation=5&as_json=' + JSON.stringify(json)
      ).subscribe((resp: string) => {
        console.log(resp)
        var arrayresp = resp.split('|');
        console.log(arrayresp);
        if (arrayresp.length > 0) {
          if (arrayresp[0] == '1') {
            this.ultilService.presentToastok(
              'Actualizado!',
              arrayresp[1],
              2500,
              'checkmark-outline',
              'success');
            resolve(true);
          } else {
            this.ultilService.presentToastok(
              'Error!',
              arrayresp[1],
              2500,
              'checkmark-outline',
              'success');
            resolve(false);
          }
        } else {

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
        this.ultilService.presentToast(
          'Error!',
          'Ocurrio un error en la Peticion al API',
          1500,
          'warning-outline',
          'danger');

        resolve(false)

      })





    }
    )

  }
}


