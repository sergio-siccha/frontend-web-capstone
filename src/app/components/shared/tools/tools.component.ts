import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import Swal from 'sweetalert2';
import {ToolService} from '../../../services/tool.service';
import {UsuarioService} from '../../../services/usuario.service';
/*import {UsuarioService} from '../../../services/usuario.service';
import {ToolService} from '../../../services/tool.service';
import {EmpresaService} from '../../../services/empresa.service';*/

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styles: [
    '.tools {display: flex}'
  ]
})
export class ToolsComponent implements OnInit {

  /* Interaccion con el DOM */
  @ViewChild('create', {read: ElementRef, static: false}) create: ElementRef;
  @ViewChild('update', {read: ElementRef, static: false}) update: ElementRef;

  @Input() type: string;
  @Input() nroDocumento: any;

  openCreate = false;
  openUpdate = false;

  constructor(
    private toolService: ToolService,
    private usuarioService: UsuarioService
    /*private empresaService: EmpresaService*/
  ) {
  }

  ngOnInit() {
    this.toolService.dialogTool.subscribe(sub => {
      if (sub === true) {
        this.openUpdate = false;
        this.openCreate = false;
        (<HTMLElement>this.update.nativeElement.children[0]).classList.remove('md-show');
        (<HTMLElement>this.create.nativeElement.children[0]).classList.remove('md-show');
        this.toolService.dialogTool.next(false);
      }
    });
  }

  openMyModal(event) {
    if (event !== 'modal-editar' && event !== 'modal-borrar') {
      this.openCreate = true;
      document.querySelector('#' + event).classList.add('md-show');
    } else {
      if (
        (typeof this.nroDocumento === 'undefined' || this.nroDocumento === null)
      ) {
        Swal.fire({
          title: '¡Oh no!',
          text: 'No has seleccionado una fila',
          icon: 'error',
          timer: 2000
        }).then(r => console.log('Error: ', r));
      } else if (event === 'modal-borrar') {
        Swal.fire({
          title: 'Confirmación',
          text: '¿Desea eliminar?',
          icon: 'question',
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          showConfirmButton: true,
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            if (this.type === 'usuario') {
              this.usuarioService.deleteOne(this.nroDocumento).subscribe(sub => {
                this.usuarioService.refreshUsuario.next(true);
                Swal.fire('OK', '¡El usuario se eliminó exitosamente!', 'success').then(r => console.log('Success: ', r));
              });
            }
          }
        });
      } else {
        this.openUpdate = true;
        document.querySelector('#' + event).classList.add('md-show');
      }
    }
  }
}
