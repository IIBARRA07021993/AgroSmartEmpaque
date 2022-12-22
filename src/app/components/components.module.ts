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

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    BuscarproductosComponent,
    BuscaretiquetaComponent,
    BuscarcolorComponent,
    BuscarpalletComponent
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    BuscarproductosComponent,
    BuscaretiquetaComponent,
    BuscarcolorComponent,
    BuscarpalletComponent

  ],
  imports: [CommonModule, IonicModule, RouterModule,PipesModule],
})
export class ComponentsModule {}
