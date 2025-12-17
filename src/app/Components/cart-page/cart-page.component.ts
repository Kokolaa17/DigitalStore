import { Component, OnInit } from '@angular/core';
import { APIconnectionService } from '../../Services/apiconnection.service';
import { Products } from '../../Interfaces/products';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart-page',
  imports: [],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit {

  constructor(private https : APIconnectionService, public route : Router){
    this.getCartProducts()
  }

  ngOnInit(): void {
    this.getNumberCart()
  }

  public products : any;
  public cartProducts: any;
  public totalPrice: string = "0"
  public displayCart: Products[] = []
  public inCartNumber: number = 0
  public displayCheckoutMessage: boolean = false;
  public checkoutMessage: string = ""
  
  getNumberCart(){
    this.https.transferInCartNumber.next(this.inCartNumber)
  }


  getCartProducts(){
    this.https.getCart().subscribe({
      next: (data: any) => {
      this.products = data;
      this.cartProducts = data.products;
      this.totalPrice = data.total.price.current     
      this.inCartNumber = data.total.quantity
      this.getNumberCart()
    }
    })
  }


  decreaseQuantitiy(productID : string, quantity : number){
    let itemQuantity = quantity;

    itemQuantity--
    
    let productQuantity = {
      id: productID,
      quantity: itemQuantity,
    }


    this.https.getProductQuantitiy(productQuantity).subscribe({
      next: (data: any) => {
        this.products = data;
        this.cartProducts = data.products;
        this.totalPrice = data.total.price.current      
        this.inCartNumber = data.total.quantity
        this.getNumberCart()
      }
    })
  }

  increaseQuantity(productID : string, quantity : number){

    let itemQuantity = quantity;

    itemQuantity++
    
    let productQuantity = {
      id: productID,
      quantity: itemQuantity,
    }


    this.https.getProductQuantitiy(productQuantity).subscribe({
      next: (data: any) => {
        this.products = data;
        this.cartProducts = data.products;
        this.totalPrice = data.total.price.current     
        this.inCartNumber = data.total.quantity     
        this.getNumberCart()  
      }
    })
  }

  deleteFromCart(productID : string){

    const deleteThisProduct = {
      id: productID
    }
  
    this.https.deleteFromCart(deleteThisProduct).subscribe({
      next: (data : any) => {
         this.products = data;
        this.cartProducts = data.products;
        this.totalPrice = data.total.price.current 
        this.inCartNumber = data.total.quantity    
        this.getNumberCart()
      },
      error: (data: any) => ''
    })
  }

  deleteCart(){
    this.https.deleteCart().subscribe((data : any) => {
       if(data.success){
        this.route.navigate(["/orderPage"])
    }
    })
  }


  checkOutProducts(){
    this.https.checkOut().subscribe({
      next: (data : any) => {
        this.checkoutMessage = data.message.split("cleared")[0] + "cleared."
        this.displayCheckoutMessage = data.success
        setTimeout(() => {
          this.displayCheckoutMessage = false
          this.route.navigate(["/orderPage"])
        }, 2000);
      }
    })
  }
}
