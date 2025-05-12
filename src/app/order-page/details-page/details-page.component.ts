import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Products } from '../../products';
import { APIconnectionService } from '../../apiconnection.service';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from '../../user-info';
import { AddToCartNotifyComponent } from "../../add-to-cart-notify/add-to-cart-notify.component";


@Component({
  selector: 'app-details-page',
  imports: [RouterModule, AddToCartNotifyComponent],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.scss'
})
export class DetailsPageComponent implements OnInit {

  constructor(private https: APIconnectionService, public activeR: ActivatedRoute, private cookies : CookieService){

  }
  
  ngOnInit(): void {
    this.getID()
    this.getProductDetails()
  }

  public productID: string = "";
  public productDetails: Products = {} as Products;
  public slideIndex : number = 0;
  public stars: string[] = [];
  public userHasCart: string = "";
  public addedToCart : boolean = false;
  Array = Array;
  math = Math;

  getID(){
    this.activeR.params.subscribe((data:any) => this.productID = data.productID)
  }
  
  getProductDetails(){
    this.https.goToDetailsPage(this.productID).subscribe({
      next: ((data: Products) => this.productDetails = data)
    })
  }

  nextImage(images: any){
    this.slideIndex++
    if(this.slideIndex > images.length - 1){
      this.slideIndex = 0;
    }
  }

  prevImage(images: any) {
    this.slideIndex--;
    if (this.slideIndex < 0) { 
      this.slideIndex = images.length - 1;
    }
  }

  getUserCart(){
      this.https.getUserPage().subscribe({
          next: (data : UserInfo) => this.userHasCart = data.cartID
        })
    }
  
  addToCart(productID: string) {
    if (!this.cookies.get("userLogedIn")) {
      this.https.transferNoAccountToggle.next(true);
      return;
    }

    this.https.getUserPage().subscribe({
      next: (data: UserInfo) => {
        this.userHasCart = data.cartID;

        let itemToAdd = {
          id: productID,
          quantity: 1
        };

        if (this.userHasCart === "") {
          this.https.addToCartItem(itemToAdd).subscribe({
            next: () => {
              this.getUserCart()
              this.addedToCart = true;
              setTimeout(() => {
                this.addedToCart = false
              }, 1500);
            },
            error: (err) => console.error("Error adding to cart:", err)
          });
        } else {
          this.https.getProductQuantitiy(itemToAdd).subscribe({
            next: (data: any) => {
              console.log(data)
              this.addedToCart = true;
              setTimeout(() => {
                this.addedToCart = false
              }, 1500);
            },
            error: (err) => console.error("Error getting quantity:", err)
          });
        }
      },
      error: (err) => {
        console.error("Error getting user cart:", err);
      }
    });
  }

   @HostListener('window:keyup.arrowright', ['$event'])

  handleArrowRight(event: KeyboardEvent) {
    this.nextImage(this.productDetails.images);
  }
  
  @HostListener('window:keyup.arrowleft', ['$event'])
  
  handleAroowLeft(event: KeyboardEvent){
    this.prevImage(this.productDetails.images)
  }

  
}
