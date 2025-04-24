import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class APIconnectionService {

  constructor(private Http: HttpClient) {
   
  }
  
  getBestSellers(){
    return this.Http.get("https://api.everrest.educata.dev/shop/products/search?page_size=6&rating=4")
  }

  getAllProducts(){
    return this.Http.get("https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=38")
  }
}
