import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArmadoPalPage } from './armado-pal.page';

const routes: Routes = [
  {
    path: '',
    component: ArmadoPalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArmadoPalPageRoutingModule {}
