import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SortingEstPageRoutingModule } from './sorting-est-routing.module';

import { SortingEstPage } from './sorting-est.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SortingEstPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SortingEstPage]
})
export class SortingEstPageModule {}
