import { Component, OnInit } from '@angular/core';
import { APIconnectionService } from '../apiconnection.service';
import { Products } from '../products';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-cart-page',
  imports: [],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit {

  constructor(private https : APIconnectionService){
    this.getCartProducts()
  }

  ngOnInit(): void {
   
  }

  public products : any;
  public cartProducts: any;
  public totalPrice: string = ""
  public displayCart: Products[] = []
  public inCartNumber: number = 0


  getCartProducts(){
    this.https.getCart().subscribe({
      next: (data: any) => {
      this.products = data;
      this.cartProducts = data.products;
      this.totalPrice = data.total.price.current     
      this.inCartNumber = data.total.quantity
      console.log(this.inCartNumber);
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
      }
    })
    console.log(this.inCartNumber);
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
      }
    })
    console.log(this.inCartNumber);
  }

  deleteFromCart(productID : string){
    console.log(productID)

    const deleteThisProduct = {
      id: productID
    }
  
    this.https.deleteFromCart(deleteThisProduct).subscribe({
      next: (data : any) => {
         this.products = data;
        this.cartProducts = data.products;
        this.totalPrice = data.total.price.current 
        this.inCartNumber = data.total.quantity    
      },
      error: (data: any) => ''
    })
    console.log(this.inCartNumber);
  }

  deleteCart(){
    this.https.deleteCart().subscribe((data : any) => console.log(data))
  }


  checkOutProducts(){
    this.https.checkOut().subscribe({
      next: (data : any) => console.log(data)
    })
  }
}
