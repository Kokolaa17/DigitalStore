import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild,} from '@angular/core';
import { RouterModule } from '@angular/router';
import { APIconnectionService } from '../../Services/apiconnection.service';
import { Products } from '../../Interfaces/products';
import { MainProductsObject } from '../../Interfaces/main-products-object';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from '../../Interfaces/user-info';
import { AddToCartNotifyComponent } from '../add-to-cart-notify/add-to-cart-notify.component';
import { AsideSectionComponent } from './aside-section/aside-section.component';


@Component({
  selector: 'app-order-page',
  imports: [RouterModule, FormsModule, AsideSectionComponent, AddToCartNotifyComponent],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})
export class OrderPageComponent implements OnInit, AfterViewInit {

  private readonly _http : APIconnectionService = inject(APIconnectionService);
  _cookies : CookieService = inject(CookieService);
  
  ngOnInit(): void {
    this.getAllProducts(1, this.pageProductsSize)
    this.displaySearchedProducts()
    this.transferFilteredProducts()
    this.transferProductsAll()
    this.getUserCart()
  }

  ngAfterViewInit(): void {
    this.transferPageIndicators()
    this.getPageIndex()
  }

  public displayProducts:Products[] = [];
  public totalProducts:number = 0;
  public showingProducts:number = 0;
  public productPages: number[] = [];
  public pageProductsSize: string = "9";
  public detailsPage: Products = {} as Products; 
  public currentPage: number = 1;
  public userHasCart: string = ""
  public addedToCart: boolean = false;
  @ViewChild("pageIndicators") public pageIndicators!: ElementRef;
  Array = Array;
  math = Math;


  getAllProducts(pageIndex : number, pageProductsSize: string ){
    this._http.getAllProducts(pageIndex, pageProductsSize).subscribe({
      next: (data:MainProductsObject) => {
        this.displayProducts = data.products
        this.totalProducts = data.total
        this.showingProducts = data.products.length

        let pageSize =  Math.ceil(data.total / data.limit)
        this.productPages = [];

        for(let i = 1; i <= pageSize; i++) {
          this.productPages.push(i)
        }

       this.pageIndicators.nativeElement.style.display = "flex"
       
      },
      error: (error) => console.log(error)
    }) 
  }

  selectPage(page: number) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentPage = page;
    this.getAllProducts(page, this.pageProductsSize);
  }

  displaySearchedProducts(){
    this._http.searchedProductsTransfer.subscribe({
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

  transferPageIndicators(){
    this._http.pageIndicatorsTransfer.next(this.pageIndicators)
  }
  
  transferFilteredProducts(){
   this._http.transferProductsFromFilter.subscribe({
    next: (data : MainProductsObject) => {
      this.displayProducts = data.products
      this.totalProducts = data.total
      this.showingProducts = data.products.length

      this.pageIndicators.nativeElement.style.display = "none"
    }
  })
  }

  transferProductsAll(){
    this._http.transferProductsAll.subscribe({
      next: (data:MainProductsObject) => {
        this.displayProducts = data.products
        this.totalProducts = data.total
        this.showingProducts = data.products.length

        let pageSize =  Math.ceil(data.total / data.limit)
        this.productPages = [];

        for(let i = 1; i <= pageSize; i++) {
          this.productPages.push(i)
        }

       this.pageIndicators.nativeElement.style.display = "flex"
       
      },
      error: (error) => console.log(error)
    })
  }

  getUserCart(){
    this._http.getUserPage().subscribe({
        next: (data : UserInfo) => this.userHasCart = data.cartID
      })
  }

  addToCart(productID: string) {
    if (!this._cookies.get("userLogedIn")) {
      this._http.transferNoAccountToggle.next(true);
      return;
    }

    this._http.getUserPage().subscribe({
      next: (data: UserInfo) => {
        this.userHasCart = data.cartID;

        let itemToAdd = {
          id: productID,
          quantity: 1
        };

        if (this.userHasCart === "") {
          this._http.addToCartItem(itemToAdd).subscribe({
            next: () => {
              this.getUserCart()
              this.addedToCart = true;
              setTimeout(() => {
                this.addedToCart = false
              }, 1500);
            },
            error: (err) => console.error("Error adding to cart:", err)
          });
        } else {
          this._http.getProductQuantitiy(itemToAdd).subscribe({
            next: (data: any) => {
              this.addedToCart = true;
              this._http.transferInCartNumber.next(data.total.quantity)
              setTimeout(() => {
                this.addedToCart = false
              }, 1500);
            },
            error: (err) => console.error("Error getting quantity:", err)
          });
        }
      },
      error: (err) => {
        console.error("Error getting user cart:", err);
      }
    });
  }

  getPageIndex(){
    this._http.transferPageIndex.subscribe((data : number) => this.currentPage = data)
  }
}
