import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { BuscarproductosComponent } from './buscarproductos/buscarproductos.component';
import { BuscaretiquetaComponent } from './buscaretiqueta/buscaretiqueta.component';
import { BuscarcolorComponent } from './buscarcolor/buscarcolor.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    BuscarproductosComponent,
    BuscaretiquetaComponent,
    BuscarcolorComponent,
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    BuscarproductosComponent,
    BuscaretiquetaComponent,
    BuscarcolorComponent,
  ],
  imports: [CommonModule, IonicModule, RouterModule],
})
export class ComponentsModule {}
