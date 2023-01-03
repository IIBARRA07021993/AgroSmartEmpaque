import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControltirajePage } from './controltiraje.page';

const routes: Routes = [
  {
    path: '',
    component: ControltirajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControltirajePageRoutingModule {}
