import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estado'
})
export class EstadoPipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) {
      return 'ACTIVO';
    } else if (value === 1) {
      return 'INACTIVO';
    } else {
      return 'NO DEFINIDO';
    }
  }

}
