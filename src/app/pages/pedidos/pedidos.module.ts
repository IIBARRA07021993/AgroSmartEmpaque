import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosPageRoutingModule } from './pedidos-routing.module';

import { PedidosPage } from './pedidos.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [PedidosPage]
})
export class PedidosPageModule {}
