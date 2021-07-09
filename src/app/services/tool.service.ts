import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  private readonly _dialogTool: BehaviorSubject<boolean>;

  get dialogTool(): BehaviorSubject<boolean> {
    return this._dialogTool;
  }

  constructor() {
    this._dialogTool = new BehaviorSubject<boolean>(false);
  }
}
