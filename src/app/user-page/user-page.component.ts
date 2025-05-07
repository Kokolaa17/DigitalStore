import { Component, OnInit } from '@angular/core';
import { APIconnectionService } from '../apiconnection.service';
import { UserInfo } from '../user-info';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-page',
  imports: [],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {
  constructor(private http : APIconnectionService, private cookies : CookieService){

  }

  ngOnInit(): void {
    this.getProfileInfo()
  }

  public userInfo: UserInfo = {} as UserInfo;

  getProfileInfo(){
    this.http.getUserPage().subscribe({
      next: (data: UserInfo) => {
        this.userInfo = data
        this.cookies.set("cartID", data.cartID)
      },
      error: (data: any) => console.log(data)
    })
  }
}
