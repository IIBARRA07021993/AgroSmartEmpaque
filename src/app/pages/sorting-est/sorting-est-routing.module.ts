import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SortingEstPage } from './sorting-est.page';

const routes: Routes = [
  {
    path: '',
    component: SortingEstPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SortingEstPageRoutingModule {}
