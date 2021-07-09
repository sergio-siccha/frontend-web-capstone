import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import Swal from 'sweetalert2';
import {DatoBiometricoService} from '../../services/dato-biometrico.service';
import {MarcarAsistenciaBody, MejorHuella} from '../../models/dato-biometrico-model';
import {WizardComponent} from 'angular-archwizard';
import {Router} from '@angular/router';
import {AgenteLocalService} from '../../services/dispositivos-biometricos.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.scss']
})
export class AsistenciaComponent implements OnInit, AfterViewInit {
  @ViewChild(WizardComponent, {static: false}) wizard: WizardComponent;

  @Input() numeroDocumento: string;

  isSubmit: boolean;
  mejoresHuellas: MejorHuella[];
  requestAsistencia: MarcarAsistenciaBody;
  esAdmin: boolean;

  length: string;
  validar: number;
  numDedo1: string;
  numDedo2: string;
  dedoIzquierdo: string;
  dedoDerecho: string;
  huellaDerecha: string;
  huellaIzquierda: string;
  template: string;
  numeroIntentos: number;
  tipoOperacion: number;
  codigoErrorServicio: string;

  intento11 = '#D0D0D0';
  intento12 = '#D0D0D0';
  intento21 = '#D0D0D0';
  intento22 = '#D0D0D0';

  dedoInhabilitado1: boolean;
  dedoInhabilitado2: boolean;
  activarCheckbox1: boolean;
  activarCheckbox2: boolean;

  manoIzquierdaActivada: boolean;
  desactivarBtnCapturarDerecho: boolean;
  btnCapturarIzquierdo: boolean;

  mathching: boolean;

  vecesClick: number;

  constructor(private datoBiometricoService: DatoBiometricoService,
              private agenteLocalService: AgenteLocalService,
              private authService: AuthService,
              private router: Router,
              private cdRef: ChangeDetectorRef) {
    this.numeroDocumento = '';
    this.isSubmit = false;
    this.mejoresHuellas = [];
    this.requestAsistencia = new MarcarAsistenciaBody();

    this.validar = 0;
    this.length = '8';
    this.vecesClick = 0;

    this.template = null;
    this.dedoIzquierdo = 'MANOIZQUIERDA';
    this.dedoDerecho = 'MANODERECHA';
    this.huellaDerecha = './assets/images/test/identificacion.svg';
    this.huellaIzquierda = './assets/images/test/identificacion.svg';
    this.numeroIntentos = 0;
    this.tipoOperacion = 0;
    this.codigoErrorServicio = undefined;

    this.intento11 = '#D0D0D0';
    this.intento12 = '#D0D0D0';
    this.intento21 = '#D0D0D0';
    this.intento22 = '#D0D0D0';
    this.dedoInhabilitado1 = false;
    this.dedoInhabilitado2 = true;
    this.activarCheckbox1 = false;
    this.activarCheckbox2 = false;

    this.manoIzquierdaActivada = false;
    this.desactivarBtnCapturarDerecho = false;
    this.btnCapturarIzquierdo = false;

    this.mathching = false;
    this.esAdmin = false;
  }

  ngOnInit() {
    this.tipoOperacion = (this.router.url === '/admin/entrada') ? 1 : 2;
    this.requestAsistencia.tipoOperacion = this.tipoOperacion;
    this.requestAsistencia.tipoVerificacion = 1;
    this.requestAsistencia.tipoDocumento = 1;
    this.requestAsistencia.nombreCompletoUsuario = this.authService.authObject.nombre + ' ' +
      this.authService.authObject.apellidoPaterno + ' ' + this.authService.authObject.apellidoMaterno;
    this.esAdmin = this.authService.authObject.roles[0] === 'ROLE_ADMIN';
    if (!this.esAdmin) {
      this.numeroDocumento = this.authService.authObject.username;
      this.validarStatus();
    }
  }

  validarStatus() {
    this.datoBiometricoService.getStatus(this.numeroDocumento).toPromise().then(response => {
      if (this.tipoOperacion === 1) {
        if (response.codigoRespuesta === '215') {
          this.buscarPorNumeroDocumento();
        } else if (response.codigoRespuesta === '216') {
          Swal.fire('¡Oh no!', (this.esAdmin) ?
            'El usuario ya ha marcado su ingreso el día de hoy.' :
            'Usted ya marcó su ingreso el día de hoy.', 'error');
          this.router.navigate(['/admin/inicio']);
        } else if (response.codigoRespuesta === '217') {
          Swal.fire('¡Oh no!', (this.esAdmin) ?
            'El usuario ya marcó su ingreso y salida el día de hoy.' :
            'Usted ya marcó su ingreso y salida el día de hoy.', 'error');
          this.router.navigate(['/admin/inicio']);
        }
      } else {
        if (response.codigoRespuesta === '216') {
          this.buscarPorNumeroDocumento();
        } else if (response.codigoRespuesta === '215') {
          Swal.fire('¡Oh no!', 'Primero debe marcar su ingreso antes de marcar su salida.', 'error');
          this.router.navigate(['/admin/inicio']);
        } else if (response.codigoRespuesta === '217') {
          Swal.fire('¡Oh no!', (this.esAdmin) ?
            'El usuario ya marcó su ingreso y salida el día de hoy.' :
            'Usted ya marcó su ingreso y salida el día de hoy.', 'error');
          this.router.navigate(['/admin/inicio']);
        }
      }
    }).catch(err => {
      Swal.fire('¡Oh no!', 'Ocurrió un error al consultar el servicio biométrico.', 'error');
    });
  }

  buscarPorNumeroDocumento() {
    // if (form.valid) {
      // @ts-ignore
      form['subm  itted'] = false;
      Swal.fire({
        title: '!BUSCANDO HUELLAS!',
        text: 'Por favor, espere ... ',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      Swal.showLoading();

      this.isSubmit = true;

      this.datoBiometricoService
        .getMejoresHuellas(1, this.numeroDocumento)
        .toPromise().then(async response => {
          if (response.codigoRespuesta === '00') {
            this.mejoresHuellas = <MejorHuella[]> response.objeto;

            let tienenTemplate = true;

            for (const mHuella of this.mejoresHuellas) { if (!mHuella.tieneTemplate) { tienenTemplate = false; } }

            if (tienenTemplate) {
              this.numDedo1 = this.mejoresHuellas[1].descripcionDato.toUpperCase();
              this.numDedo2 = this.mejoresHuellas[0].descripcionDato.toUpperCase();
              this.dedoIzquierdo = this.mejoresHuellas[1].identificadorDato.replace(/^0+/, '');
              this.dedoDerecho = this.mejoresHuellas[0].identificadorDato.replace(/^0+/, '');
              this.validar = 1;
              this.requestAsistencia.numeroDocumento = this.numeroDocumento;

              Swal.fire({
                title: '!Genial!',
                text: 'Consulta de huellas exitosa',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
              });
            } else {
              Swal.fire('¡Oh no!', 'Alguna de las huellas ingresadas no tiene template biométrico registrado.', 'error');
            }
          } else {
            Swal.fire('¡Oh no!', response.descRespuesta, 'error');
          }
        }).catch(err => {
          Swal.fire('¡Oh no!', 'Ocurrió un error al consultar el servicio biométrico.', 'error');
          this.limpiar();
        });
    // }
  }

  async capturar() {
    if (this.vecesClick === 0) {
      this.vecesClick++;

      if (this.dedoInhabilitado2) {
        Swal.fire({
          title: '!Captura!',
          html: 'Coloque el' + '<br>' + '<strong>' + this.numDedo1 + '</strong>' + '<br>' + 'sobre el lector de huella',
          icon: 'info',
          allowOutsideClick: false,
          position: 'center',
          allowEscapeKey: false
        });
        Swal.showLoading();
      } else if (this.dedoInhabilitado1) {
        Swal.fire({
          title: '!Captura!',
          html: 'Coloque el' + '<br>' + '<strong>' + this.numDedo2 + '</strong>' + '<br>' + 'sobre el lector de huella',
          icon: 'info',
          allowOutsideClick: false,
          position: 'center',
          allowEscapeKey: false
        });
        Swal.showLoading();
      }

      this.authService.esCaptura = true; // Indicando al interceptor que se trata de una captura biometrica
      await this.agenteLocalService.capturaBiometrica().toPromise().then(captura => {
        this.authService.esCaptura = false; // Indicando al interceptor que ya se finalizo la captura biomerica
        if (captura.codRespuesta === 2000 && captura.dataTemplate !== null && captura.dataImagen !== null) {
          Swal.close();
          this.requestAsistencia.datoBiometrico.imagenBiometrico = captura.dataTemplate;

          this.template = captura.dataTemplate;

          if (this.manoIzquierdaActivada === false) {
            this.requestAsistencia.identificadorDato = Number(this.dedoIzquierdo);
          } else {
            this.requestAsistencia.identificadorDato = Number(this.dedoDerecho);
          }

          if (this.template != null) {
            if (this.dedoInhabilitado2) {
              this.huellaDerecha = 'data:image/jpeg;base64,' + captura.dataImagen;
            } else if (this.dedoInhabilitado1) {
              this.huellaIzquierda = 'data:image/jpeg;base64,' + captura.dataImagen;
            }
            Swal.fire({
              title: '!Genial!',
              text: 'Se ha capturado la huella',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false
            });
            this.vecesClick = 0;
          }
        }
      }).catch(err => {
        Swal.fire('¡Oh no!', 'Huella no capturada ' + '\n' +
          err.descRespuesta, 'error');
        this.vecesClick = 0;
      });
    }
  }

  checkbox1() {
    if (this.activarCheckbox1 === false) {
      this.dedoInhabilitado1 = true;
      this.dedoInhabilitado2 = false;
      this.numeroIntentos = 0;
      this.template = null;
      this.huellaDerecha = './assets/images/test/identificacion.svg';

      this.manoIzquierdaActivada = true;
      this.desactivarBtnCapturarDerecho = true;
    } else {
      this.dedoInhabilitado2 = true;
      this.dedoInhabilitado1 = false;
      this.desactivarBtnCapturarDerecho = false;
      this.huellaIzquierda = './assets/images/test/identificacion.svg';
      this.template = null;
    }
  }

  checkbox2() {
    this.activarCheckbox1 = false;
    this.activarCheckbox2 = false;
    this.dedoInhabilitado1 = true;
    this.dedoInhabilitado2 = true;
    Swal.fire({
      title: '¡Oh, no!',
      html: 'No se ha podido capturar los dedos habilitados',
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#f44236',
      confirmButtonText: 'Aceptar',
    }).then(
      confirmed => {
        if (confirmed) {
          this.limpiar();
        }
      });
  }

  async verificar() {
    await this.datoBiometricoService.marcarAsistencia(this.requestAsistencia).toPromise().then(response => {
      this.codigoErrorServicio = response.codigoRespuesta;
    }).catch(err => {
      Swal.fire('¡Oh no!', 'Ocurrió un error al consultar el servicio de asistencia.', 'error');
    });
  }

  async next() {
    if (this.esAdmin) {
      if (this.wizard.currentStepIndex === 0) {
        if (this.validar === 1) {
          this.wizard.goToNextStep();
        } else {
          Swal.fire({
            title: '¡Oh no!',
            text: 'No se ha realizado la búsqueda de la Huellas Registradas',
            timer: 3000,
            icon: 'warning'
          });
        }
      } else if (this.wizard.currentStepIndex === 1) {
        if (this.template != null && this.numeroIntentos === 0) {
          Swal.fire({
            title: '!Verificando!',
            text: 'Marcando asistencia del usuario. Por favor espere...',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          Swal.showLoading();
          setTimeout(async () => {
            await this.verificar();
            Swal.close();
            this.numeroIntentos++;
            console.log('el numero de intentos que se hace ' + this.numeroIntentos);
            console.log('el resultado es  de la comparacion ? ' + this.codigoErrorServicio);
            if (this.codigoErrorServicio === '200' && this.numeroIntentos === 1) {
              console.log('primera pintada');
              if (this.dedoInhabilitado2) {
                this.intento11 = '#34b484';
                this.wizard.goToNextStep();
              } else if (this.dedoInhabilitado1) {
                this.intento21 = '#34b484';
                this.wizard.goToNextStep();
              }
              Swal.fire({
                title: '!Genial!',
                text: (this.tipoOperacion === 1) ?
                  'El usuario con número de documento ' + this.numeroDocumento + ' marcó entrada correctamente.' :
                  'El usuario con número de documento ' + this.numeroDocumento + ' marcó salida correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
              });
              this.router.navigate(['/admin/inicio']);
            } else if (this.codigoErrorServicio === '203' && this.numeroIntentos === 1) {
              if (this.dedoInhabilitado2) {
                this.intento11 = '#f44236';
              } else if (this.dedoInhabilitado1) {
                this.intento21 = '#f44236';
              }
              Swal.fire({
                title: '¡Oh, no!',
                html: 'La identidad Biométrica NO corresponde al DNI consultado(NO HIT)' + '<br>' + '¿ Desea realizar otro intento ?',
                icon: 'error',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonColor: '#34b484',
                cancelButtonColor: '#f44236',
                cancelButtonText: 'No',
                confirmButtonText: 'Si',
              }).then(
                confirmed => {
                  if (confirmed.value) {
                    if (this.dedoInhabilitado2) {
                      this.intento11 = '#f44236';
                      this.template = null;
                      this.huellaDerecha = './assets/images/test/identificacion.svg';
                    } else if (this.dedoInhabilitado1) {
                      this.template = null;
                      this.intento21 = '#f44236';
                      this.huellaIzquierda = './assets/images/test/identificacion.svg';
                      this.btnCapturarIzquierdo = true;
                    }
                  } else if (confirmed.dismiss) {
                    this.limpiar();
                  }
                });

            } else {
              Swal.fire('¡Oh no!', 'Ocurrió un error al consultar el servicio de asistencia.', 'error');
            }
          }, 1000);
        } else if (this.template != null && this.numeroIntentos === 1) {
          Swal.fire({
            title: '!Verificando!',
            text: 'Marcando asistencia del usuario. Por favor espere...',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          Swal.showLoading();
          setTimeout(async () => {
            await this.verificar();
            Swal.close();
            this.numeroIntentos++;
            if (this.codigoErrorServicio === '200' && this.numeroIntentos === 2) {
              if (this.dedoInhabilitado2) {
                this.intento12 = '#34b484';
                this.wizard.goToNextStep();
              } else if (this.dedoInhabilitado1) {
                this.intento22 = '#34b484';
                this.wizard.goToNextStep();
              }
              Swal.fire({
                title: '!Genial!',
                text: (this.tipoOperacion === 1) ?
                  'El usuario con número de documento ' + this.numeroDocumento + ' marcó entrada correctamente.' :
                  'El usuario con número de documento ' + this.numeroDocumento + ' marcó salida correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
              });
              this.router.navigate(['/admin/inicio']);
            } else {
              if (this.dedoInhabilitado2) {
                this.manoIzquierdaActivada = true;
                // console.log('Ingreso al segundo intento por error ');
                this.wizard.goToNextStep();
                this.intento12 = '#f44236';
              } else if (this.dedoInhabilitado1) {
                this.manoIzquierdaActivada = false;
                this.intento22 = '#f44236';
                this.wizard.goToNextStep();
              }
              Swal.fire('¡Oh no!', (this.tipoOperacion === 1) ?
                'No se pudo marcar el ingreso del usuario.' :
                'No se pudo marcar la salida del usuario.', 'error');
              this.router.navigate(['/admin/inicio']);
            }
          }, 1000);
        } else {
          Swal.fire({
            title: '¡Oh no!',
            text: 'No hay huellas capturadas.',
            timer: 3000,
            icon: 'warning'
          });
        }
      }
    } else {
      if (this.wizard.currentStepIndex === 0) {
        if (this.template != null && this.numeroIntentos === 0) {
          Swal.fire({
            title: '!Verificando!',
            text: 'Marcando asistencia del usuario. Por favor espere...',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          Swal.showLoading();
          setTimeout(async () => {
            await this.verificar();
            Swal.close();
            this.numeroIntentos++;
            console.log('el numero de intentos que se hace ' + this.numeroIntentos);
            console.log('el resultado es  de la comparacion ? ' + this.codigoErrorServicio);
            if (this.codigoErrorServicio === '200' && this.numeroIntentos === 1) {
              console.log('primera pintada');
              if (this.dedoInhabilitado2) {
                this.intento11 = '#34b484';
                this.wizard.goToNextStep();
              } else if (this.dedoInhabilitado1) {
                this.intento21 = '#34b484';
                this.wizard.goToNextStep();
              }
              Swal.fire({
                title: '!Genial!',
                text: (this.tipoOperacion === 1) ?
                  'El usuario con número de documento ' + this.numeroDocumento + ' marcó entrada correctamente.' :
                  'El usuario con número de documento ' + this.numeroDocumento + ' marcó salida correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
              });
              this.router.navigate(['/admin/inicio']);
            } else if (this.codigoErrorServicio === '203' && this.numeroIntentos === 1) {
              if (this.dedoInhabilitado2) {
                this.intento11 = '#f44236';
              } else if (this.dedoInhabilitado1) {
                this.intento21 = '#f44236';
              }
              Swal.fire({
                title: '¡Oh, no!',
                html: 'La identidad Biométrica NO corresponde al DNI consultado(NO HIT)' + '<br>' + '¿ Desea realizar otro intento ?',
                icon: 'error',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonColor: '#34b484',
                cancelButtonColor: '#f44236',
                cancelButtonText: 'No',
                confirmButtonText: 'Si',
              }).then(
                confirmed => {
                  if (confirmed.value) {
                    if (this.dedoInhabilitado2) {
                      this.intento11 = '#f44236';
                      this.template = null;
                      this.huellaDerecha = './assets/images/test/identificacion.svg';
                    } else if (this.dedoInhabilitado1) {
                      this.template = null;
                      this.intento21 = '#f44236';
                      this.huellaIzquierda = './assets/images/test/identificacion.svg';
                      this.btnCapturarIzquierdo = true;
                    }
                  } else if (confirmed.dismiss) {
                    this.limpiar();
                  }
                });

            } else {
              Swal.fire('¡Oh no!', 'Ocurrió un error al consultar el servicio de asistencia.', 'error');
            }
          }, 1000);
        } else if (this.template != null && this.numeroIntentos === 1) {
          Swal.fire({
            title: '!Verificando!',
            text: 'Marcando asistencia del usuario. Por favor espere...',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          Swal.showLoading();
          setTimeout(async () => {
            await this.verificar();
            Swal.close();
            this.numeroIntentos++;
            if (this.codigoErrorServicio === '200' && this.numeroIntentos === 2) {
              if (this.dedoInhabilitado2) {
                this.intento12 = '#34b484';
                this.wizard.goToNextStep();
              } else if (this.dedoInhabilitado1) {
                this.intento22 = '#34b484';
                this.wizard.goToNextStep();
              }
              Swal.fire({
                title: '!Genial!',
                text: (this.tipoOperacion === 1) ?
                  'El usuario con número de documento ' + this.numeroDocumento + ' marcó entrada correctamente.' :
                  'El usuario con número de documento ' + this.numeroDocumento + ' marcó salida correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false
              });
              this.router.navigate(['/admin/inicio']);
            } else {
              if (this.dedoInhabilitado2) {
                this.manoIzquierdaActivada = true;
                // console.log('Ingreso al segundo intento por error ');
                this.wizard.goToNextStep();
                this.intento12 = '#f44236';
              } else if (this.dedoInhabilitado1) {
                this.manoIzquierdaActivada = false;
                this.intento22 = '#f44236';
                this.wizard.goToNextStep();
              }
              Swal.fire('¡Oh no!', (this.tipoOperacion === 1) ?
                'No se pudo marcar el ingreso del usuario.' :
                'No se pudo marcar la salida del usuario.', 'error');
              this.router.navigate(['/admin/inicio']);
            }
          }, 1000);
        } else {
          Swal.fire({
            title: '¡Oh no!',
            text: 'No hay huellas capturadas.',
            timer: 3000,
            icon: 'warning'
          });
        }
      }
    }
  }

  limpiar() {
    this.wizard.goToStep(0);
    this.mejoresHuellas = [];
    this.requestAsistencia = new MarcarAsistenciaBody();
    this.manoIzquierdaActivada = false;
    this.desactivarBtnCapturarDerecho = false;
    this.btnCapturarIzquierdo = false;
    this.numeroDocumento = '';
    this.validar = 0;
    this.numeroIntentos = 0;
    this.tipoOperacion = 0;
    this.activarCheckbox1 = false;
    this.activarCheckbox2 = false;
    this.dedoInhabilitado1 = false;
    this.dedoInhabilitado2 = true;
    this.dedoIzquierdo = 'MANOIZQUIERDA';
    this.dedoDerecho = 'MANODERECHA';
    this.huellaDerecha = './assets/images/test/identificacion.svg';
    this.huellaIzquierda = './assets/images/test/identificacion.svg';
    this.intento11 = '#D0D0D0';
    this.intento12 = '#D0D0D0';
    this.intento21 = '#D0D0D0';
    this.intento22 = '#D0D0D0';
    this.mathching = false;
    this.template = null;
    this.desactivarBtnCapturarDerecho = false;
    this.btnCapturarIzquierdo = false;
    this.isSubmit = false;
  }

  submit(event) {
    event.preventDefault();
  }

  previous() {
    this.wizard.goToPreviousStep();
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

}
