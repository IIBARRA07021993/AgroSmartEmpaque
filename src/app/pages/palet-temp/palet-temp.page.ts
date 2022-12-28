import { Component, OnInit } from '@angular/core';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { environment } from 'src/environments/environment';
import { Grado } from 'src/app/interfaces/interfaces';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { UtilService } from 'src/app/services/util.service';
import { PaletempService } from 'src/app/services/paletemp.service';

@Component({
  selector: 'app-palet-temp',
  templateUrl: './palet-temp.page.html',
  styleUrls: ['./palet-temp.page.scss'],
})
export class PaletTempPage implements OnInit {
  titulo = 'Creación Palet Temporal';

  constructor(
    private getdatos: GetdatosService,
    private barcodeScanner: BarcodeScanner,
    private ultilService: UtilService,
    private paletempService:PaletempService
  ) {}
  pallets: any[];
  grados: Grado[] = [];
  totalkgs: any;
  totalcajas: any;
  tabla = {
    paletas: 'Pallets: 0',
    cajas: 'Cajas: 0',
    kgs: 'KGS: 0.000',
    c_codigo_gdm: '',
    c_codigo: '',
    n_kilos_pte: '',
    n_cajas_pte: '',
    c_codigo_usu: environment.usuario_login,
  };
  listado = [];
  scannedData: any;
  encodedData: '';
  encodeData: any;
  inputData: any;
  ll_cont = 0;
  ls_palettemporal = [{c_codigo_pal:''}];

  ngOnInit() {
    this.fn_cargargrado();
    this.fn_maximo();
  }

  fn_cargargrado() {
    var json = {};
    //llenar drop down de grado para seleccionar.
    return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=11&as_json=' +
            JSON.stringify(json)
        )
        .subscribe((resp: any) => {
          this.grados = JSON.parse(resp);
          console.log(this.grados);
        });
    });
  }

  async fn_agregarlist() {
    var ll_exist = 0;
    var ls_nombre_gdm = '';

    if ((await this.fn_validarcampos()) == 0){
      return ;
    }

    for (let index = 0; index < this.listado.length; index++) {
      if (this.tabla.c_codigo == this.listado[index].c_codigo) {
        ll_exist = 1;
        this.ultilService.presentToast(
          'Alerta!',
          'La recepcion[' +
            this.tabla.c_codigo +
            '] ingresada ya existe en el listado.',
          1000,
          'warning-outline',
          'warning',
          'alerta',
          true
        );
      }
    }

    for (let index = 0; index < this.grados.length; index++) {
      if (this.tabla.c_codigo_gdm == this.grados[index].c_codigo_gdm) {
        ls_nombre_gdm = this.grados[index].v_nombre_gdm;
      }
    }

    if (ll_exist == 0) {
      this.listado[this.ll_cont] = {
        c_codigo: '',
        c_codigo_gdm: '',
        n_kilos_pte: '',
        n_cajas_pte: '',
        v_nombre_gdm: '',
      };
      this.listado[this.ll_cont].c_codigo = this.tabla.c_codigo;
      this.listado[this.ll_cont].c_codigo_gdm = this.tabla.c_codigo_gdm;
      this.listado[this.ll_cont].n_kilos_pte = this.tabla.n_kilos_pte;
      this.listado[this.ll_cont].n_cajas_pte = this.tabla.n_cajas_pte;
      this.listado[this.ll_cont].v_nombre_gdm = ls_nombre_gdm;
      console.log(this.listado);
      this.ll_cont = this.ll_cont + 1;
    }
    this.tabla.paletas = 'Total pallets: ' + this.listado.length;
    this.totalkgs = 0;
    this.totalcajas = 0;
    var v: any;
    for (v = 0; v < this.listado.length; v++) {
      this.totalkgs += this.listado[v].n_kilos_pte;
      this.totalcajas += this.listado[v].n_cajas_pte;
    }
    this.tabla.kgs = 'KGS: ' + this.totalkgs;
    this.tabla.cajas = 'Cajas: ' + this.totalcajas;
    this.tabla.c_codigo = '' ;
    this.tabla.n_kilos_pte = '';
    this.tabla.n_cajas_pte = '';
  }

  fn_validarcampos(){
    if (this.tabla.c_codigo == '') {
      this.ultilService.presentToast(
        'Alerta!',
        'Debe ingresar una recepción.',
        1000,
        'warning-outline',
        'warning',
        'alerta',
        true
      );
      return 0;
    } else if (this.tabla.n_cajas_pte == '') {
      this.ultilService.presentToast(
        'Alerta!',
        'Debe ingresar la cantidad de cajas.',
        1000,
        'warning-outline',
        'warning',
        'alerta',
        true
      );
      return 0;
    } else if (this.tabla.n_kilos_pte == '') {
      this.ultilService.presentToast(
        'Alerta!',
        'Debe ingresar los kilos.',
        1000,
        'warning-outline',
        'warning',
        'alerta',
        true
      );
      return 0;
    }else if (this.tabla.c_codigo_gdm == '') {
      this.ultilService.presentToast(
        'Alerta!',
        'Debe seleccionar el grado de maduracicón.',
        1000,
        'warning-outline',
        'warning',
        'alerta',
        true
      );
      return 0;
    }
    return 1 
  }

  fn_guardarpalet() {
    for (let index = 0; index < this.listado.length; index++) {
      var json = {
        c_codigo_pal: this.ls_palettemporal[0].c_codigo_pal,
        c_codigo_pte: this.listado[index].c_codigo.substring(0, 6),
        c_concecutivo_pte: this.listado[index].c_codigo.substring(6, 9),
        c_codigo_gdm: this.listado[index].c_codigo_gdm,
        n_kilos_dso: this.listado[index].n_kilos_pte,
        n_cajas_dso: this.listado[index].n_cajas_pte,
        c_codigo_usu: this.tabla.c_codigo_usu,
      };
      return new Promise((resolve) => {
        this.paletempService.sp_AppPaletTemporal(
          '/PaletTemporal?as_empresa=' +
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
                    1000,
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
                    1000,
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
                1000,
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
              1000,
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

  fn_maximo(){
    var json = {};
    //llenar drop down de grado para seleccionar.
    return new Promise((resolve) => {
      this.getdatos
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=12&as_json=' +
            JSON.stringify(json)
        )
        .subscribe((resp: any) => {
          this.ls_palettemporal = JSON.parse(resp);
          console.log(this.ls_palettemporal);
        });
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
