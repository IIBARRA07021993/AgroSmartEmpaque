import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, ModalController } from '@ionic/angular';
import { BuscarcolorComponent } from 'src/app/components/buscarcolor/buscarcolor.component';
import { BuscaretiquetaComponent } from 'src/app/components/buscaretiqueta/buscaretiqueta.component';
import { BuscarproductosComponent } from 'src/app/components/buscarproductos/buscarproductos.component';
import { Bandas } from 'src/app/interfaces/interfaces';
import { EyeColor } from 'src/app/models/color.model';
import { EyeEtiqueta } from 'src/app/models/etiqueta.model';
import { EyeProducto } from 'src/app/models/producto.model';
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

  banda: Bandas;
  c_codigo_pal: string = '';
  producto: EyeProducto = new EyeProducto();
  etiqueta: EyeEtiqueta = new EyeEtiqueta();
  color: EyeColor = new EyeColor();

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
   
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((Params: Bandas) => {
      this.banda = Params;
    });
  }

  enterkey() {}
  fn_scanner() {}

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

  removerCodigo() {
    this.c_codigo_pal = '';
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
}
