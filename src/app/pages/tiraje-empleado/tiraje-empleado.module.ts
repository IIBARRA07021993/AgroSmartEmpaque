import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TirajeEmpleadoPageRoutingModule } from './tiraje-empleado-routing.module';

import { TirajeEmpleadoPage } from './tiraje-empleado.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TirajeEmpleadoPageRoutingModule,ComponentsModule
  ],
  declarations: [TirajeEmpleadoPage]
})
export class TirajeEmpleadoPageModule {}
