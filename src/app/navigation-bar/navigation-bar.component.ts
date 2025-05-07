import { Component, ElementRef, OnInit, SimpleChanges, ViewChild,} from '@angular/core';
import { RouterModule } from '@angular/router';
import { APIconnectionService } from '../apiconnection.service';
import { FormsModule } from '@angular/forms';
import { MainProductsObject } from '../main-products-object';
import { Products } from '../products';
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignInComponent } from './sign-in/sign-in.component';
import { CookieService } from 'ngx-cookie-service';
import { NoAccountComponent } from "../no-account/no-account.component";

@Component({
  selector: 'app-navigation-bar',
  imports: [RouterModule, FormsModule, SignUpComponent, SignInComponent, NoAccountComponent],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent implements OnInit{
  
  constructor(private https: APIconnectionService, public cookies : CookieService){

  }

  ngOnInit(): void {
    this.recivePageIndicators()
    this.closeSignUp()
    this.closeSignIn()
    this.getNoAccount()
    this.getProductsInCart()
  }

  public searchWord: string = "";
  public displaySearchedProducts: Products[] = []
  public transferDataForDown: MainProductsObject = {} as MainProductsObject;
  public cancelBlurHide: boolean = false;
  public isMenuOpen: boolean = false;
  public isSignUpOpen: boolean = false;
  public isSignInOpen: boolean = false;
  public isNoAccountOpen: boolean = false;
  public productsInCart : number = 0;
  @ViewChild("searchBar") public search! : ElementRef;
  @ViewChild("searchResault") public searchResault! : ElementRef;
  @ViewChild('pageIndicators') public pageIndicators!: ElementRef;
  @ViewChild("sideMenu") public sideMenu! : ElementRef;


  searchProduct(searchWord : string){
    this.https.searchProduct(searchWord).subscribe({
      next: (data : MainProductsObject) => {
        this.displaySearchedProducts = data.products
        this.transferDataForDown = data
      }
    })
  }

  displaySearchedProductsDown(){
    this.https.searchedProductsTransfer.next(this.transferDataForDown)
    this.displaySearchedProducts = []
    this.search.nativeElement.value = "";
    this.searchResault.nativeElement.style.display = "none"
    this.pageIndicators!.nativeElement.style.display = "none"
  }

  searchAppear() {
    if (this.search.nativeElement === document.activeElement && this.search.nativeElement.value !== "") {
      this.searchResault.nativeElement.style.display = "block";
    } else {
      this.searchResault.nativeElement.style.display = "none";
    }
  }

  hideResultsWithDelay() {
    setTimeout(() => {
      if (!this.cancelBlurHide) {
        this.searchResault.nativeElement.style.display = "none";
      }
    }, 150); 
  }

  recivePageIndicators(){
    this.https.pageIndicatorsTransfer.subscribe((data: ElementRef) => {
      this.pageIndicators = data;
    });
  }

  openSideMenu(){
    this.isMenuOpen = !this.isMenuOpen
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openSignUp(){
    this.isSignUpOpen = !this.isSignUpOpen
  }

  closeSignUp(){
    this.https.transferSignUpToggle.subscribe({
      next: (data:boolean) => this.isSignUpOpen = data
    })
  }

  openSignIn(){
    this.isSignInOpen = !this.isSignInOpen;
  }

  closeSignIn(){
    this.https.transferLogInToggle.subscribe({
      next: (data:boolean) => this.isSignInOpen = data
    })
  }

  logOut(){
    this.cookies.delete("userLogedIn")
  }


  getNoAccount(){
    this.https.transferNoAccountToggle.subscribe((data : boolean) => this.isNoAccountOpen = data)
  }

  getProductsInCart(){
    this.https.transferCardProductsNumber.subscribe((data: number) => this.productsInCart = data)
  }

}
