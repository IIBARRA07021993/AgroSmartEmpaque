import { NgModule } from '@angular/core';

import { FiltroPipe } from './filtro.pipe';
import { TotalPipe } from './total.pipe';
import { FillPipe } from './fill.pipe';

@NgModule({
  declarations: [FiltroPipe, TotalPipe, FillPipe],
  exports: [FiltroPipe, TotalPipe,FillPipe],
})
export class PipesModule {}
