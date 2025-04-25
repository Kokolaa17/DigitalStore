import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APIconnectionService } from '../apiconnection.service';
import { Products } from '../products';
import { MainProductsObject } from '../main-products-object';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-page',
  imports: [RouterModule, FormsModule],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})
export class OrderPageComponent {
  constructor(private https: APIconnectionService){
   this.getAllProducts(1, this.pageProductsSize)
  }

  public displayProducts:Products[] = [];
  public totalProducts:number = 0;
  public showingProducts:number = 0;
  public productPages: number[] = [];
  public pageProductsSize: string = "9";


  getAllProducts(pageIndex : number, pageProductsSize: string ){
    this.https.getAllProducts(pageIndex, pageProductsSize).subscribe({
      next: (data:MainProductsObject) => {
        this.displayProducts = data.products
        this.totalProducts = data.total
        this.showingProducts = data.products.length

        let pageSize =  Math.ceil(data.total / data.limit)
        this.productPages = [];

        for(let i = 1; i <= pageSize; i++) {
          this.productPages.push(i)
        }

      },
      error: (error) => console.log(error)
    })
    
  }
  
}
