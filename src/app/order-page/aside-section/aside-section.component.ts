import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { APIconnectionService } from '../../apiconnection.service';
import { Categorys } from '../../categorys';
import { MainProductsObject } from '../../main-products-object';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-aside-section',
  imports: [FormsModule],
  templateUrl: './aside-section.component.html',
  styleUrl: './aside-section.component.scss'
})
export class AsideSectionComponent implements OnInit  {
  constructor(private https: APIconnectionService){

  }

  ngOnInit(): void {
    this.getCategorys()
    this.getBrands()
  }


  public displayCategorys: Categorys[] = [];
  @ViewChild("openClose1") public icon1! : ElementRef;
  @ViewChild("categories") public categories! : ElementRef;

  public displayBrands : string[] = [] 
  @ViewChild("openClose2") public icon2! : ElementRef;
  @ViewChild("brands") public brands! : ElementRef;

  @ViewChild("openClose3") public icon3! : ElementRef;
  @ViewChild("ratings") public ratings! : ElementRef;

  @ViewChild("priceFilter") public priceFilter! :ElementRef;
  @ViewChild("openClose4") public icon4! : ElementRef;
  public minPrice: string = ""
  public maxPrice: string = ""
  public isPriceErrorVisible = false;

  public filteredProducts: MainProductsObject = {} as MainProductsObject;
  


  
  

  toggleSection(section: 'categories' | 'brands' | 'ratings' | 'price') {
    const sections = [
      { name: 'categories', icon: this.icon1, element: this.categories },
      { name: 'brands', icon: this.icon2, element: this.brands },
      { name: 'ratings', icon: this.icon3, element: this.ratings },
      { name: 'price', icon: this.icon4, element: this.priceFilter }
    ];
  
    sections.forEach(s => {
      const isTarget = s.name === section;
      s.icon.nativeElement.textContent = isTarget
        ? (s.icon.nativeElement.textContent === '+' ? '-' : '+')
        : '+';
      s.element.nativeElement.style.display = isTarget
        ? (s.icon.nativeElement.textContent === '-' ? 'flex' : 'none')
        : 'none';
    });
    this.togglePriceWarning()
  }

  getCategorys(){
    this.https.getCategorys().subscribe({
      next: ((data:Categorys[]) => this.displayCategorys = data),
      error:(error) => console.log(error)
    })
}

  getBrands(){
    this.https.getBrands().subscribe({
      next: ((data:string[]) => this.displayBrands = data),
      error:(error) => console.log(error)
    })
  }

  getByCategory(CategoryID: string){
    this.https.getProductByCategorys(CategoryID).subscribe({
      next: (data : MainProductsObject) => {
        this.filteredProducts = data
        this.https.transferProductsFromFilter.next(this.filteredProducts)
      }
    })
  }

  getByBrand(brandName : string){
    this.https.getByBrands(brandName).subscribe({
      next: (data: MainProductsObject) => {
        this.filteredProducts = data
        this.https.transferProductsFromFilter.next(this.filteredProducts)
      }
    })
  }

 filterByStar(StarNum : string){
  this.https.getByStars(StarNum).subscribe({
    next: (data: MainProductsObject) => {
      this.filteredProducts = data
      this.https.transferProductsFromFilter.next(this.filteredProducts)
    }
  })
 }

 applyPriceFilter(minPrice: string, maxPrice: string){
  this.https.getByPrice(minPrice, maxPrice).subscribe({
    next: (data: MainProductsObject) => {
      this.filteredProducts = data
      this.https.transferProductsFromFilter.next(this.filteredProducts)   
    }
  })
 }

 togglePriceWarning() {
  this.isPriceErrorVisible = this.icon4.nativeElement.textContent !== '+';
}

getAllProducts(pageIndex : number, pageProductsSize: string ){
  this.https.getAllProducts(pageIndex, pageProductsSize).subscribe({
    next: (data:MainProductsObject) => {
      this.https.transferProductsAll.next(data)
    },
    error: (error) => console.log(error)
  })
  
}

}
