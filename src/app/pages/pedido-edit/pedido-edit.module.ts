import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoEditPageRoutingModule } from './pedido-edit-routing.module';

import { PedidoEditPage } from './pedido-edit.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoEditPageRoutingModule,PipesModule
  ],
  declarations: [PedidoEditPage]
})
export class PedidoEditPageModule {}
