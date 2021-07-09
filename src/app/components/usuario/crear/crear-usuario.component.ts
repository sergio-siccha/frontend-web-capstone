import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ToolService} from '../../../services/tool.service';
import {CrearUsuarioRequest, Usuario} from '../../../models/usuario-model';
import {AuthService} from '../../../services/auth.service';
import {ESTADOS} from '../../../constant/estado-cte';
import Swal from 'sweetalert2';
import {AgenteLocalService} from '../../../services/dispositivos-biometricos.service';
import {WizardComponent} from 'angular-archwizard';
import {DatoBiometrico, RegistroDBPersona} from '../../../models/dato-biometrico-model';
import {NgForm} from '@angular/forms';
import {WebcamComponent, WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Observable, Subject} from 'rxjs';
import {UsuarioService} from '../../../services/usuario.service';
import {DatoBiometricoService} from '../../../services/dato-biometrico.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(WizardComponent, {static: false}) wizard: WizardComponent;
  @ViewChild('validationForm', {static: false, read: NgForm }) form: any;
  @ViewChild('webcamComponent', {static: false}) webcamComponent: WebcamComponent;

  request: CrearUsuarioRequest;
  isSubmit: boolean;
  estados: any;
  admin: boolean;
  datosBiometricos: DatoBiometrico[];

  dactilar: boolean[];
  disabled: boolean[];
  verificado: boolean[];

  vecesClick: number;
  casilLasMarcadas: number;

  nroDedo: number;

  /************************************** VARIABLES DE LA CÁMARA ***************************************/
  showWebcam: boolean;
  multipleWebcamsAvailable: boolean;
  errors: WebcamInitError[];

  // latest snapshot
  webcamImage: WebcamImage;

  // webcam snapshot trigger
  trigger: Subject<void>;
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  capture: { id: number, nombre: string, capture: string, base64: string };
  /*****************************************************************************************************/
  constructor(
    private toolService: ToolService,
    private authService: AuthService,
    private agenteLocalService: AgenteLocalService,
    private usuarioService: UsuarioService,
    private datoBiometricoService: DatoBiometricoService,
    private cdRef: ChangeDetectorRef
  ) {
    this.datosBiometricos = [];
    this.request = new CrearUsuarioRequest();
    this.isSubmit = false;
    this.estados = ESTADOS;
    this.request.estado = 0;
    this.request.genero = 1;
    this.request.tipoDocumento = 1;
    this.admin = false;

    this.dactilar = [];
    this.verificado = [];
    this.disabled = [];

    this.vecesClick = 0;
    this.casilLasMarcadas = 0;

    this.nroDedo = 0;

    this.showWebcam = false;
    this.multipleWebcamsAvailable = false;
    this.errors = [];
    this.webcamImage = null;
    this.trigger = new Subject<void>();

    this.capture = {
      id: 1,
      nombre: 'Mire al centro',
      capture: './assets/images/dato-personal/avatar.jpg',
      base64: null
    };
  }

  ngOnInit() {
    this.inicializarArreglosDactilar();
  }

  inicializarArreglosDactilar() {
    for (let i = 0; i <= 9; i++) {
      this.dactilar[i] = false;
      this.disabled[i] = false;
      this.verificado[i] = false;
    }
  }

  agregarRoles() {
    this.request.roles = [];
    if (this.admin) {
      this.request.roles.push('Asistencia$ADM$123');
    } else {
      this.request.roles = null;
    }
  }

  public triggerSnapshot(id): void {
    this.trigger.next();
    if (this.capture.base64 === null) {
      this.capture.capture = this.webcamImage.imageAsDataUrl;
      this.capture.base64 = this.webcamImage.imageAsBase64;

      const datBiometrico = new DatoBiometrico();
      datBiometrico.calidadBiometrica = -1;
      datBiometrico.identificadorDato = -1;
      datBiometrico.imagenBiometrico = this.capture.base64;
      datBiometrico.tipo = 2;
      datBiometrico.tipoImagen = 1;

      this.datosBiometricos.push(datBiometrico);
    } else {
      Swal.fire('Atención', 'Ya se tomó una fotografía del usuario.', 'info');
    }
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      Swal.fire('¡Oh no!', 'No podemos acceder a la cámara.', 'error');
    }
    this.errors.push(error);
  }

  /*********************************** METODOS DE LA CÁMARA *********************************************/

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  /******************************************************************************************************/

  close() {
    this.toolService.dialogTool.next(true);
  }

  previous() {
    this.wizard.goToPreviousStep();
  }

  async guardar() {
    Swal.fire({
      title: '!Espere!',
      text: 'Registrando el nuevo usuario',
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
    Swal.showLoading();

    await this.usuarioService.registroUsuario(this.request).toPromise().then(async resp => {
      if (resp.codigoRespuesta === '00') {
        const requestDBPersona = new RegistroDBPersona();
        requestDBPersona.tipoDocumento = this.request.tipoDocumento;
        requestDBPersona.numeroDocumento = this.request.numeroDocumento;
        requestDBPersona.datosBiometricos = this.datosBiometricos;

        await this.datoBiometricoService.saveByPersona(requestDBPersona).toPromise().then(res => {
          if (res.codigoRespuesta === '00') {
            Swal.close();
            Swal.fire({
              title: 'OK',
              text: `El usuario se guardó exitosamente.`,
              icon: 'success'
            });
            this.clear();
            this.toolService.dialogTool.next(true);
            this.usuarioService.refreshUsuario.next(true);
          } else {
            Swal.fire('¡Oh no!', res.descRespuesta, 'error');
          }
        }).catch(err => {
          Swal.fire('¡Oh no!', 'Ocurrió un error al consultar el servicio de datos biométricos.', 'error');
        });
      } else {
        Swal.fire('¡Oh no!', resp.descRespuesta, 'error');
      }
    }).catch(err => {
      Swal.fire('¡Oh no!', 'Ocurrió un error al consultar el servicio de registro.', 'error');
    });
  }

  next() {
    if (this.wizard.currentStepIndex === 0) {
      if (this.form.valid) {
        this.wizard.goToNextStep();
      } else {
        Swal.fire('¡Oh no!', 'Por favor rellene correctamente el formulario.', 'error');
      }
    } else if (this.wizard.currentStepIndex === 1) {
      if (this.datosBiometricos.length === 2) {
        this.showWebcam = true;

        WebcamUtil.getAvailableVideoInputs()
          .then((mediaDevices: MediaDeviceInfo[]) => {
            this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
          });

        this.wizard.goToNextStep();
      } else {
        Swal.fire('¡Oh no!', 'Debe capturar dos huellas para continuar el registro.', 'error');
      }
    }
  }

  async capturar() {
    if (this.vecesClick === 0) {
      this.vecesClick++;

      if (this.casilLasMarcadas !== 2) {
        Swal.fire({
          title: '¡Atención!',
          text: 'Debe seleccionar 1 dedo de cada mano para iniciar la captura de huellas.',
          icon: 'error'
        });
        this.vecesClick = 0;
        return;
      }

      for (let i = 0; i <= 9; i++) {
        /*console.log('i: ' + i + ' D: ' + this.dactilar[i] + ' V: ' + this.verificado[i]);*/
        if (this.dactilar[i] && !this.verificado[i]) {
          this.showDialogColocarDedo(i);
          this.nroDedo = i;

          if (this.nroDedo !== undefined) {
            this.authService.esCaptura = true; // Indicando al interceptor que se trata de una captura biometrica
            await this.agenteLocalService.capturaBiometrica().toPromise().then(captura => {
              this.authService.esCaptura = false; // Indicando al interceptor que ya se finalizo la captura biomerica
              if (captura.codRespuesta === 2000 && captura.dataTemplate !== null && captura.dataImagen !== null) {
                Swal.close();
                const datBiometrico = new DatoBiometrico();
                datBiometrico.calidadBiometrica = 1;
                datBiometrico.identificadorDato = this.nroDedo + 1;
                datBiometrico.imagenBiometrico = captura.dataImagen;
                datBiometrico.templateBiometrico = captura.dataTemplate;
                datBiometrico.tipo = 1;
                datBiometrico.tipoTemplate = 1;

                this.datosBiometricos.push(datBiometrico);
                this.verificado[this.nroDedo] = true;
              }
            }).catch(err => {
              Swal.fire('¡Oh no!', 'Huella no capturada ' + '\n' +
                err.descRespuesta, 'error');
              this.vecesClick = 0;
            });
          }
        } else {
          this.vecesClick = 0;
        }
      }
      this.vecesClick = 0;
    }
  }

  changeState(value: number) {
    let min, max;
    if (value >= 0 && value <= 4) { min = 0; max = 4; } else { min = 5; max = 9; }

    if (this.dactilar[value]) {
      for (let i = min; i <= max; i++) {
        this.disabled[i] = (i !== value);
      }
      this.casilLasMarcadas++;
    } else {
      for (let i = min; i <= max; i++) {
        this.disabled[i] = false;
      }
      this.casilLasMarcadas--;
    }
  }

  showDialogColocarDedo(dedo: number) {
    let textDedo;

    switch (dedo) {
      case 0:
        textDedo = 'PULGAR DERECHO';
        break;
      case 1:
        textDedo = 'INDICE DERECHO';
        break;
      case 2:
        textDedo = 'MEDIO DERECHO';
        break;
      case 3:
        textDedo = 'ANULAR DERECHO';
        break;
      case 4:
        textDedo = 'MEÑIQUE DERECHO';
        break;
      case 5:
        textDedo = 'PULGAR IZQUIERDO';
        break;
      case 6:
        textDedo = 'INDICE IZQUIERDO';
        break;
      case 7:
        textDedo = 'MEDIO IZQUIERDO';
        break;
      case 8:
        textDedo = 'ANULAR IZQUIERDO';
        break;
      case 9:
        textDedo = 'MEÑIQUE IZQUIERDO';
        break;
    }

    Swal.fire({
      title: '!Captura!',
      html: 'Coloque el' + '<br>' + '<strong>' + textDedo + '</strong>' + '<br>' + 'sobre el lector de huella',
      icon: 'info',
      allowOutsideClick: false,
      position: 'center',
      allowEscapeKey: false
    });
    Swal.showLoading();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.webcamComponent) {
      (this.webcamComponent.nativeVideoElement as HTMLVideoElement).pause();
      (this.webcamComponent.nativeVideoElement as HTMLVideoElement).src = null;
      ((this.webcamComponent.nativeVideoElement as HTMLVideoElement).srcObject as MediaStream).getTracks().forEach(track => {
        track.stop();
      });
      (this.webcamComponent.nativeVideoElement as HTMLVideoElement).srcObject = null;
    }
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log(''));
  }

  clear() {
    this.datosBiometricos = [];
    this.request = new CrearUsuarioRequest();
    this.isSubmit = false;
    this.estados = ESTADOS;
    this.request.estado = 0;
    this.request.genero = 1;
    this.request.tipoDocumento = 1;

    this.dactilar = [];
    this.verificado = [];
    this.disabled = [];

    this.vecesClick = 0;
    this.casilLasMarcadas = 0;

    this.nroDedo = 0;

    this.showWebcam = false;
    this.multipleWebcamsAvailable = false;
    this.errors = [];
    this.webcamImage = null;
    this.trigger = new Subject<void>();

    this.capture = {
      id: 1,
      nombre: 'Mire al centro',
      capture: './assets/images/dato-personal/avatar.jpg',
      base64: null
    };
  }

}
