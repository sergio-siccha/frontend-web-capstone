import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          console.log('Unauthorized');
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
            this.router.navigate(['/autenticacion']).then(r => {
              Swal.fire('¡Oh no!', `Su sesión ha expirado.`, 'error');
            });
          } else {
            this.router.navigate(['/autenticacion']);
          }
        }
        if (err.status === 403) {
          Swal.fire('¡Oh no!', `Hola ${this.authService.authObject.nombre}, no tienes acceso a este recurso.`, 'error');
          this.router.navigate(['/inicio']);
        }
        return throwError(err);
      })
    );
  }
}
