import { Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
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
export class NavigationBarComponent implements OnInit {
  
  constructor(private https: APIconnectionService){
    
  }

  ngOnInit(): void {
    this.recivePageIndicators()
  }

  public searchWord: string = "";
  public displaySearchedProducts: Products[] = []
  public transferDataForDown: MainProductsObject = {} as MainProductsObject;
  public cancelBlurHide: boolean = false;
  public isMenuOpen: boolean = false;
  @ViewChild("searchBar") public search! : ElementRef;
  @ViewChild("searchResault") public searchResault! : ElementRef;
  @ViewChild('pageIndicators') public pageIndicators!: ElementRef;
  @ViewChild("sideMenu") public sideMenu! : ElementRef;


  searchProduct(searchWord : string){
    this.https.searchProduct(searchWord).subscribe({
      next: (data : MainProductsObject) => {
        this.displaySearchedProducts = data.products
        this.transferDataForDown = data
      }
    })
  }

  displaySearchedProductsDown(){
    this.https.searchedProductsTransfer.next(this.transferDataForDown)
    this.displaySearchedProducts = []
    this.search.nativeElement.value = "";
    this.searchResault.nativeElement.style.display = "none"
    this.pageIndicators!.nativeElement.style.display = "none"
  }

  searchAppear() {
    if (this.search.nativeElement === document.activeElement && this.search.nativeElement.value !== "") {
      this.searchResault.nativeElement.style.display = "block";
    } else {
      this.searchResault.nativeElement.style.display = "none";
    }
  }

  hideResultsWithDelay() {
    setTimeout(() => {
      if (!this.cancelBlurHide) {
        this.searchResault.nativeElement.style.display = "none";
      }
    }, 150); 
  }

  recivePageIndicators(){
    this.https.pageIndicatorsTransfer.subscribe((data: ElementRef) => {
      this.pageIndicators = data;
    });
  }

  openSideMenu(){
    this.isMenuOpen = !this.isMenuOpen
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
