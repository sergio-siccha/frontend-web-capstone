import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {GenericalResponse} from '../models/auth-model';
import {CrearUsuarioRequest} from '../models/usuario-model';

@Injectable(({
  providedIn: 'root'
}))
export class UsuarioService {
  private baseUrl = environment.baseUrl + 'v1/usuario';
  private readonly _refreshUsuario: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    this._refreshUsuario = new BehaviorSubject<boolean>(false);
  }

  get refreshUsuario(): BehaviorSubject<boolean> {
    return this._refreshUsuario;
  }

  getAll(): Observable<GenericalResponse> {
    return this.http.get<GenericalResponse>(this.baseUrl);
  }

  registroUsuario(request: CrearUsuarioRequest): Observable<GenericalResponse> {
    return this.http.post<GenericalResponse>(this.baseUrl + '/auth/registro', request);
  }

  deleteOne(nroDocumento: string): Observable<GenericalResponse> {
    return this.http.delete<GenericalResponse>(this.baseUrl + '/' + nroDocumento);
  }
}
