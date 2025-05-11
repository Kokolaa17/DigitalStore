import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Products } from '../../products';
import { APIconnectionService } from '../../apiconnection.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-details-page',
  imports: [RouterModule],
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
      next: (data : any) => this.userHasCart = data.cartID,
      error: (data : any) => console.log(data)
    })
  }

  addToCart(productID : string){

    if(this.cookies.get("userLogedIn")){

      let itemToAdd = {
        id: productID,
        quantity: 1
      }
  
      if(this.userHasCart){
        this.https.addToCartItem(itemToAdd).subscribe({
          next: (data: any) => {
            console.log(data);
          },
          error: (err) => {
            console.error('Error:', err);
          }
        });
      }
      else {  
        this.https.getProductQuantitiy(itemToAdd).subscribe({
          next: (data: any) => {
            console.log(data);
          },
          error: (err) => {
            console.error('Error:', err);
          }
        })
      }
    }
    else {
      this.https.transferNoAccountToggle.next(true)
    }
  }

  
}
