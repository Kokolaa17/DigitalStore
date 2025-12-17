import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { APIconnectionService } from '../../../Services/apiconnection.service';
import { Categorys } from '../../../Interfaces/categorys';
import { MainProductsObject } from '../../../Interfaces/main-products-object';
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
  public pageIndex: number = 1;

  selectedCategoryId: string | null = null;
  selectedBrand: string | null = null;
  selectedRating: string | null = null;
  


  
  

  toggleSection(section: 'categories' | 'brands' | 'ratings' | 'price') {
    const sections = [
      { name: 'categories', icon: this.icon1, element: this.categories },
      { name: 'brands', icon: this.icon2, element: this.brands },
      { name: 'ratings', icon: this.icon3, element: this.ratings },
      { name: 'price', icon: this.icon4, element: this.priceFilter }
    ];
  
    sections.forEach(categories => {
      const isTarget = categories.name === section;
    
      if (isTarget) {
        const isOpen = categories.icon.nativeElement.textContent === '+';
        categories.icon.nativeElement.textContent = isOpen ? '-' : '+';
        categories.element.nativeElement.style.display = isOpen ? 'flex' : 'none';
        Array.from(categories.element.nativeElement.children).forEach((child) => {
          (child as HTMLElement).style.animation = 'fromTop 0.3s ease';
        });
      } else {
        categories.icon.nativeElement.textContent = '+';
        categories.element.nativeElement.style.display = 'none';
        Array.from(categories.element.nativeElement.children).forEach((child) => {
          (child as HTMLElement).style.animation = 'fromBottom 0.3s ease';
        });
      }
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
    this.selectedBrand = null
    this.selectedRating = null
    this.selectedCategoryId = CategoryID;
    this.https.getProductByCategorys(CategoryID).subscribe({
      next: (data : MainProductsObject) => {
        this.filteredProducts = data
        this.https.transferProductsFromFilter.next(this.filteredProducts)
      }
    })
  }

  getByBrand(brandName : string){
    this.selectedRating = null
    this.selectedCategoryId = null
    this.selectedBrand = brandName;
    this.https.getByBrands(brandName).subscribe({
      next: (data: MainProductsObject) => {
        this.filteredProducts = data
        this.https.transferProductsFromFilter.next(this.filteredProducts)
      }
    })
  }

 filterByStar(StarNum : string){
  this.selectedCategoryId = null
  this.selectedBrand = null;
  this.selectedRating = StarNum;
  this.https.getByStars(StarNum).subscribe({
    next: (data: MainProductsObject) => {
      this.filteredProducts = data
      this.https.transferProductsFromFilter.next(this.filteredProducts)
    }
  })
 }

 applyPriceFilter(minPrice: string, maxPrice: string){
    this.selectedRating = null
    this.selectedCategoryId = null
    this.selectedBrand = null;
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
    this.selectedRating = null
    this.selectedCategoryId = null
    this.selectedBrand = null;
  this.https.getAllProducts(pageIndex, pageProductsSize).subscribe({
    next: (data:MainProductsObject) => {
      this.https.transferProductsAll.next(data)
      this.https.transferPageIndex.next(pageIndex)
    },
    error: (error) => console.log(error)
  })

  const sections = [
    { icon: this.icon1, element: this.categories },
    { icon: this.icon2, element: this.brands },
    { icon: this.icon3, element: this.ratings },
    { icon: this.icon4, element: this.priceFilter }
  ];

  sections.forEach(section => {
    section.icon.nativeElement.textContent = '+';
    section.element.nativeElement.style.display = 'none';
  });

  this.togglePriceWarning()
}


}
