import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInput, ModalController } from '@ionic/angular';
import { BuscarcolorComponent } from 'src/app/components/buscarcolor/buscarcolor.component';
import { BuscaretiquetaComponent } from 'src/app/components/buscaretiqueta/buscaretiqueta.component';
import { BuscarpalletComponent } from 'src/app/components/buscarpallet/buscarpallet.component';
import { BuscarproductosComponent } from 'src/app/components/buscarproductos/buscarproductos.component';
import { ConteocajasComponent } from 'src/app/components/conteocajas/conteocajas.component';
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
  @ViewChild('inputpallet', { static: false }) inputpallet!: IonInput;
  @ViewChild('inputproducto', { static: false }) inputproducto!: IonInput;
  @ViewChild('inputetiqueta', { static: false }) inputetiqueta!: IonInput;
  @ViewChild('inputcolor', { static: false }) inputcolor!: IonInput;
  @ViewChild('inputcajas', { static: false }) inputcajas!: IonInput;

  b_nuevo_pal: boolean = true;
  b_conteocajas: boolean = true;
  banda: Bandas;
  c_codigo_pal: string = '';
  c_codigo_pro: string = '';
  c_codigo_eti: string = '';
  c_codigo_col: string = '';
  n_bulxpa_pal: number = 0;
  producto: EyeProducto = new EyeProducto();
  productos: EyeProducto[] = [];
  etiqueta: EyeEtiqueta = new EyeEtiqueta();
  etiquetas: EyeEtiqueta[] = [];
  color: EyeColor = new EyeColor();
  colores: EyeColor[] = [];
  pallet: EyePalletVirtual = new EyePalletVirtual();
  pallets: EyePalletVirtual[] = [];

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private getdatoserv: GetdatosService,
    private ultilService: UtilService,
    private armadopal: ArmadopaletService
  ) {}
 
  async ionViewWillEnter() {
    console.log('ionViewWillEnter');
    await this.inputpallet.setFocus();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((Params: Bandas) => {
      this.banda = Params;
    });
  }

  async ConteoCajas() {
    const modal = await this.modalController.create({
      component: ConteocajasComponent,
      componentProps: {
        c_codigo_pro: this.c_codigo_pro,
        c_codigo_eti: this.c_codigo_eti,
        c_codigo_col: this.c_codigo_pro,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        console.log(dataReturned.data);
        //this.etiqueta = dataReturned.data;
        this.inputcolor.setFocus();
      }
    });
    return await modal.present();
  }

  async buscarPalletVirtualCodigo(codigo) {
    console.log('buscarPalletVirtualCodigo');
    console.log(codigo);
    this.c_codigo_pal = codigo;
    console.log(this.c_codigo_pal);
    // this.inputproducto.setFocus()

    return new Promise((resolve) => {
      var json = {
        c_codigo_tem: environment.c_codigo_tem,
        c_codigo_emp: environment.c_codigo_emp,
        c_codigo_pal: this.c_codigo_pal,
        c_codsec_pal: '00',
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
            if (this.pallets.length > 0) {
              this.pallet = this.pallets[0];
              console.log(this.pallet);

              if (this.pallet.c_codigo_pal !== '') {
                this.ultilService.presentToast(
                  'PALET YA CONFIRMADO!',
                  'El Código de Palet [' +
                    this.c_codigo_pal +
                    '] ya fue confirmado como Palet final.',

                  1500,
                  'warning-outline',
                  'warning', 'alerta' , true 
                );
                this.removerCodigo();
                resolve(false);
              } else {
                this.LimpiarCaptura();
                this.b_nuevo_pal = false;
                this.c_codigo_pal = this.pallet.c_codigo;
                this.inputproducto.setFocus();
                resolve(true);
              }
            } else {
              this.ultilService.presentToast(
                'ATENCION!',
                'El Código de Palet [' +
                  this.c_codigo_pal +
                  '] NO existe en los palets multiestiba.',

                1500,
                'warning-outline',
                'warning', 'alerta' , true 
              );
              this.removerCodigo();
              resolve(false);
            }
          },
          (error) => {
            console.error(JSON.stringify(error));
            this.ultilService.presentToast(
              'Error!',
              'Ocurrio un error Interno.',
              500,
              'warning-outline',
              'danger','error' , true 
            );
            this.removerCodigo();
            resolve(false);
          }
        );
    });
  }

  async buscarProductoPorCodigo(codigo) {
    console.log('buscarProductoPorCodigo');
    console.log(codigo);
    this.c_codigo_pro = codigo;
    console.log(this.c_codigo_pro);
    //this.inputetiqueta.setFocus()
    return new Promise((resolve) => {
      var json = { c_codigo_pro: this.c_codigo_pro };
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
            this.productos = JSON.parse(resp);
            console.log(this.productos);

            if (this.productos.length > 0) {
              this.producto = this.productos[0];
              this.c_codigo_pro = this.producto.c_codigo_pro;
              this.inputetiqueta.setFocus();
              resolve(true);
            } else {
              this.ultilService.presentToast(
                'ATENCION!',
                'El Código del Producto [' +
                  this.c_codigo_pro +
                  '] NO existe o esta Inactivo en el catálogo.',
                1500,
                'warning-outline',
                'warning', 'alerta' , true 
              );
              this.removerProducto();
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
              'danger', 'error' , true 
            );
            this.removerProducto();
            resolve(false);
          }
        );
    });
  }

  async buscarEtiquetaPorCodigo(codigo) {
    console.log('buscarEtiquetaPorCodigo');
    console.log(codigo);
    this.c_codigo_eti = codigo;
    console.log(this.c_codigo_eti);
    //this.inputcolor.setFocus()
    return new Promise((resolve) => {
      var json = { c_codigo_eti: this.c_codigo_eti };
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
            this.etiquetas = JSON.parse(resp);
            console.log(this.etiquetas);

            if (this.etiquetas.length > 0) {
              this.etiqueta = this.etiquetas[0];
              this.c_codigo_eti = this.etiqueta.c_codigo_eti;
              this.inputcolor.setFocus();
              resolve(true);
            } else {
              this.ultilService.presentToast(
                'ATENCION!',
                'El Código de la Etiqueta [' +
                  this.c_codigo_eti +
                  '] NO existe o esta Inactivo en el catálogo.',
                1500,
                'warning-outline',
                'warning', 'alerta' , true 
              );
              this.removerEtiqueta();
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
              'danger', 'error' , true 
            );
            this.removerEtiqueta();
            resolve(false);
          }
        );
    });
  }

  async buscarColorPorCodigo(codigo) {
    console.log('buscarColorPorCodigo');
    console.log(codigo);
    this.c_codigo_col = codigo;
    console.log(this.c_codigo_col);
    //this.inputcajas.setFocus()
    return new Promise((resolve) => {
      console.log(this.c_codigo_col);
      console.log(this.pallet.c_codigo_col);
      var json = { c_codigo_col: this.c_codigo_col };
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
            this.colores = JSON.parse(resp);
            console.log(this.colores);

            if (this.colores.length > 0) {
              this.color = this.colores[0];
              this.c_codigo_col = this.color.c_codigo_col;
              this.inputcajas.setFocus();
              resolve(true);
            } else {
              this.ultilService.presentToast(
                'ATENCION!',
                'El Código del Color [' +
                  this.c_codigo_col +
                  '] NO existe o esta Inactivo en el catálogo.',
                1500,
                'warning-outline',
                'warning' , 'alerta' , true 
              );
              this.removerColor();
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
              'danger', 'error' , true 
            );
            this.removerColor();
            resolve(false);
          }
        );
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
          this.inputproducto.setFocus();
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
        this.inputetiqueta.setFocus();
      }
    });
    return await modal.present();
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
        this.inputcolor.setFocus();
      }
    });
    return await modal.present();
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
        this.inputcajas.setFocus();
      }
    });
    return await modal.present();
  }

  removerCodigo() {
    this.c_codigo_pal = '';
    this.pallet = new EyePalletVirtual();
    this.b_nuevo_pal = true;
    console.log(this.c_codigo_pal);
  }

  removerProducto() {
    this.producto = new EyeProducto();
    this.c_codigo_pro = '';
    console.log(this.producto);
  }

  removerEtiqueta() {
    this.etiqueta = new EyeEtiqueta();
    this.c_codigo_eti = '';
    console.log(this.etiqueta);
  }

  removerColor() {
    this.color = new EyeColor();
    this.c_codigo_col = '';
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
        .sp_AppControlEstiba_Put(
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
                this.ultilService.AlertaOK(
                  'Guardado',
                  'Guardado de Pallet',
                  arrayresp[1],
                  'OK', 'bien' , true 
                );
                /* this.ultilService.presentToastok(
                  'Atención!',
                  arrayresp[1],
                  5000,
                  'checkmark-done-outline',
                  'success'
                );*/

                this.LimpiarCaptura();

                resolve(true);
              } else {
                this.ultilService.presentToastok(
                  'Atención!',
                  arrayresp[1],
                  1500,
                  'warning-outline',
                  'warning', 'alerta' , true 
                );
                resolve(false);
              }
            } else {
              this.ultilService.presentToast(
                'Error!',
                'Ocurrio un error Interno.',
                1500,
                'warning-outline',
                'danger', 'error' , true 
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
              'danger','error' , true 
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
          'warning','alerta' , true 
        );
        resolve(false);
      } else if (this.producto.c_codigo_pro === '') {
        this.ultilService.presentToast(
          'Atención!',
          'Debe especificar el codigó de Producto a empacar.',
          1500,
          'warning-outline',
          'warning','alerta' , true 
        );
        resolve(false);
      } else if (this.etiqueta.c_codigo_eti === '') {
        this.ultilService.presentToast(
          'Atención!',
          'Debe especificar el codigó de Etiqueta a empacar.',
          1500,
          'warning-outline',
          'warning','alerta' , true 
        );
        resolve(false);
      } else if (this.color.c_codigo_col === '') {
        this.ultilService.presentToast(
          'Atención!',
          'Debe especificar el codigó de Color a empacar.',
          1500,
          'warning-outline',
          'warning','alerta' , true 
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
                    'warning','alerta' , true 
                  );
                  resolve(false);
                }
              } else {
                this.ultilService.presentToast(
                  'Error!',
                  'Ocurrio un error Interno.',
                  1500,
                  'warning-outline',
                  'danger','error' , true 
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
                'danger','error' , true 
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
                  'warning','alerta' , true 
                );
                resolve(false);
              }
            } else {
              this.ultilService.presentToast(
                'Error!',
                'Ocurrio un error Interno.',
                1500,
                'warning-outline',
                'danger','error' , true 
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
              'danger','error' , true 
            );
            resolve(false);
          }
        );
    });
  }

  LimpiarCaptura() {
    this.b_nuevo_pal = true;
    this.c_codigo_pal = '';
    this.removerProducto();
    this.removerEtiqueta();
    this.removerColor();
    this.n_bulxpa_pal = 0;
    this.inputpallet.setFocus();
  }
}
