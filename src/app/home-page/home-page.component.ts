import { Component, OnInit } from '@angular/core';
import { APIconnectionService } from '../apiconnection.service';
import { HomePageChildComponent } from "./home-page-child/home-page-child.component";
import { RouterModule } from '@angular/router';
import { Products } from '../products';

@Component({
  selector: 'app-home-page',
  imports: [HomePageChildComponent, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  constructor(private https: APIconnectionService){
   
  }
  
  ngOnInit(): void {
    this.changeIndex()
    this.getBestSellers()
  }



  public welcomeSectionImages: string [] = [
    "https://static.wixstatic.com/media/c837a6_9c1280daaeb0481abc58e6e236efdf59~mv2.png/v1/fill/w_1901,h_706,al_br,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_9c1280daaeb0481abc58e6e236efdf59~mv2.png",
    "https://static.wixstatic.com/media/c837a6_837f9cd4f59146c3ad47a2bd882fedfd~mv2.png/v1/fill/w_1901,h_706,al_r,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_837f9cd4f59146c3ad47a2bd882fedfd~mv2.png",
    "https://static.wixstatic.com/media/c837a6_f58829a26e594ca3aa72383e19cf39b9~mv2.png/v1/fill/w_1901,h_706,al_r,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_f58829a26e594ca3aa72383e19cf39b9~mv2.png"
  ]

  public indexOfImage: number = 0;
  public bestSellers: Products[] = []

  changeIndex(){
    setInterval(() => {
      this.indexOfImage++
      if(this.indexOfImage == 3){
        this.indexOfImage = 0
      }
    }, 5000);
  }

  getBestSellers(){
    this.https.getBestSellers().subscribe({
      next: (data:any) => {this.bestSellers = data.products},
      error: (error) => console.log(error),
    })
  }
}
