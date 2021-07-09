import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss']
})
export class ChatUserListComponent implements OnInit {
  @Output() onChatCollapse = new EventEmitter();
  @Output() onChatToggle = new EventEmitter();
  public friendsList: any;

  constructor() {
  }

  ngOnInit() {
  }

  onChatOn(friend_id) {
    this.onChatToggle.emit(friend_id);
  }

}
