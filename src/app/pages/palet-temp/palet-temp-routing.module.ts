import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaletTempPage } from './palet-temp.page';

const routes: Routes = [
  {
    path: '',
    component: PaletTempPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaletTempPageRoutingModule {}
