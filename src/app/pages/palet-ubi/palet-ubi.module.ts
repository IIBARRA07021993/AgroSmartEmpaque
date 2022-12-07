import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaletUbiPageRoutingModule } from './palet-ubi-routing.module';

import { PaletUbiPage } from './palet-ubi.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaletUbiPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PaletUbiPage]
})
export class PaletUbiPageModule {}
