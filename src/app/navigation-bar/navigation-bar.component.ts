import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APIconnectionService } from '../apiconnection.service';
import { FormsModule } from '@angular/forms';
import { MainProductsObject } from '../main-products-object';
import { Products } from '../products';

@Component({
  selector: 'app-navigation-bar',
  imports: [RouterModule, FormsModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent {
  constructor(private https: APIconnectionService){

  }

  public searchWord: string = "";
  displaySearchedProducts: Products[] = []

  searchProduct(searchWord : string){
    this.https.searchProduct(searchWord).subscribe({
      next: (data : MainProductsObject) => this.displaySearchedProducts = data.products
    })
  }
}
