import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseCapturaBiometrica, ResponseSerialNumber} from '../models/agente-local';


@Injectable({
  providedIn: 'root'
})
export class AgenteLocalService {
  private baseUrl = environment.dactilarUrl + 'biometriaService';
  // Credenciales para la autenticación básica con el agente local
  private user_basic_auth = environment.user_basic_auth_al;
  private password_basic_auth = environment.password_basic_auth_al;

  private httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'x-requested-with': 'XMLHttpRequest',
      Authorization: 'Basic ' + btoa(this.user_basic_auth + ':' + this.password_basic_auth)
    })
  };

  constructor(private http: HttpClient) {
  }

  capturaBiometrica(): Observable<ResponseCapturaBiometrica> {
    return this.http.get<ResponseCapturaBiometrica>(this.baseUrl + '/capturaBiometrica/', this.httpOptions);
  }

  getSerialNumber(): Observable<ResponseSerialNumber> {
    return this.http.get<ResponseSerialNumber>(this.baseUrl + '/getSerialNumber/', this.httpOptions);
  }
}
