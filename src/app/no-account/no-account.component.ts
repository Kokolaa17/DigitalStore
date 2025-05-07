import { Component } from '@angular/core';
import { APIconnectionService } from '../apiconnection.service';

@Component({
  selector: 'app-no-account',
  imports: [],
  templateUrl: './no-account.component.html',
  styleUrl: './no-account.component.scss'
})
export class NoAccountComponent {

  constructor(private https : APIconnectionService){

  }

  public isNoAccountOpen: boolean = false;

  closeNoAccount(){
    this.https.transferNoAccountToggle.next(false)
  }
}
