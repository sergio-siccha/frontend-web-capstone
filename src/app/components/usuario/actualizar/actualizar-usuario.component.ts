import { Component, OnInit, Input } from '@angular/core';
import {ToolService} from '../../../services/tool.service';
import {AuthService} from '../../../services/auth.service';
import {Usuario} from '../../../models/usuario-model';
import {ESTADOS} from '../../../constant/estado-cte';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.scss']
})
export class ActualizarUsuarioComponent implements OnInit {
  @Input() nroDocumento: string;

  request: Usuario;
  isSubmit: boolean;
  estados: any;
  admin: boolean;

  constructor(
    private toolService: ToolService,
    private authService: AuthService,
  ) {
    this.request = new Usuario();
    this.isSubmit = false;
    this.estados = ESTADOS;
    this.request.estado = 1;
    this.admin = this.authService.authObject.roles[0] === 'ROLE_ADMIN';
  }

  ngOnInit() {
  }

  close() {
    this.toolService.dialogTool.next(true);
  }

}
