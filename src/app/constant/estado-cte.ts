import {Estado, EstadoDocumento} from './enum/estado.enum';

export const ESTADOS = [
  {
    descripcion: Estado.ACTIVO,
    codigo: Estado.ACTIVO_VALOR
  },
  {
    descripcion: Estado.INACTIVO,
    codigo: Estado.INACTIVO_VALOR
  }
];

export const ESTADOS_DOCUMENTO = [
  {
    descripcion: EstadoDocumento.SIN_FIRMA,
    codigo: EstadoDocumento.SIN_FIRMA_VALOR
  },
  {
    descripcion: EstadoDocumento.FIRMADO,
    codigo: EstadoDocumento.FIRMADO_VALOR
  }
]
