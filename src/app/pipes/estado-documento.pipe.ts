import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoDocumento'
})
export class EstadoDocumentoPipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) {
      return 'SIN FIRMAR';
    } else if (value === 1) {
      return 'FIRMADO';
    } else {
      return 'NO DEFINIDO';
    }
  }

}
