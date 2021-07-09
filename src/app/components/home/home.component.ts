import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private username: string;

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    const usuario = this.authService.authObject;
    this.username = usuario.nombre + ' ' + usuario.apellidoPaterno + ' ' + usuario.apellidoMaterno;
  }

}
