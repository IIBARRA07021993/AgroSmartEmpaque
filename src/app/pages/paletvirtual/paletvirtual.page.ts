import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInput, ModalController } from '@ionic/angular';
import { BuscarcolorComponent } from 'src/app/components/buscarcolor/buscarcolor.component';
import { BuscaretiquetaComponent } from 'src/app/components/buscaretiqueta/buscaretiqueta.component';
import { BuscarpalletComponent } from 'src/app/components/buscarpallet/buscarpallet.component';
import { BuscarproductosComponent } from 'src/app/components/buscarproductos/buscarproductos.component';
import { Bandas } from 'src/app/interfaces/interfaces';
import { EyeColor } from 'src/app/models/color.model';
import { EyeEtiqueta } from 'src/app/models/etiqueta.model';
import { EyePalletVirtual } from 'src/app/models/palletvir.model';
import { EyeProducto } from 'src/app/models/producto.model';
import { ArmadopaletService } from 'src/app/services/armadopalet.service';
import { GetdatosService } from 'src/app/services/getdatos.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paletvirtual',
  templateUrl: './paletvirtual.page.html',
  styleUrls: ['./paletvirtual.page.scss'],
})
export class PaletvirtualPage implements OnInit {
  @ViewChild('codpal', { static: false }) codpal!: IonInput;

  b_nuevo_pal: boolean = true;
  b_conteocajas: boolean = false;
  banda: Bandas;
  c_codigo_pal: string = '';
  c_codigo_pro: string = '';
  c_codigo_eti: string = '';
  c_codigo_col: string = '';
  n_bulxpa_pal: number = 0;
  producto: EyeProducto = new EyeProducto();
  etiqueta: EyeEtiqueta = new EyeEtiqueta();

  color: EyeColor = new EyeColor();
  pallet: EyePalletVirtual = new EyePalletVirtual();

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService,
    private armadopal: ArmadopaletService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((Params: Bandas) => {
      this.banda = Params;
    });
  }

  async buscarPalletVirtual() {
    const modal = await this.modalController.create({
      component: BuscarpalletComponent,
      componentProps: {
        c_codigo_pal: this.c_codigo_pal,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.pallet = new EyePalletVirtual();
        this.pallet = dataReturned.data;
        if (this.pallet.c_codigo !== '') {
          this.LimpiarCaptura();
          this.b_nuevo_pal = false;
          this.c_codigo_pal = this.pallet.c_codigo;
        }
      }
    });
    return await modal.present();
  }

  async buscarPresentacion() {}

  async buscarProducto() {
    const modal = await this.modalController.create({
      component: BuscarproductosComponent,
      componentProps: {
        c_codigo_pro: this.producto.c_codigo_pro,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.producto = dataReturned.data;
      }
    });
    return await modal.present();
  }

  async buscarProductoPorCodigo() {
    /*  return new Promise((resolve) => {
      var json = { c_codigo_pro : this.c_codigo_pro};
      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=14&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.producto   = JSON.parse(resp);
            console.log(this.producto); 
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
    });*/
  }

  async buscarEtiqueta() {
    const modal = await this.modalController.create({
      component: BuscaretiquetaComponent,
      componentProps: {
        c_codigo_eti: this.etiqueta.c_codigo_eti,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.etiqueta = dataReturned.data;
      }
    });
    return await modal.present();
  }

  buscarEtiquetaPorCodigo() {
    /* return new Promise((resolve) => {
      var json = { c_codigo_eti : this.c_codigo_eti};
      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=15&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.etiqueta = JSON.parse(resp);
            console.log(this.etiqueta);
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
    });*/
  }

  async buscarColor() {
    const modal = await this.modalController.create({
      component: BuscarcolorComponent,
      componentProps: {
        c_codigo_col: this.color.c_codigo_col,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.color = dataReturned.data;
      }
    });
    return await modal.present();
  }

  buscarColorPorCodigo() {
    /* return new Promise((resolve) => {
      var json = { c_codigo_col : this.c_codigo_col};
      console.log(JSON.stringify(json));

      this.getdatoserv
        .sp_AppGetDatos(
          '/GetDatos?as_empresa=' +
            environment.codempresa +
            '&as_operation=16&as_json=' +
            JSON.stringify(json)
        )
        .subscribe(
          (resp: string) => {
            console.log(resp);
            this.color = JSON.parse(resp);
            console.log(this.color);
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
    });*/
  }

  removerCodigo() {
    this.c_codigo_pal = '';
    this.pallet = new EyePalletVirtual();
    this.b_nuevo_pal = true;
    console.log(this.c_codigo_pal);
  }

  removerProducto() {
    this.producto = new EyeProducto();
    console.log(this.producto);
  }

  removerEtiqueta() {
    this.etiqueta = new EyeEtiqueta();
    console.log(this.etiqueta);
  }

  removerColor() {
    this.color = new EyeColor();
    console.log(this.color);
  }

  async newpPal() {
    await this.Valida_Folio().then(async (resolve) => {
      if (resolve) {
        await this.Valida_Presentacion().then(async (resolve) => {
          if (resolve) {
            await this.Guardar_Pallet();
          }
        });
      }
    });
  }

  Guardar_Pallet() {
    return new Promise((resolve) => {
      var json = {
        c_codigo_tem: environment.c_codigo_tem,
        c_codigo_emp: environment.c_codigo_emp,
        c_codigo_bnd: this.banda.c_codigo_bnd,
        c_codigo_sel: this.banda.c_codigo_sel,
        c_codigo_lot: this.banda.c_codigo_lot,
        c_codigo_pro: this.producto.c_codigo_pro,
        c_codigo_eti: this.etiqueta.c_codigo_eti,
        c_codigo_col: this.color.c_codigo_col,
        n_bulxpa_pal: this.n_bulxpa_pal,
        c_codigo_usu: environment.usuario_login,
        c_codigo_pal: this.c_codigo_pal,
      };
      console.log(JSON.stringify(json));

      this.armadopal
        .sp_AppControlEstiba(
          '/ControlEstiba?as_empresa=' +
            environment.codempresa +
            '&as_operation=5&as_json=' +
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

                this.LimpiarCaptura();

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

  Valida_Folio() {
    return new Promise((resolve) => {
      var json = {
        c_codigo_tem: environment.c_codigo_tem,
        c_codigo_emp: environment.c_codigo_emp,
        c_codigo_pme: this.c_codigo_pal,
        b_nuevo_pal: this.b_nuevo_pal,
      };
      console.log(JSON.stringify(json));

      if (this.n_bulxpa_pal === 0) {
        this.ultilService.presentToast(
          'Atención!',
          'Debe especificar el número de Cajas/Bultos a empacar.',
          1500,
          'warning-outline',
          'warning'
        );
        resolve(false);
      } else if (this.producto.c_codigo_pro === '') {
        this.ultilService.presentToast(
          'Atención!',
          'Debe especificar el codigó de Producto a empacar.',
          1500,
          'warning-outline',
          'warning'
        );
        resolve(false);
      } else if (this.etiqueta.c_codigo_eti === '') {
        this.ultilService.presentToast(
          'Atención!',
          'Debe especificar el codigó de Etiqueta a empacar.',
          1500,
          'warning-outline',
          'warning'
        );
        resolve(false);
      } else if (this.color.c_codigo_col === '') {
        this.ultilService.presentToast(
          'Atención!',
          'Debe especificar el codigó de Color a empacar.',
          1500,
          'warning-outline',
          'warning'
        );
        resolve(false);
      } else {
        this.armadopal
          .sp_AppControlEstiba(
            '/ControlEstiba?as_empresa=' +
              environment.codempresa +
              '&as_operation=3&as_json=' +
              JSON.stringify(json)
          )
          .subscribe(
            (resp: string) => {
              var arrayresp = resp.split('|');
              if (arrayresp.length > 0) {
                if (arrayresp[0] == '1') {
                  this.c_codigo_pal = arrayresp[1];
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
      }
    });
  }

  Valida_Presentacion() {
    return new Promise((resolve) => {
      var json = {
        c_codigo_pro: this.producto.c_codigo_pro,
        c_codigo_eti: this.etiqueta.c_codigo_eti,
        c_codigo_col: this.color.c_codigo_col,
      };
      console.log(JSON.stringify(json));

      this.armadopal
        .sp_AppControlEstiba(
          '/ControlEstiba?as_empresa=' +
            environment.codempresa +
            '&as_operation=4&as_json=' +
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

  LimpiarCaptura() {
    this.b_nuevo_pal = true;
    this.c_codigo_pal = '';
    this.c_codigo_pro = '';
    this.c_codigo_eti = '';
    this.c_codigo_col = '';
    this.c_codigo_pal = '';
    this.removerProducto();
    this.removerEtiqueta();
    this.removerColor();
    this.c_codigo_pal = '';
    this.n_bulxpa_pal = 0;
  }
  enterkey() {}
  fn_scanner() {}

  ConteoCajas() {}
}
