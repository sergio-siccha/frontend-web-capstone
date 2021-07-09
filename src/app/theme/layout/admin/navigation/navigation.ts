import {Injectable} from '@angular/core';

import {Router} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

@Injectable()
export class NavigationItem {
  private rol_admin = 'ROLE_ADMIN';
  private rol_usuario = 'ROLE_USER';

  public NavigationItems = [];

  private rolUser: string;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  get() {
    if (
      this.authService.authObject === null ||
      (
        typeof this.authService.authObject.username === 'undefined' &&
        typeof this.authService.authObject.roles === 'undefined'
      )
    ) {
      this.router.navigate(['/autenticacion']).then(r => {
        console.log('navigate: ', r);
      });
    } else {
      this.rolUser = this.authService.authObject.roles[0];
      if (this.rolUser === this.rol_admin) {
        this.NavigationItems = [
          {
            id: 'navigation',
            title: 'Navegación',
            type: 'group',
            icon: 'icon-navigation',
            children: [
              {
                id: 'inicio',
                title: 'Inicio',
                type: 'item',
                icon: 'feather icon-monitor',
                classes: 'nav-item',
                url: '/admin/inicio',
              },
              {
                id: 'usuario',
                title: 'Usuario',
                type: 'item',
                icon: 'feather icon-users',
                classes: 'nav-item',
                url: '/admin/usuario',
              },
              {
                id: 'asistencia',
                title: 'Asistencia',
                type: 'collapse',
                icon: 'feather icon-user-check',
                children: [
                  {
                    id: 'marcarEntrada',
                    title: 'Marcar Entrada',
                    type: 'item',
                    icon: 'feather icon-log-in',
                    classes: 'nav-item',
                    url: '/admin/entrada',
                  },
                  {
                    id: 'marcarSalida',
                    title: 'Marcar Salida',
                    type: 'item',
                    icon: 'feather icon-log-out',
                    classes: 'nav-item',
                    url: '/admin/salida',
                  }
                ]
              },
              /*{
                id: 'transaccion',
                title: 'Transacciones',
                type: 'item',
                icon: 'feather icon-feather',
                classes: 'nav-item',
                url: '/admin/transaccion',
              },*/
            ]
          }];
      } else if (this.rolUser === this.rol_usuario) {
        this.NavigationItems = [
          {
            id: 'navigation',
            title: 'Navegación',
            type: 'group',
            icon: 'icon-navigation',
            children: [
              {
                id: 'inicio',
                title: 'Inicio',
                type: 'item',
                icon: 'feather icon-monitor',
                classes: 'nav-item',
                url: '/admin/inicio',
              },
              {
                id: 'asistencia',
                title: 'Asistencia',
                type: 'collapse',
                icon: 'feather icon-user-check',
                children: [
                  {
                    id: 'marcarEntrada',
                    title: 'Marcar Entrada',
                    type: 'item',
                    icon: 'feather icon-log-in',
                    classes: 'nav-item',
                    url: '/admin/entrada',
                  },
                  {
                    id: 'marcarSalida',
                    title: 'Marcar Salida',
                    type: 'item',
                    icon: 'feather icon-log-out',
                    classes: 'nav-item',
                    url: '/admin/salida',
                  }
                ]
              }
            ]
          }];
      }
    }
    return this.NavigationItems;
  }
}
