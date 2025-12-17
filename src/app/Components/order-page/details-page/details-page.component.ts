import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Products } from '../../../Interfaces/products';
import { APIconnectionService } from '../../../Services/apiconnection.service';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from '../../../Interfaces/user-info';
import { AddToCartNotifyComponent } from '../../add-to-cart-notify/add-to-cart-notify.component';


@Component({
  selector: 'app-details-page',
  imports: [RouterModule, AddToCartNotifyComponent],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.scss'
})
export class DetailsPageComponent implements OnInit {

  private readonly _http : APIconnectionService = inject(APIconnectionService);
  private readonly _activeR : ActivatedRoute = inject(ActivatedRoute);
  _cookies : CookieService = inject(CookieService);
  
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
    this._activeR.params.subscribe((data:any) => this.productID = data.productID)
  }
  
  getProductDetails(){
    this.productDetails = this._activeR.snapshot.data['productDetails']
  }

  getUserCart(){
      this._http.getUserPage().subscribe({
          next: (data : UserInfo) => this.userHasCart = data.cartID
        })
    }
  
  addToCart(productID: string) {
    if (!this._cookies.get("userLogedIn")) {
      this._http.transferNoAccountToggle.next(true);
      return;
    }

    this._http.getUserPage().subscribe({
      next: (data: UserInfo) => {
        this.userHasCart = data.cartID;

        let itemToAdd = {
          id: productID,
          quantity: 1
        };

        if (this.userHasCart === "") {
          this._http.addToCartItem(itemToAdd).subscribe({
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
          this._http.getProductQuantitiy(itemToAdd).subscribe({
            next: (data: any) => {
              this.addedToCart = true;
              this._http.transferInCartNumber.next(data.total.quantity)
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

    nextImage(){
    if (!this.productDetails?.images || this.productDetails.images.length === 0) return;
    
    this.slideIndex++;
    if(this.slideIndex > this.productDetails.images.length - 1){
      this.slideIndex = 0;
    }
  }

  prevImage() {
    if (!this.productDetails?.images || this.productDetails.images.length === 0) return;
    
    this.slideIndex--;
    if (this.slideIndex < 0) { 
      this.slideIndex = this.productDetails.images.length - 1;
    }
  }

  @HostListener('window:keyup.arrowright')
  handleArrowRight(event: KeyboardEvent) {
    this.nextImage();
  }

  @HostListener('window:keyup.arrowleft')
  handleArrowLeft(event: KeyboardEvent) {
    this.prevImage();
  }

}
