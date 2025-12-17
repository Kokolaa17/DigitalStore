import { Component } from '@angular/core';
import { APIconnectionService } from '../../Services/apiconnection.service';

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

  singUpLogic(){
     this.https.transferSignUpToggle.next(true)
     this.closeNoAccount()
  }

  singInLogic(){
    this.https.transferLogInToggle.next(true)
    this.closeNoAccount()
  }

  closeNoAccount(){
    this.https.transferNoAccountToggle.next(false)
  }
}
