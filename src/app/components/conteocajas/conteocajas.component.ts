import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AlertController, IonInput, ModalController } from '@ionic/angular';
import { CajaConteo } from 'src/app/interfaces/interfaces';
import { ArmadopaletService } from 'src/app/services/armadopalet.service';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-conteocajas',
  templateUrl: './conteocajas.component.html',
  styleUrls: ['./conteocajas.component.scss'],
})
export class ConteocajasComponent implements OnInit {
  @Input() argumentos: any;
  @ViewChild('inputidcaja', { static: false }) inputidcaja!: IonInput;
  cajasconteo: CajaConteo[] = [];

  constructor(
    private modalController: ModalController,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService,
    private armadopal: ArmadopaletService,
    private barcodeScanner: BarcodeScanner,
    public alertController: AlertController
  ) {}

  async ionViewWillEnter() {
    await this.ultilService.showLoading('Cargando Cajas...');
    await this.GetConteoCajasTemp();
    await this.ultilService.loading.dismiss();
    this.inputidcaja.setFocus();
  }

  ngOnInit() {
    console.log(this.argumentos);
  }

  async scanner() {
    await this.barcodeScanner
      .scan()
      .then(async (barcodeData) => {
        console.log(barcodeData.text);
        if (barcodeData.text !== '') {
          this.inputidcaja.value = barcodeData.text;
          this.GuardarCajaTemp(this.inputidcaja.value);
        } else {
          this.inputidcaja.setFocus();
        }
      })
      .catch((err) => {
        console.log('Error', err);
        alert(JSON.stringify(err));
      });
  }

  cerrar() {
    console.log(this.cajasconteo.length);
    this.modalController.dismiss(this.cajasconteo.length);
  }

  GuardarCajaTemp(idcaja: any) {
    console.log(idcaja);

    return new Promise(async (resolve) => {
      var json = {
        c_codigo_tem: environment.c_codigo_tem,
        c_codigo_emp: environment.c_codigo_emp,
        c_terminal_ccp: environment.terminal_app,
        c_idcaja_ccp: idcaja,
        n_bulxpa_ccp: 1,
        c_codigo_usu: environment.usuario_login,
      };

      console.log(JSON.stringify(json));

      this.armadopal
        .sp_AppControlEstiba_Put(
          '/ControlEstiba?as_empresa=' +
            environment.codempresa +
            '&as_operation=6&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            var arrayresp = resp.split('|');
            if (arrayresp.length > 0) {
              if (arrayresp[0] == '1') {
                this.GetConteoCajasTemp();
                this.ultilService.presentToast(
                  'Agregada',
                  arrayresp[1],
                  500,
                  'checkmark-done-outline',
                  'success',
                  'bien',
                  true
                );
                this.inputidcaja.value = '';
                this.inputidcaja.setFocus();
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
                this.inputidcaja.value = '';
                this.inputidcaja.setFocus();
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
            this.inputidcaja.value = '';
            this.inputidcaja.setFocus();
            resolve(false);
          }
        );
    });
  }

  EliminarCajas(idcaja: any) {
    console.log(idcaja);

    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        mode: 'ios',
        cssClass: 'custom-alert',
        header: '¿DESEA ELIMINAR CAJAS DEL CONTEO?',
        subHeader: 'Eliminar cajas Conteo',
        message:
          'Se eliminarían las cajas según la opción de eliminación seleccionada del conteo que lleva la terminal.',

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
                c_idcaja_ccp: idcaja,
              };

              console.log(JSON.stringify(json));

              this.armadopal
                .sp_AppControlEstiba_Put(
                  '/ControlEstiba?as_empresa=' +
                    environment.codempresa +
                    '&as_operation=7&as_json=' +
                    JSON.stringify(json)
                )
                .subscribe(
                  (resp: string) => {
                    var arrayresp = resp.split('|');
                    if (arrayresp.length > 0) {
                      if (arrayresp[0] == '1') {
                        this.GetConteoCajasTemp();
                        this.ultilService.presentToast(
                          'Eliminado',
                          arrayresp[1],
                          1500,
                          'checkmark-done-outline',
                          'danger',
                          'bien',
                          true
                        );
                        this.inputidcaja.value = '';
                        this.inputidcaja.setFocus();
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

  GetConteoCajasTemp() {
    return new Promise((resolve) => {
      var json = {
        c_terminal_ccp: environment.terminal_app,
        c_codigo_emp: environment.c_codigo_emp,
      };

      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=18&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.cajasconteo = JSON.parse(resp);
            console.log(this.cajasconteo);
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
}
