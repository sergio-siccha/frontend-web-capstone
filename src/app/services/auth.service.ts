import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthObject, AuthRequest, GenericalResponse} from '../models/auth-model';

@Injectable(({
  providedIn: 'root'
}))
export class AuthService {
  private baseUrl = environment.baseUrl + 'v1/usuario';

  private _auth: BehaviorSubject<AuthObject>;
  private _username: string;
  private _token: string;
  private _esCapturaBiometrica: boolean;

  constructor(private http: HttpClient) {
    this._auth = new BehaviorSubject<AuthObject>(new AuthObject());
    this._esCapturaBiometrica = false;
  }

  get esCaptura(): boolean {
    return this._esCapturaBiometrica;
  }

  set esCaptura(esCaptura) {
    this._esCapturaBiometrica = esCaptura;
  }

  get usuario(): string {
    return this._username;
  }

  set usuario(user) {
    this._username = user;
  }

  public get authObjectRx(): BehaviorSubject<AuthObject> {
    return this._auth;
  }

  public get authObject(): AuthObject {
    if (sessionStorage.getItem('authObject') !== 'undefined') {
      this._auth.next(JSON.parse(sessionStorage.getItem('authObject')) as AuthObject);
      return this._auth.getValue();
    } else {
      return this._auth.getValue();
    }
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  getDataToken(accessToken: string): any {
    if (accessToken !== null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    const payload = this.getDataToken(this.token);
    return payload !== null;
  }

  logout() {
    this._auth.next(new AuthObject());
    this._token = null;
    sessionStorage.clear();
  }

  saveUser(authObject: AuthObject): void {
    this._auth.next(authObject);
    sessionStorage.setItem('authObject', JSON.stringify(authObject));
  }

  saveToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  autenticacion(request: AuthRequest): Observable<GenericalResponse> {
    return this.http.post<GenericalResponse>(this.baseUrl + '/auth/autenticacion', request);
  }
}
