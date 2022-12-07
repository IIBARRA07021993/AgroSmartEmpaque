
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'total'
})
export class TotalPipe implements PipeTransform {

  transform( array: any[], columna: string ): string {
    let total = 0;
    array.forEach(element => {
        total += element[columna];

    });
     return total.toString();

  }

}
