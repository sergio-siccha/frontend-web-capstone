import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {GenericalResponse} from '../models/auth-model';
import {MarcarAsistenciaBody, RegistroDBPersona} from '../models/dato-biometrico-model';

@Injectable(({
  providedIn: 'root'
}))
export class DatoBiometricoService {
  private baseUrl = environment.baseUrl + 'v1/datoBiometrico';

  constructor(private http: HttpClient) {
  }

  saveByPersona(request: RegistroDBPersona): Observable<GenericalResponse> {
    return this.http.post<GenericalResponse>(this.baseUrl + '/saveByPersona/', request);
  }

  getMejoresHuellas(tipoDocumento: number, numeroDocumento: string): Observable<GenericalResponse> {
    return this.http.get<GenericalResponse>(this.baseUrl + '/getMejoresHuellas/' + tipoDocumento + '/' + numeroDocumento);
  }

  marcarAsistencia(request: MarcarAsistenciaBody): Observable<GenericalResponse> {
    return this.http.post<GenericalResponse>(this.baseUrl + '/asistencia/iniciar', request);
  }

  getStatus(numeroDocumento: string): Observable<GenericalResponse> {
    return this.http.get<GenericalResponse>(this.baseUrl + '/getStatus/' + numeroDocumento);
  }
}
