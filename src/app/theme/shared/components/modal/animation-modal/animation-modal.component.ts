import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalService} from '../../../../../services/modal.service';

@Component({
  selector: 'app-animation-modal',
  templateUrl: './animation-modal.component.html',
  styleUrls: ['./animation-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnimationModalComponent implements OnInit {
  @Input() modalClass: string;
  @Input() contentClass: string;
  @Input() modalID: string;
  @Input() backDrop = false;

  constructor(private modalService: ModalService) {
  }

  ngOnInit() {

  }

  close(event) {
    this.modalService.dialogTool.next(true);
    document.querySelector('#' + event).classList.remove('md-show');
  }

}
