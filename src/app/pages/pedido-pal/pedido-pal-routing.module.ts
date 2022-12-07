import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoPalPage } from './pedido-pal.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoPalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoPalPageRoutingModule {}
