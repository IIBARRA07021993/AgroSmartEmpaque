import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fill',
})
export class FillPipe implements PipeTransform {
  transform(number: string, len: number, dato: string): string {
    if (number !== null && number !== '') {
      const resultado =
        dato.repeat(len - number.toString().length) + number.toString();
      console.log(resultado);
      return resultado.toString();
    }
    return '';
  }
}
