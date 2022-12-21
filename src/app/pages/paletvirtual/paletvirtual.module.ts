import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaletvirtualPageRoutingModule } from './paletvirtual-routing.module';

import { PaletvirtualPage } from './paletvirtual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaletvirtualPageRoutingModule
  ],
  declarations: [PaletvirtualPage]
})
export class PaletvirtualPageModule {}
