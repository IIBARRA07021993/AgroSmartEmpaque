import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { BuscarproductosComponent } from './buscarproductos/buscarproductos.component';
import { BuscaretiquetaComponent } from './buscaretiqueta/buscaretiqueta.component';
import { BuscarcolorComponent } from './buscarcolor/buscarcolor.component';
import { PipesModule } from '../pipes/pipes.module';
import { BuscarpalletComponent } from './buscarpallet/buscarpallet.component';
import { ConteocajasComponent } from './conteocajas/conteocajas.component';
import { FormsModule } from '@angular/forms';
import { BuscarprecentacionComponent } from './buscarprecentacion/buscarprecentacion.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    BuscarproductosComponent,
    BuscaretiquetaComponent,
    BuscarcolorComponent,
    BuscarpalletComponent,
    ConteocajasComponent,BuscarprecentacionComponent
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    BuscarproductosComponent,
    BuscaretiquetaComponent,
    BuscarcolorComponent,
    BuscarpalletComponent,
    ConteocajasComponent,
    BuscarprecentacionComponent

  ],
  imports: [CommonModule, IonicModule, RouterModule,PipesModule ,FormsModule],
})
export class ComponentsModule {}
