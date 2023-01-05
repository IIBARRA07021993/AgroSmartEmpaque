import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonList,
  ModalController,
} from '@ionic/angular';
import { EyePalletVirtual } from 'src/app/models/palletvir.model';
import { ArmadopaletService } from 'src/app/services/armadopalet.service';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buscarpallet',
  templateUrl: './buscarpallet.component.html',
  styleUrls: ['./buscarpallet.component.scss'],
})
export class BuscarpalletComponent implements OnInit {
  @ViewChild('listapallets') listabandas: IonList;
  pallet: EyePalletVirtual;
  pallets: EyePalletVirtual[] = [];
  texto_filtro: string = '';
  ls_confirmado: string = 'N';

  constructor(
    private modalController: ModalController,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService,
    private actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private armadopal: ArmadopaletService
  ) {}

  async ionViewWillEnter() {
    await this.ultilService.showLoading('Cargando Pallet...');
    await this.buscarPalletvirtual();
    await this.ultilService.loading.dismiss();
  }

  ngOnInit() {}

  async ConfirmarEliminar(pallet: EyePalletVirtual) {
    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'custom-alert',
      header: '¿DESEA ELIMINAR EL PALLET TEMPORAL?',
      subHeader: 'Pallet #: ' + pallet.c_codigo_pal + '-' + pallet.c_codsec_pal,
      message:
        'Se eliminarán los registros ligados al pallet temporal [' +
        pallet.c_codigo_pal +
        '-' +
        pallet.c_codsec_pal +
        ']',

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
            await this.listabandas.closeSlidingItems();
            await this.Eliminarpallet(pallet);
            await this.buscarPalletvirtual();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log(`Dismissed with role: ${role}`);
  }

  Eliminarpallet(pallet: EyePalletVirtual) {
    return new Promise((resolve) => {
      var json = {
        c_codigo_tem: pallet.c_codigo_tem,
        c_codigo_emp: pallet.c_codigo_emp,
        c_terminal_ccp: pallet.c_terminal_pme,
        c_codigo: pallet.c_codigo,
        c_codsec_pal: pallet.c_codsec_pal,
      };

      console.log(JSON.stringify(pallet));

      this.armadopal
        .sp_AppControlEstiba_Put(
          '/ControlEstiba?as_empresa=' +
            environment.codempresa +
            '&as_operation=8&as_json=' +
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
                  'success',
                  'bien',
                  true
                );
                resolve(true);
              } else {
                this.ultilService.presentToast(
                  'Error!',
                  arrayresp[1],
                  1500,
                  'warning-outline',
                  'danger',
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
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      header: 'Estatus del Pallet',
      subHeader: 'Seleccione un Estatus',
      buttons: [
        {
          text: 'Pendiente',
          icon: 'copy-outline',
          cssClass: 'pendiente',
          data: 'N',
          handler: () => {
            console.log('Pendiente clicked');
          },
        },
        {
          text: 'Confirmados',
          icon: 'duplicate-outline',
          cssClass: 'surtiendo',
          data: 'S',
          handler: () => {
            console.log('Confirmados clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { data } = await actionSheet.onDidDismiss();
    console.log('estatus = ' + data);
    this.ls_confirmado = data;
    await this.buscarPalletvirtual();
    console.log('buscarPalletvirtual');
  }

  fn_filtro(evento: any) {
    console.log(evento);
    this.texto_filtro = evento.detail.value;
  }

  cerrar() {
    this.modalController.dismiss(this.pallet);
  }

  seleccionarPallet(pallet: EyePalletVirtual) {
    console.log('Pallet Seleccionado');
    console.log(pallet);
    if (pallet.c_codigo_pal == '') {
      this.pallet = pallet;
      this.cerrar();
    } else {
      this.ultilService.AlertaOK(
        'Pallet Confirmado',
        '',
        'El Código de Pallet [' +
          this.pallet.c_codigo +
          '] ya fue confirmado como pallet final.',
        'OK',
        '',
        false
      );
    }
  }

  buscarPalletvirtual() {
    return new Promise((resolve) => {
      var json = {
        c_codigo_tem: environment.c_codigo_tem,
        c_codigo_emp: environment.c_codigo_emp,
        c_codigo_pal: '%%',
        c_codsec_pal: '%%',
        c_tipo: this.ls_confirmado,
      };
      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=17&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.pallets = JSON.parse(resp);
            console.log(this.pallets);
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

  async doRefresh(event: any) {
    console.log(event);
    await this.buscarPalletvirtual();
    console.log('buscarPalletvirtual');
    await event.target.complete();
    console.log('event.target.complete');
  }
}
