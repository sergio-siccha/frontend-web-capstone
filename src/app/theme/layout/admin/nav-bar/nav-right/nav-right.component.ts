import {Component, DoCheck, OnInit} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {animate, style, transition, trigger} from '@angular/animations';
import {DattaConfig} from '../../../../../app-config';
import {Router} from '@angular/router';
import {AuthService} from '../../../../../services/auth.service';
import {AuthObject} from '../../../../../models/auth-model';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('300ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('300ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ]
})
export class NavRightComponent implements OnInit, DoCheck {
  public visibleUserList: boolean;
  public chatMessage: boolean;
  public friendId: boolean;
  public dattaConfig: any;
  public usuario: AuthObject;
  avatar: string;
  nombreCompleto: string;

  constructor(
    config: NgbDropdownConfig,
    private authService: AuthService,
    private router: Router
  ) {
    config.placement = 'bottom-right';
    this.visibleUserList = false;
    this.chatMessage = false;
    this.dattaConfig = DattaConfig.config;
    this.usuario = this.authService.authObject;
  }

  ngOnInit() {
    this.avatar = 'assets/images/user/avatar-2.jpg';
    this.nombreCompleto = this.usuario.nombre + ' ' + this.usuario.apellidoPaterno + ' ' + this.usuario.apellidoMaterno;
   /* this.authService.usuarioRx.subscribe(response => {
      if (response.avatar !== null) {
        this.avatar = 'data:image/jpeg;base64,' + response.avatar;
      } else {
        if (Number(response.genero) === (Genero.FEMENINO_VALOR as number)) {
          this.avatar = 'assets/images/user/avatar-1.jpg';
        } else {
          this.avatar = 'assets/images/user/avatar-2.jpg';
        }
      }
    });*/
  }

  onChatToggle(friend_id) {
    this.friendId = friend_id;
    this.chatMessage = !this.chatMessage;
  }

  ngDoCheck() {
    if (document.querySelector('body').classList.contains('datta-rtl')) {
      this.dattaConfig['rtl-layout'] = true;
    } else {
      this.dattaConfig['rtl-layout'] = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/autenticacion']);
  }
}
