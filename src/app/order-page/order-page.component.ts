import { AfterViewInit, Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
import { RouterModule } from '@angular/router';
import { APIconnectionService } from '../apiconnection.service';
import { Products } from '../products';
import { MainProductsObject } from '../main-products-object';
import { FormsModule } from '@angular/forms';
import { AsideSectionComponent } from './aside-section/aside-section.component';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from '../user-info';
import { AddToCartNotifyComponent } from "../add-to-cart-notify/add-to-cart-notify.component";


@Component({
  selector: 'app-order-page',
  imports: [RouterModule, FormsModule, AsideSectionComponent, AddToCartNotifyComponent],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})
export class OrderPageComponent implements OnInit, AfterViewInit {
  constructor(private https: APIconnectionService, private cookies : CookieService){
    
  }
  
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

       this.pageIndicators.nativeElement.style.display = "flex"
       
      },
      error: (error) => console.log(error)
    }) 
  }

  selectPage(page: number) {
    this.currentPage = page;
    this.getAllProducts(page, this.pageProductsSize);
  }

  displaySearchedProducts(){
    this.https.searchedProductsTransfer.subscribe({
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
    this.https.pageIndicatorsTransfer.next(this.pageIndicators)
  }
  
  transferFilteredProducts(){
   this.https.transferProductsFromFilter.subscribe({
    next: (data : MainProductsObject) => {
      this.displayProducts = data.products
      this.totalProducts = data.total
      this.showingProducts = data.products.length

      this.pageIndicators.nativeElement.style.display = "none"
    }
  })
  }

  transferProductsAll(){
    this.https.transferProductsAll.subscribe({
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
    this.https.getUserPage().subscribe({
        next: (data : UserInfo) => this.userHasCart = data.cartID
      })
  }

  addToCart(productID: string) {
    if (!this.cookies.get("userLogedIn")) {
      this.https.transferNoAccountToggle.next(true);
      return;
    }

    this.https.getUserPage().subscribe({
      next: (data: UserInfo) => {
        this.userHasCart = data.cartID;

        let itemToAdd = {
          id: productID,
          quantity: 1
        };

        if (this.userHasCart === "") {
          this.https.addToCartItem(itemToAdd).subscribe({
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
          this.https.getProductQuantitiy(itemToAdd).subscribe({
            next: (data: any) => {
              this.addedToCart = true;
              this.https.transferInCartNumber.next(data.total.quantity)
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
    this.https.transferPageIndex.subscribe((data : number) => this.currentPage = data)
  }
}
