export class GenericalResponse {
  codigoRespuesta: string;
  descRespuesta: string;
  objeto: Object;
}

export class AuthObject {
  token: string;
  id: number;
  username: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  genero: number;
  roles: string[] = [];
}

export class AuthRequest {
  numeroDocumento: string;
  clave: string;
}





