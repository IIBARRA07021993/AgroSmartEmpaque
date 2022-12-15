import { Component, OnInit } from '@angular/core';
import { Areas, Cajas, Lotes } from 'src/app/interfaces/interfaces';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { environment } from 'src/environments/environment';
import { UtilService } from 'src/app/services/util.service';
import { AlertController } from '@ionic/angular';
import { SorteoService } from 'src/app/services/sorteo.service';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-sorting-est',
  templateUrl: './sorting-est.page.html',
  styleUrls: ['./sorting-est.page.scss'],
})
export class SortingEstPage implements OnInit {
  titulo = 'Sorting Maduración(Estiba)';
  constructor(
    private getdatos: GetdatosService,
    private ultilService: UtilService,
    private SorteoService: SorteoService,
    private alertController: AlertController,
    private barcodeScanner: BarcodeScanner
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
  };
  scannedData: any;
  encodedData: '';
  encodeData: any;
  inputData: any;

  ngOnInit() {
    this.estibas = this.lotes;
    this.fn_cargarareas();
    this.fn_cargarcajas();
    this.fn_cargartarimas();
  }

  fn_cargarareas() {
    var json = {
      c_tipo_are: '05', // definir los tipos de areas y como quedaran en cada ventana
    };
    //llenar drop down de area para seleccionar.
    return new Promise((resolve) => {
      //http://192.175.112.100:7001/api/GetAreaFisica?as_empresa=01&as_operation=1&as_json={}
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
      c_codigo_rec: this.tabla.c_codigo.substring(0, 6),
      c_concecutivo_dso: this.tabla.c_codigo.substring(6, 9),
      n_kilos_dso: this.tabla.n_kilos_dso,
      n_cajas_dso: this.tabla.n_cajas_dso,
      c_codigocaja_tcj: this.tabla.c_codigocaja_tcj,
      c_codigotarima_tcj: this.tabla.c_codigotarima_tcj,
      c_codigo_usu: this.tabla.c_codigo_usu,
    };
    console.log(json);
    if ((await this.fn_validarcampos(json)) == 0) {
      return;
    }
    await this.fn_save(json).then((resolve) => {
      if (resolve) {
        console.log('Recepcion guardada');
        this.fn_cargarlistado();
        console.log('listado actualizado');
        this.tabla.c_codigo = '';
        this.tabla.n_cajas_dso = '';
        this.tabla.n_kilos_dso = '';
      }
    });
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
          this.tabla.kgs = 'KGS: ' + this.totalkgs;
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
            console.log(arrayresp[0]);
            switch (arrayresp[0]) {
              case '1':
                this.ultilService.presentToastok(
                  'Guardado!',
                  arrayresp[1],
                  1500,
                  'checkmark-done-outline',
                  'success'
                );

                resolve(true);
                break;
              case '0':
                this.ultilService.presentToast(
                  'Error!',
                  arrayresp[1],
                  1000,
                  'warning-outline',
                  'danger'
                );
                resolve(false);
                break;
              default:
                this.ultilService.presentToast(
                  'Error!',
                  arrayresp[1],
                  1000,
                  'warning-outline',
                  'danger'
                );
                resolve(false);
                break;
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
            1000,
            'warning-outline',
            'danger'
          );
          resolve(false);
        }
      );
    });
  }

  fn_validarcampos(json) {
    if (json.c_codigo_are == '') {
      this.ultilService.presentToast(
        'Alerta!',
        'Debe seleccionar un área de sorting.',
        1000,
        'warning-outline',
        'warning'
      );
      return 0;
    } else if (json.c_codigo_rec == '') {
      this.ultilService.presentToast(
        'Alerta!',
        'Debe ingresar una recepción.',
        1000,
        'warning-outline',
        'warning'
      );
      return 0;
    } else if (json.n_kilos_dso == 0) {
      this.ultilService.presentToast(
        'Alerta!',
        'Debe ingresar los kilos de la recepción.',
        1000,
        'warning-outline',
        'warning'
      );
      return 0;
    } else if (json.n_cajas_dso == 0) {
      this.ultilService.presentToast(
        'Alerta!',
        'Debe ingresar las cajas de la recepción.',
        1000,
        'warning-outline',
        'warning'
      );
      return 0;
    } else if (json.c_codigocaja_tcj == '') {
      this.ultilService.presentToast(
        'Alerta!',
        'Debe ingresar el tipo de caja.',
        1000,
        'warning-outline',
        'warning'
      );
      return 0;
    } else if (json.c_codigotarima_tcj == '') {
      this.ultilService.presentToast(
        'Alerta!',
        'Debe ingresar el tipo de tarima.',
        1000,
        'warning-outline',
        'warning'
      );
      return 0;
    }
  }

  async fn_finvaciado() {
    var json = {
      c_codigo_are: this.tabla.c_codigo_are,
    };

    if (this.lotes.length <= 0) {
      return;
    }

    if (await this.alerta()) {
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
                    1500,
                    'checkmark-done-outline',
                    'success'
                  );
                  this.fn_cargarlistado();
                  resolve(true);
                  break;
                case '0':
                  this.ultilService.presentToast(
                    'Error!',
                    arrayresp[1],
                    1000,
                    'warning-outline',
                    'danger'
                  );
                  resolve(false);
                  break;
                default:
                  this.ultilService.presentToast(
                    'Error!',
                    arrayresp[1],
                    1000,
                    'warning-outline',
                    'danger'
                  );
                  resolve(false);
                  break;
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
              1000,
              'warning-outline',
              'danger'
            );
            resolve(false);
          }
        );
      });
    }
  }

  async alerta() {
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
      await confirm.present();
    });
  }

  scanBarcode() {
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
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }
}
