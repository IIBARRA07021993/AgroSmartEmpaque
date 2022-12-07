import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManVirtualPage } from './man-virtual.page';

const routes: Routes = [
  {
    path: '',
    component: ManVirtualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManVirtualPageRoutingModule {}
