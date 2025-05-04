import { Component } from '@angular/core';
import { APIconnectionService } from '../../apiconnection.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  constructor(private https: APIconnectionService){

  }

  public badRequest: string = ""
  public badRequestKeys: string[] = []
  public isRegistered: any = ""
  public showErrors: boolean = false;

  public createAccount: FormGroup = new FormGroup({
    firstName: new FormControl("", [ Validators.required, Validators.minLength(2)]),
    lastName: new FormControl("", [ Validators.required, Validators.minLength(2)]),
    email: new FormControl("", [ Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
    age: new FormControl("",  Validators.required),
    address: new FormControl("",),
    phone: new FormControl("+995",[Validators.required, Validators.maxLength(13)]),
    zipcode: new FormControl("", [ Validators.required]),
    avatar: new FormControl("", [Validators.required]),
    gender: new FormControl("", Validators.required),
  })

  registerAccount(){
    this.https.register(this.createAccount.value).subscribe({
      next: (data: any) => {
        this.isRegistered = true;
        this.showErrors = false;
        setTimeout(() => {
          this.closeSignUp()
        }, 1500);
      },
      error: (data: any) => {
        this.badRequest = data.error.error
        this.badRequestKeys = data.error.errorKeys
        this.isRegistered = false;
        this.showErrors = true;
      }
    })
  }

  closeSignUp() {
    this.https.transferSignUpToggle.next(false)
  }
}
