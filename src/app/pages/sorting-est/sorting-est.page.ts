import { Component, OnInit, ViewChild } from '@angular/core';
import { Areas, Cajas, Lotes } from 'src/app/interfaces/interfaces';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';
import { AlertController, IonInput } from '@ionic/angular';
import { SorteoService } from 'src/app/services/sorteo.service';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from '@awesome-cordova-plugins/barcode-scanner/ngx';
<<<<<<< HEAD
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
=======
import { ToastController } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7

@Component({
  selector: 'app-sorting-est',
  templateUrl: './sorting-est.page.html',
  styleUrls: ['./sorting-est.page.scss'],
})
export class SortingEstPage implements OnInit {
  titulo = 'Sorting Maduración(Estiba)';
  @ViewChild('kilogramos', { static: false }) kilogramos!: IonInput;
  public alertMode: any;
  public loopMode: any;
  constructor(
    private getdatos: GetdatosService,
    private ultilService: UtilService,
    private SorteoService: SorteoService,
    private alertController: AlertController,
    private barcodeScanner: BarcodeScanner,
<<<<<<< HEAD
    private Vibration: Vibration,
    private nativeAudio: NativeAudio
=======
    private toastController: ToastController,
    private Vibration: Vibration,
    private nativeAudio: NativeAudio, 
    private audio: AudioManagement
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
  ) {}
  estibas: any[];
  totalkgs: any;
  areas: Areas[] = [];
  cajas: Cajas[] = [];
  tarimas: Cajas[] = [];
  lotes: Lotes[] = [];
  tabla = {
    pallets: 'Total pallets: 0',
    kgs: 'KGS: 0',
    c_codigo_are: '',
    c_codigo_rec: '',
    c_concecutivo_dso: '',
    n_kilos_dso: '',
    n_cajas_dso: '',
    c_codigocaja_tcj: '',
    c_codigotarima_tcj: '',
    c_codigo_usu: environment.usuario_login,
    c_codigo: '',
    tipo: '',
  };
  scannedData: any;
  encodedData: '';
  encodeData: any;
  inputData: any;
  tiposorteo = [{ c_tipo: '' }];

  ngOnInit() {
    this.estibas = this.lotes;
    this.fn_cargarareas();
    this.fn_cargarcajas();
    this.fn_cargartarimas();
    this.setRingtone();
  }

  fn_cargarareas() {
    var json = {
      c_tipo_are: '05', // definir los tipos de areas y como quedaran en cada ventana
    };
    return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=1&as_json=' +
            JSON.stringify(json)
        )
        .subscribe((resp: any) => {
          this.areas = JSON.parse(resp);
          console.log(this.areas);
        });
    });
  }

  fn_cargarcajas() {
    var json = {
      c_tipo_tcj: 'C', // CAJAS
    };
    //llenar drop down de cajas para seleccionar.
    return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=2&as_json=' +
            JSON.stringify(json)
        )
        .subscribe((resp: any) => {
          this.cajas = JSON.parse(resp);
          console.log(this.cajas);
        });
    });
  }

  fn_cargartarimas() {
    var json = {
      c_tipo_tcj: 'T', // CAJAS
    };
    //llenar drop down de cajas para seleccionar.
    return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=2&as_json=' +
            JSON.stringify(json)
        )
        .subscribe((resp: any) => {
          this.tarimas = JSON.parse(resp);
          console.log(this.tarimas);
        });
    });
  }

  async fn_guardarsorteo() {
    var json = {
      c_codigo_are: this.tabla.c_codigo_are,
      c_codigo: this.tabla.c_codigo,
      n_kilos_dso: this.tabla.n_kilos_dso,
      n_cajas_dso: this.tabla.n_cajas_dso,
      c_codigocaja_tcj: this.tabla.c_codigocaja_tcj,
      c_codigotarima_tcj: this.tabla.c_codigotarima_tcj,
      c_codigo_usu: this.tabla.c_codigo_usu,
      c_tipo: this.tabla.tipo,
    };
    if ((await this.fn_validarcampos(json)) != 0) {
      if ((await this.fn_validartiposorteo()) == true) {
        await new Promise((f) => setTimeout(f, 1000));
        json.c_tipo = this.tabla.tipo;
        console.log(json);
        await this.fn_save(json).then((resolve) => {
          if (resolve) {
            this.fn_cargarlistado();
            this.tabla.c_codigo = '';
            this.tabla.n_cajas_dso = '';
            this.tabla.n_kilos_dso = '';
          }
        });
      }
      return;
    }
  }

  fn_cargarlistado() {
    var json = {
      c_codigo_are: this.tabla.c_codigo_are,
    };
    console.log(json);

    return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=6&as_json=' +
            JSON.stringify(json)
        )
        .subscribe((resp: any) => {
          this.lotes = JSON.parse(resp);
          console.log(this.lotes);
          this.estibas = this.lotes;

          this.tabla.pallets = 'Total pallets: ' + this.estibas.length;
          this.totalkgs = 0;
          var v: any;
          for (v = 0; v < this.estibas.length; v++) {
            this.totalkgs += this.estibas[v].n_kilos_dso;
          }
          this.tabla.kgs = 'KGS: ' + parseFloat(this.totalkgs).toFixed(3);
          this.fn_traertipo();
          resolve(true);
        });
    });
  }

  fn_save(json) {
    return new Promise((resolve) => {
      this.SorteoService.sp_AppSorteoProcesos(
        '/SorteoProcesos?as_empresa=' +
          environment.codempresa +
          '&as_operation=1&as_json=' +
          JSON.stringify(json)
      ).subscribe(
        (resp: any) => {
          var arrayresp = resp.split('|');
          if (arrayresp.length > 0) {
            console.log('proceso guardado');
            console.log(arrayresp[0]);
            switch (arrayresp[0]) {
              case '1':
                this.ultilService.presentToastok(
                  'Guardado!',
                  arrayresp[1],
                  2000,
                  'checkmark-done-outline',
                  'success',
                  'bien',
                  true
                );

                resolve(true);
                break;
              case '0':
                this.ultilService.presentToast(
                  'Error!',
                  arrayresp[1],
                  2000,
                  'warning-outline',
                  'danger',
                  'error',
                  true
                );
                resolve(false);
                break;
              default:
                this.ultilService.presentToast(
                  'Error!',
                  arrayresp[1],
                  2000,
                  'warning-outline',
                  'danger',
                  'error',
                  true
                );
                resolve(false);
                break;
            }
          } else {
            this.ultilService.presentToast(
              'Error!',
              'Ocurrio un error Interno.',
              2000,
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
            2000,
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

  fn_validarcampos(json) {
    if (json.c_codigo_are == '') {
<<<<<<< HEAD
      
      this.Vibration.vibrate(500);
      this.ultilService.AlertaOK(
        'Atención ',
        'Área de Sorting! ',
        'Debe seleccionar un área de sorting.',
        'OK',
        'alerta',
        true
      );
      return 0;
    } else if (json.c_codigo_rec == '') {
      
=======
      this.playSingle() 
      this.Vibration.vibrate(500);
      this.ultilService.AlertaOK(
        'Atención ',
        'Aárea de Sorting! ',
        'Debe seleccionar un área de sorting.',
        'OK'
      );
      return 0;
    } else if (json.c_codigo_rec == '') {
      this.playSingle() 
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
      this.Vibration.vibrate(500);
      this.ultilService.AlertaOK(
        'Atención ',
        'Palet o recepción! ',
        'Debe ingresar o escanear un codigo.',
<<<<<<< HEAD
        'OK',
        'alerta',
        true
      );
      return 0;
    } else if (json.n_kilos_dso == '' || json.n_kilos_dso == '0') {
      
=======
        'OK'
      );
      return 0;
    } else if (json.n_kilos_dso == '' || json.n_kilos_dso == '0') {
      this.playSingle() 
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
      this.Vibration.vibrate(500);
      this.ultilService.AlertaOK(
        'Atención ',
        'Kilos! ',
        'Debe ingresar los kilos.',
<<<<<<< HEAD
        'OK',
        'alerta',
        true
      );
      return 0;
    } else if (json.n_cajas_dso == '' || json.n_cajas_dso == '0') {
      
=======
        'OK'
      );
      return 0;
    } else if (json.n_cajas_dso == '' || json.n_cajas_dso == '0') {
      this.playSingle() 
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
      this.Vibration.vibrate(500);
      this.ultilService.AlertaOK(
        'Atención ',
        'Cajas! ',
        'Debe ingresar las cajas.',
<<<<<<< HEAD
        'OK',
        'alerta',
        true
      );
      return 0;
    } else if (json.c_codigocaja_tcj == '') {
      
=======
        'OK'
      );
      return 0;
    } else if (json.c_codigocaja_tcj == '') {
      this.playSingle() 
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
      this.Vibration.vibrate(500);
      this.ultilService.AlertaOK(
        'Atención ',
        'Tipo de cajas! ',
        'Debe seleccionar el tipo de caja.',
<<<<<<< HEAD
        'OK',
        'alerta',
        true
      );
      return 0;
    } else if (json.c_codigotarima_tcj == '') {
      
=======
        'OK'
      );
      return 0;
    } else if (json.c_codigotarima_tcj == '') {
      this.playSingle() 
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
      this.Vibration.vibrate(500);
      this.ultilService.AlertaOK(
        'Atención ',
        'Tipo de tarimas! ',
        'Debe seleccionar el tipo de tarima.',
<<<<<<< HEAD
        'OK',
        'alerta',
        true
=======
        'OK'
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
      );
      return 0;
    }
    return 1;
  }

  async fn_finvaciado() {
    var json = {
      c_codigo_are: this.tabla.c_codigo_are,
      c_codigo_usu: this.tabla.c_codigo_usu,
      c_tipo: this.tabla.tipo,
    };

    await this.fn_cargarlistado();
    await new Promise((f) => setTimeout(f, 1000));
<<<<<<< HEAD

    if (this.lotes.length <= 0) {
      this.Vibration.vibrate(500);
      
      return this.ultilService.AlertaOK(
        'Atención ',
        'Finalizar vaciado! ',
        'No hay registros para el Listado o ya fueron vaciados. Favor de revisar.',
        'OK',
        'alerta',
        true
      );
    }

    this.Vibration.vibrate(500);
    
=======

    if (this.lotes.length <= 0) {
      this.Vibration.vibrate(500);
      this.playSingle() 
      return this.ultilService.AlertaOK(
        'Atención ',
        'Finalizar vaciado! ',
        'No hay registros para el Listado o ya fueron vaciados. Favor de revisar.',
        'OK'
      );
    }
    
    this.Vibration.vibrate(500);
    this.playSingle() 
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
    if (await this.alerta(1, '')) {
      return new Promise((resolve) => {
        this.SorteoService.sp_AppSorteoProcesos(
          '/SorteoProcesos?as_empresa=' +
            environment.codempresa +
            '&as_operation=2&as_json=' +
            JSON.stringify(json)
        ).subscribe(
          (resp: any) => {
            var arrayresp = resp.split('|');
            if (arrayresp.length > 0) {
              console.log(arrayresp[0]);
              switch (arrayresp[0]) {
                case '1':
                  this.ultilService.presentToastok(
                    'Vaciado!',
                    arrayresp[1],
                    2000,
                    'checkmark-done-outline',
                    'success',
                    'bien',
                    true
                  );
                  this.fn_cargarlistado();
                  this.tabla.tipo = '';
                  resolve(true);
                  break;
                case '0':
                  this.ultilService.presentToast(
                    'Error!',
                    arrayresp[1],
                    2000,
                    'warning-outline',
                    'danger',
                    'error',
                    true
                  );
                  resolve(false);
                  break;
                default:
                  this.ultilService.presentToast(
                    'Error!',
                    arrayresp[1],
                    2000,
                    'warning-outline',
                    'danger',
                    'error',
                    true
                  );
                  resolve(false);
                  break;
              }
            } else {
              this.ultilService.presentToast(
                'Error!',
                'Ocurrio un error Interno.',
                2000,
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
              2000,
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

  fn_validartiposorteo() {
    var json = { c_codigo: this.tabla.c_codigo };
    console.log(this.tabla.c_codigo);
    if (this.tabla.tipo == '') {
      /*sacar tipo de sorteo (recepcion-sec , palet temporar, palet externo)*/
      return new Promise((resolve) => {
        this.getdatos
          .sp_AppGetDatos(
            '/GetDatos?as_empresa=' +
              environment.codempresa +
              '&as_operation=13&as_json=' +
              JSON.stringify(json)
          )
          .subscribe((resp: any) => {
            this.tiposorteo = JSON.parse(resp);
            this.tabla.tipo = this.tiposorteo[0].c_tipo;
            console.log(
              'El tipo del listado sera: ' + this.tiposorteo[0].c_tipo
            );
          });
        resolve(true);
      });
    } else {
      return new Promise((resolve) => {
        this.getdatos
          .sp_AppGetDatos(
            '/GetDatos?as_empresa=' +
              environment.codempresa +
              '&as_operation=13&as_json=' +
              JSON.stringify(json)
          )
          .subscribe((resp: any) => {
            this.tiposorteo = JSON.parse(resp);
            if (this.tabla.tipo == this.tiposorteo[0].c_tipo) {
              console.log(
                'El tipo del listado es: ' +
                  this.tabla.tipo +
                  ' es == a: ' +
                  this.tiposorteo[0].c_tipo
              );
              resolve(true);
            } else {
              console.log(
                'El tipo del listado es: ' +
                  this.tabla.tipo +
                  ' es <> a: ' +
                  this.tiposorteo[0].c_tipo
              );
              this.ultilService.presentToast(
                'Alerta!',
                'El registro que quiere ingresar no es del mismo tipo que los del listado o esta no existe.',
                2000,
                'warning-outline',
                'warning',
                'alerta',
                true
              );
            }
            resolve(false);
          });
      });
    }
  }

  fn_traertipo() {
    if (this.estibas.length > 0) {
      console.log(
        this.estibas[0].c_codigo_rec + this.estibas[0].c_concecutivo_dso
      );
      var json = {
        c_codigo: '',
      };
      if (
        this.estibas[0].c_codigo_rec + this.estibas[0].c_concecutivo_dso !=
        ''
      ) {
        json.c_codigo =
          this.estibas[0].c_codigo_rec + this.estibas[0].c_concecutivo_dso;
      } else if (this.estibas[0].c_codigo_pal) {
        json.c_codigo = this.estibas[0].c_codigo_pal;
      }
      return new Promise((resolve) => {
        this.getdatos
          .sp_AppGetDatos(
            '/GetDatos?as_empresa=' +
              environment.codempresa +
              '&as_operation=13&as_json=' +
              JSON.stringify(json)
          )
          .subscribe((resp: any) => {
            this.tiposorteo = JSON.parse(resp);
            this.tabla.tipo = this.tiposorteo[0].c_tipo;
            console.log(
              'los registros del listado son de tipo - ' + this.tabla.tipo
            );
            resolve(true);
          });
      });
    }
  }

  async alerta(opcion, codigo) {
    if (opcion == 1) {
      return new Promise(async (resolve) => {
        const confirm = await this.alertController.create({
          header: 'Sorting',
          message: '¿Desea finalizar vaciado? ',
          buttons: [
            {
              text: 'NO',
              role: 'cancel',
              handler: () => {
                return resolve(false);
              },
            },
            {
              text: 'SI',
              handler: () => {
                return resolve(true);
              },
            },
          ],
        });
<<<<<<< HEAD
        this.ultilService.playSingle('alerta',true);
=======
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
        await confirm.present();
      });
    } else if (opcion == 2) {
      return new Promise(async (resolve) => {
        const confirm = await this.alertController.create({
          header: 'Sorting',
          message: '¿Desea quitar el registro [' + codigo + '] del vaciado? ',
          buttons: [
            {
              text: 'NO',
              role: 'cancel',
              handler: () => {
                return resolve(false);
              },
            },
            {
              text: 'SI',
              handler: () => {
                return resolve(true);
              },
            },
          ],
        });
<<<<<<< HEAD
        this.ultilService.playSingle('alerta',true);
=======
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
        await confirm.present();
      });
    }
  }

  async scanBarcode() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Pase el codigo de barras por el área',
      resultDisplayDuration: 500,
      formats: 'EAN_13,EAN_8,QR_CODE,PDF_417 ',
      orientation: 'portrait',
    };

    this.barcodeScanner
      .scan(options)
      .then((barcodeData) => {
        console.log('Barcode data', barcodeData);
        this.scannedData = barcodeData;
        this.tabla.c_codigo = barcodeData.text;
        options.prompt = barcodeData.text;
        this.kilogramos.setFocus();
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  async fn_eliminar(c_codigo_rec, c_concecutivo_dso, c_codigo_pal) {
    var json = {
      c_codigo: '',
    };
    if (this.tabla.tipo == 'R') {
      json.c_codigo = c_codigo_rec + c_concecutivo_dso;
    } else if (this.tabla.tipo == 'P') {
      json.c_codigo = c_codigo_pal;
    }
    this.Vibration.vibrate(500);
<<<<<<< HEAD
    
=======
    this.playSingle() 
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
    if (await this.alerta(2, json.c_codigo)) {
      await this.ultilService.showLoading('Eliminando...');
      new Promise((resolve) => {
        this.SorteoService.sp_AppSorteoProcesos(
          '/SorteoProcesos?as_empresa=' +
            environment.codempresa +
            '&as_operation=3&as_json=' +
            JSON.stringify(json)
        ).subscribe(
          async (resp: any) => {
            var arrayresp = resp.split('|');
            if (arrayresp.length > 0) {
              switch (arrayresp[0]) {
                case '1':
                  this.ultilService.presentToastok(
                    'Eliminado!',
                    arrayresp[1],
                    2000,
                    'checkmark-done-outline',
<<<<<<< HEAD
                    'success',
                    'bien',
                    true
=======
                    'success'
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
                  );
                  await this.fn_cargarlistado();
                  await new Promise((f) => setTimeout(f, 1000));
                  if (this.estibas.length == 0) {
                    this.tabla.tipo = '';
                  }
                  resolve(true);
                  break;
                case '0':
                  this.ultilService.presentToast(
                    'Error!',
                    arrayresp[1],
                    2000,
                    'warning-outline',
<<<<<<< HEAD
                    'danger',
                    'error',
                    true
=======
                    'danger'
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
                  );
                  resolve(false);
                  break;
                default:
                  this.ultilService.presentToast(
                    'Error!',
                    arrayresp[1],
                    2000,
                    'warning-outline',
<<<<<<< HEAD
                    'danger',
                    'error',
                    true
=======
                    'danger'
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
                  );
                  resolve(false);
                  break;
              }
            } else {
              this.ultilService.presentToast(
                'Error!',
                'Ocurrio un error Interno.',
                2000,
                'warning-outline',
<<<<<<< HEAD
                'danger',
                'error',
                true
=======
                'danger'
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
              );
              resolve(false);
            }
          },
          (error) => {
            console.error(JSON.stringify(error));
            this.ultilService.presentToast(
              'Error!',
              'Ocurrio un error Interno.',
              2000,
              'warning-outline',
<<<<<<< HEAD
              'danger',
              'error',
              true
=======
              'danger'
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
            );
            resolve(false);
          }
        );
      });
    }
    return await this.ultilService.loading.dismiss();
  }
<<<<<<< HEAD
=======

  setRingtone() {/*Precargar el sonido al entrar a la ventana */
  // Precargar el sonido
  this.nativeAudio.preloadSimple('uniqueId1', 'assets/SD_ALERT_16.mp3');
  }

  playSingle() { /*reproduce el sonido 1 vez */
  this.nativeAudio.play('uniqueId1').then(async () => {
    console.log('Successfully played');
  }).catch((err) => {
    console.log('error', err);
  });
  }
>>>>>>> 818dfd51aad357afec410792a269a30bbc5156e7
}
