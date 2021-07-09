export class Usuario {
  id: number;
  fechaCreacion: Date;
  estado: number;
  persona: PersonaModel = new PersonaModel();
}

export class PersonaModel {
  personaIdModel: PersonaIdModel = new PersonaIdModel();
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  ubigeo: string;
  fechaNacimiento: Date;
  genero: number;
  direccion: string;
  correo: string;
}

export class PersonaIdModel {
  tipoDocumento: number;
  numeroDocumento: string;
}

export class Rol {
  id: number;
  nombre: string;
}

export class UsuariosResponse {
  usuarios: Usuario[];
}

export class CrearUsuarioRequest {
  tipoDocumento: number;
  numeroDocumento: string;
  clave: string;
  estado: number;
  correo: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  direccion: string;
  genero: number;
  roles: Array<String> = new Array<String>();
}




