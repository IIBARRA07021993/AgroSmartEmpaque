import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaletUbiPage } from './palet-ubi.page';

const routes: Routes = [
  {
    path: '',
    component: PaletUbiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaletUbiPageRoutingModule {}
