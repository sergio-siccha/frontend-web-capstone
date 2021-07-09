import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {Usuario, UsuariosResponse} from '../../models/usuario-model';
import {UsuarioService} from '../../services/usuario.service';
import {LANGUAGE} from '../../utils/GlobalConfig';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  data: Usuario[];
  dtOptions: any = {};
  nroDocumento: string;
  dtTrigger = new Subject();

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      select: true,
      language: LANGUAGE
    };

    this.getData();

    this.usuarioService.refreshUsuario.subscribe(sub => {
      if (sub === true) {
        this.refreshTable();
        this.usuarioService.refreshUsuario.next(false);
      }
    });
  }

  emitData(nroDocumento: string) {
    this.nroDocumento = nroDocumento;
  }

  getData() {
    this.usuarioService.getAll().subscribe(response => {
      this.data = response.objeto as unknown as Usuario[];

      this.dtTrigger.next();
    });
  }

  refreshTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getData();
    });
  }

}
