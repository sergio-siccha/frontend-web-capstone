import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LOCALE_ID, NgModule} from '@angular/core';
import localeEs from '@angular/common/locales/es-PE';

import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './theme/shared/shared.module';
import {AppComponent} from './app.component';
import {AdminComponent} from './theme/layout/admin/admin.component';
import {AuthComponent} from './theme/layout/auth/auth.component';
import {NavigationComponent} from './theme/layout/admin/navigation/navigation.component';
import {NavLogoComponent} from './theme/layout/admin/navigation/nav-logo/nav-logo.component';
import {NavContentComponent} from './theme/layout/admin/navigation/nav-content/nav-content.component';
import {NavigationItem} from './theme/layout/admin/navigation/navigation';
import {NavGroupComponent} from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import {NavCollapseComponent} from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import {NavItemComponent} from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import {NavBarComponent} from './theme/layout/admin/nav-bar/nav-bar.component';
import {ToggleFullScreenDirective} from './theme/shared/full-screen/toggle-full-screen';
import {NgbButtonsModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {NavLeftComponent} from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import {NavSearchComponent} from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import {NavRightComponent} from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import {ChatUserListComponent} from './theme/layout/admin/nav-bar/nav-right/chat-user-list/chat-user-list.component';
import {FriendComponent} from './theme/layout/admin/nav-bar/nav-right/chat-user-list/friend/friend.component';
import {ChatMsgComponent} from './theme/layout/admin/nav-bar/nav-right/chat-msg/chat-msg.component';
import {ConfigurationComponent} from './theme/layout/admin/configuration/configuration.component';
import {AutenticacionComponent} from './components/autenticacion/autenticacion.component';
import {ToastyModule} from 'ng2-toasty';
import {registerLocaleData} from '@angular/common';
import {DataTablesModule} from 'angular-datatables';
import {ShContextMenuModule} from 'ng2-right-click-menu';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ArchwizardModule} from 'angular-archwizard';
import {WebcamModule} from 'ngx-webcam';
import {NgxSmartModalModule} from 'ngx-smart-modal';
import {PaginationModule} from 'ngx-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CustomFormsModule} from 'ng2-validation';
import { RecuperarContraseniaComponent } from './components/autenticacion/recuperar-contrasenia/recuperar-contrasenia.component';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import { HomeComponent } from './components/home/home.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import {ToolsComponent} from './components/shared/tools/tools.component';
import {EstadoPipe} from './pipes/estado.pipe';
import {EstadoDocumentoPipe} from './pipes/estado-documento.pipe';
import { CrearUsuarioComponent } from './components/usuario/crear/crear-usuario.component';
import { ActualizarUsuarioComponent } from './components/usuario/actualizar/actualizar-usuario.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import {ConfiguracionPlantillaComponent} from './components/configuracion/configuracion-plantilla/configuracion-plantilla.component';
import {TokenInterceptor} from './interceptors/token.interceptor';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    NavigationComponent,
    NavLogoComponent,
    NavContentComponent,
    NavGroupComponent,
    NavCollapseComponent,
    NavItemComponent,
    NavBarComponent,
    ToggleFullScreenDirective,
    NavLeftComponent,
    NavSearchComponent,
    NavRightComponent,
    ChatUserListComponent,
    FriendComponent,
    ChatMsgComponent,
    ConfigurationComponent,
    AutenticacionComponent,
    RecuperarContraseniaComponent,
    HomeComponent,
    UsuarioComponent,
    ToolsComponent,
    EstadoPipe,
    EstadoDocumentoPipe,
    CrearUsuarioComponent,
    ActualizarUsuarioComponent,
    ConfiguracionComponent,
    ConfiguracionPlantillaComponent,
    AsistenciaComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    ToastyModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    DataTablesModule,
    ArchwizardModule,
    ShContextMenuModule,
    WebcamModule,
    PaginationModule.forRoot(),
    NgSelectModule,
    FontAwesomeModule,
    CustomFormsModule,
    NgxDropzoneModule,
    PdfViewerModule,
    DragDropModule,
  ],
  providers: [
    NavigationItem,
    {provide: LOCALE_ID, useValue: 'es-PE'},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
