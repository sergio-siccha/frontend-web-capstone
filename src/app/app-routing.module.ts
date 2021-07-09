import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './theme/layout/admin/admin.component';
import {AuthComponent} from './theme/layout/auth/auth.component';
import {AutenticacionComponent} from './components/autenticacion/autenticacion.component';
import {HomeComponent} from './components/home/home.component';
import {UsuarioComponent} from './components/usuario/usuario.component';
import {ConfiguracionComponent} from './components/configuracion/configuracion.component';
import {ConfiguracionPlantillaComponent} from './components/configuracion/configuracion-plantilla/configuracion-plantilla.component';
import {AsistenciaComponent} from './components/asistencia/asistencia.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'autenticacion'
      },
      {
        path: 'autenticacion',
        component: AutenticacionComponent
      },
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'inicio',
        component: HomeComponent
      },
      {
        path: 'usuario',
        component: UsuarioComponent
      },
      {
        path: 'entrada',
        component: AsistenciaComponent
      },
      {
        path: 'salida',
        component: AsistenciaComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
