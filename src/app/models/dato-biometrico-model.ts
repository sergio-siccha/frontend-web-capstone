import {PersonaModel} from './usuario-model';

export class DatoBiometrico {
  id: number;
  tipo: number;
  identificadorDato: number;
  imagenBiometrico: string;
  tipoImagen: number;
  templateBiometrico: string;
  tipoTemplate: number;
  fechaCreacion: Date;
  usuarioCreacion: string;
  fechaActualizacion: Date;
  usuarioActualizacion: string;
  estado: number;
  calidadBiometrica: number;
  persona: PersonaModel = new PersonaModel();
}

export class RegistroDBPersona {
  tipoDocumento: number;
  numeroDocumento: string;
  datosBiometricos: DatoBiometrico[] = [];
}

export class MejorHuella {
  identificadorDato: string;
  descripcionDato: string;
  tieneTemplate: boolean;
}

export class MarcarAsistenciaBody {
  tipoOperacion: number;
  tipoVerificacion: number;
  ipCliente: string;
  macCliente: string;
  nombreCompletoUsuario: string;
  tipoDocumento: number;
  numeroDocumento: string;
  numeroSerieDispositivo: string;
  identificadorDato: number;
  datoBiometrico: DatoBiometrico = new DatoBiometrico();
}




