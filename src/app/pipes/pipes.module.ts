import { NgModule } from '@angular/core';

import { FiltroPipe } from './filtro.pipe';
import { TotalPipe } from './total.pipe';



@NgModule({
  declarations: [
    FiltroPipe,
    TotalPipe],
  exports:
    [FiltroPipe, TotalPipe]

})
export class PipesModule { }
