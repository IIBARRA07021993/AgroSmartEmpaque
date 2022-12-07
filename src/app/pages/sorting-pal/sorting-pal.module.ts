import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SortingPalPageRoutingModule } from './sorting-pal-routing.module';

import { SortingPalPage } from './sorting-pal.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SortingPalPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SortingPalPage]
})
export class SortingPalPageModule {}
 