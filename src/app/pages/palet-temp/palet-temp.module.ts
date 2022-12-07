import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaletTempPageRoutingModule } from './palet-temp-routing.module';

import { PaletTempPage } from './palet-temp.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaletTempPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PaletTempPage]
})
export class PaletTempPageModule {}
