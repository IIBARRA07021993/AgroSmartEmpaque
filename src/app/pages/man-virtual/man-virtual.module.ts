import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManVirtualPageRoutingModule } from './man-virtual-routing.module';

import { ManVirtualPage } from './man-virtual.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManVirtualPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ManVirtualPage]
})
export class ManVirtualPageModule {}
