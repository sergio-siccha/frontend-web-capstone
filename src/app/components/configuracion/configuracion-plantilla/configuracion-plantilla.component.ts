import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import {LANGUAGE} from '../../../utils/GlobalConfig';

@Component({
  selector: 'app-configuracion-plantilla',
  templateUrl: './configuracion-plantilla.component.html',
  styleUrls: ['./configuracion-plantilla.component.scss']
})
export class ConfiguracionPlantillaComponent implements OnInit {
  data: String[];
  dtOptions: any = {};
  dtTrigger = new Subject();

  constructor() {
    this.data = ['1', '2', '3'];
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      select: true,
      language: LANGUAGE
    };
  }

  saveTemplate() {

  }

  importFile(event) {
    if (event.target.files.length === 0) {
      return;
    } else {
      for (const file of event.target.files) {
        const extension = file.name.split('.').pop();
        if (extension === 'pdf' || extension === 'PDF') {
          // this.files.push(file);
        }
      }
    }
  }
}
