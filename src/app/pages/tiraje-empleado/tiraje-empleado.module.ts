import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TirajeEmpleadoPageRoutingModule } from './tiraje-empleado-routing.module';

import { TirajeEmpleadoPage } from './tiraje-empleado.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TirajeEmpleadoPageRoutingModule,
    ComponentsModule,
    PipesModule
    
  ],
  declarations: [TirajeEmpleadoPage],
})
export class TirajeEmpleadoPageModule {}
