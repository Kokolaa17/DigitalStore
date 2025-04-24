import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APIconnectionService } from '../apiconnection.service';

@Component({
  selector: 'app-order-page',
  imports: [RouterModule],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})
export class OrderPageComponent {
  constructor(private https: APIconnectionService){
    this.getAllProducts()
  }
  public displayProducts:any;
  public totalProducts:number = 0;
  public showingProducts:number = 0;

  getAllProducts(){
    this.https.getAllProducts().subscribe({
      next: (data:any) => {
        this.totalProducts = data.total
        this.showingProducts = data.limit
        this.displayProducts = data.products
      },
      error: (error:any) => console.log(error),
    })
  }
}
