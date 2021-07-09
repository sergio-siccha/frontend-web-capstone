import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {
  files: File[] = [];
  imgSrc = './assets/images/Firma.jpg';
  textoMotivo = 'Firmado digitalmente por';

  constructor() { }

  ngOnInit() {
    this.textoMotivo = 'Firmado digitalmente por';
  }

  saveConfiguration() {

  }

  importFile(event) {
    if (event.target.files.length === 0) {
      return;
    } else {
      for (const file of event.target.files) {
        const extension = file.name.split('.').pop();
        if (extension === 'pdf' || extension === 'PDF') {
          this.files.push(file);
        }
      }
    }
  }

}
