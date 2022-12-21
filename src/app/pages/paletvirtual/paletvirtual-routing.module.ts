import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaletvirtualPage } from './paletvirtual.page';

const routes: Routes = [
  {
    path: '',
    component: PaletvirtualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaletvirtualPageRoutingModule {}
