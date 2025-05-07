import { Component } from '@angular/core';
import { APIconnectionService } from '../../apiconnection.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule,],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  constructor(private https : APIconnectionService, private cookies : CookieService){

  }

  public badRequest: string = ""
  public isRegistered: any = ""
  public isLogedIn: boolean = false;

  public LogInForm: FormGroup = new FormGroup({
    email: new FormControl("", [ Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
  })

  logInAccount(){
    this.https.logIn(this.LogInForm.value).subscribe({
      next: (data : any) => {
        this.cookies.set("userLogedIn", data.access_token)
        this.isLogedIn = true;
        setTimeout(() => {
          this.closeSignIn()
        }, 1500);
        this.badRequest = ""
      },
      error: (data: any) => {
        this.badRequest = data.error.error
      }
      
    })
  }

  closeSignIn() {
    this.https.transferLogInToggle.next(false)
  }
}
