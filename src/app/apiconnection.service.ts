import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MainProductsObject } from './main-products-object';

@Injectable({
  providedIn: 'root'
})
export class APIconnectionService {

  constructor(private Http: HttpClient) {
   
  }
  
  getBestSellers(){
    return this.Http.get("https://api.everrest.educata.dev/shop/products/search?page_size=6&rating=4")
  }

  getAllProducts(pageIndex : number, pageProductsSize: string){
    return this.Http.get<MainProductsObject>(`https://api.everrest.educata.dev/shop/products/all?page_index=${pageIndex}&page_size=${pageProductsSize}`)
  }

  searchProduct(searchWord: string){
    return this.Http.get<MainProductsObject>(`https://api.everrest.educata.dev/shop/products/search?keywords=${searchWord}`)
  }
}
