import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControltirajePageRoutingModule } from './controltiraje-routing.module';

import { ControltirajePage } from './controltiraje.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControltirajePageRoutingModule,PipesModule
  ],
  declarations: [ControltirajePage]
})
export class ControltirajePageModule {}
