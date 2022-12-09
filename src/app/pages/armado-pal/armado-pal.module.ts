import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArmadoPalPageRoutingModule } from './armado-pal-routing.module';

import { ArmadoPalPage } from './armado-pal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArmadoPalPageRoutingModule
  ],
  declarations: [ArmadoPalPage]
})
export class ArmadoPalPageModule {}
