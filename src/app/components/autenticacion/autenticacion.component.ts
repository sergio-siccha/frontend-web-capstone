import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import Swal from 'sweetalert2';
import {AuthObject, AuthRequest} from '../../models/auth-model';

@Component({
  selector: 'app-autenticacion',
  templateUrl: './autenticacion.component.html',
  styleUrls: ['./autenticacion.component.scss']
})
export class AutenticacionComponent implements OnInit {

  @Input() user: string;
  @Input() password: string;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  verificar(form: NgForm) {
    if (form.valid) {
      const request = new AuthRequest();
      request.numeroDocumento = this.user;
      request.clave = this.password;

      Swal.fire({
        title: 'Autenticando',
        text: 'Espere un momento por favor.',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      Swal.showLoading();

      this.authService.autenticacion(request).subscribe(response => {
        if (response.codigoRespuesta === '150') {
          this.authService.saveUser(response.objeto as unknown as AuthObject);
          this.authService.saveToken(this.authService.authObject.token);
          const usuario = this.authService.authObject;
          this.router.navigate(['/admin/inicio']).then(res => {
            Swal.close();
            Swal.fire({
              title: '¡Bienvenido!',
              text: `Hola ${usuario.nombre + ' ' + usuario.apellidoPaterno + ' ' + usuario.apellidoMaterno}, has iniciado sesión con éxito`,
              icon: 'success'
            });
          });
        } else {
          Swal.fire({
            title: '¡Oh no!',
            text: 'La credenciales son incorrectas.',
            icon: 'error'
          });
        }
      });
    }
  }

  clear() { }

}
