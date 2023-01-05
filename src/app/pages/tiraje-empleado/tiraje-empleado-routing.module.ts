import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TirajeEmpleadoPage } from './tiraje-empleado.page';

const routes: Routes = [
  {
    path: '',
    component: TirajeEmpleadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TirajeEmpleadoPageRoutingModule {}
