import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { MainProductsObject } from './main-products-object';
import { Subject} from 'rxjs';
import { Products } from './products';
import { Categorys } from './categorys';


@Injectable({
  providedIn: 'root'
})
export class APIconnectionService {

  constructor(private Http: HttpClient) {
   
  }

  public searchedProductsTransfer : Subject<MainProductsObject> = new Subject;
  public pageIndicatorsTransfer: Subject<ElementRef> = new Subject

  
  getBestSellers(){
    return this.Http.get("https://api.everrest.educata.dev/shop/products/search?page_size=6&rating=4")
  }

  getAllProducts(pageIndex : number, pageProductsSize: string){
    return this.Http.get<MainProductsObject>(`https://api.everrest.educata.dev/shop/products/all?page_index=${pageIndex}&page_size=${pageProductsSize}`)
  }

  searchProduct(searchWord: string){
    return this.Http.get<MainProductsObject>(`https://api.everrest.educata.dev/shop/products/search?page_size=38&keywords=${searchWord}`)
  }

  goToDetailsPage(productID: string){
    return this.Http.get<Products>(`https://api.everrest.educata.dev/shop/products/id/${productID}`)
  }

  getCategorys(){
    return this.Http.get<Categorys[]>(`https://api.everrest.educata.dev/shop/products/categories`)
  }

  getBrands(){
    return this.Http.get<string[]>("https://api.everrest.educata.dev/shop/products/brands")
  }
}
