import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SortingPalPage } from './sorting-pal.page';

const routes: Routes = [
  {
    path: '',
    component: SortingPalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SortingPalPageRoutingModule {}
