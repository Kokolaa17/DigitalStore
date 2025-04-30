import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { APIconnectionService } from '../../apiconnection.service';
import { Categorys } from '../../categorys';
import { MainProductsObject } from '../../main-products-object';



@Component({
  selector: 'app-aside-section',
  imports: [],
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

  @ViewChild("chosenCategory") public chosenCategory! :ElementRef;

  public filteredProducts: MainProductsObject = {} as MainProductsObject;
  
  

  chooseCategoryes() {
    const currentIcon = this.icon1.nativeElement.textContent;
    this.brands.nativeElement.style.display = "none"
    this.icon2.nativeElement.textContent = "+"
    this.ratings.nativeElement.style.display = "none"
    this.icon3.nativeElement.textContent = "+"
  
  
    if (currentIcon === "+") {
      this.icon1.nativeElement.textContent = "-";
      this.categories.nativeElement.style.display = "flex";
    } else {
      this.icon1.nativeElement.textContent = "+";
      this.categories.nativeElement.style.display = "none";
    }
  }

  chooseBrands(){
    const currentIcon = this.icon2.nativeElement.textContent;
    this.categories.nativeElement.style.display = "none"
    this.icon1.nativeElement.textContent = "+"
    this.ratings.nativeElement.style.display = "none"
    this.icon3.nativeElement.textContent = "+"
  

    if (currentIcon === "+") {
      this.icon2.nativeElement.textContent = "-";
      this.brands.nativeElement.style.display = "flex";
    } else {
      this.icon2.nativeElement.textContent = "+";
      this.brands.nativeElement.style.display = "none";
    }
  }

  chooseRatings(){
    const currentIcon = this.icon3.nativeElement.textContent;
    this.categories.nativeElement.style.display = "none"
    this.icon1.nativeElement.textContent = "+"
    this.brands.nativeElement.style.display = "none"
    this.icon2.nativeElement.textContent = "+"
  

    if (currentIcon === "+") {
      this.icon3.nativeElement.textContent = "-";
      this.ratings.nativeElement.style.display = "flex";
    } else {
      this.icon3.nativeElement.textContent = "+";
      this.ratings.nativeElement.style.display = "none";
    }
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
}
