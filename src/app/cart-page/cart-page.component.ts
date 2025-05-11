import { Component, OnInit } from '@angular/core';
import { APIconnectionService } from '../apiconnection.service';
import { Products } from '../products';


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
  public producID : any;


  getCartProducts(){
    this.https.getCart().subscribe({
      next: (data: any) => {
      this.products = data;
      this.cartProducts = data.products;
      this.totalPrice = data.total.price.current     
      this.https.transferCardProductsNumber.next(data.total.quantity)  
      this.producID = data.products
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
        this.https.transferCardProductsNumber.next(data.total.quantity) 
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
        this.https.transferCardProductsNumber.next(data.total.quantity) 
        console.log(data);
        
      }
    })
  }

  deleteFromCart(productID : string){
    let deleteThisProduct = {
      id: productID
    }

    this.https.deleteFromCart(deleteThisProduct).subscribe((data : any ) => console.log(data))
  }


  checkOutProducts(){
    this.https.checkOut().subscribe({
      next: (data : any) => console.log(data)
    })
  }
}
