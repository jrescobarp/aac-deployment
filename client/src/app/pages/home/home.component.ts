import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe, User } from '../../models';
import { ApiService } from '../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  recipes$: any = [];
  isMobile = false;
  featuredMeals: any[] = [];
  appsArr : any[]= [];
  entreeArr : any[]= [];
  dessertArr: any[]= [];
  defaultFeaturedMealArr: any[] = [];

 constructor(private apiService: ApiService, private _snackbar: MatSnackBar,private cdRef: ChangeDetectorRef, private ngZone: NgZone) { }

  async ngOnInit() {

    const recipes = await this.apiService.getRecipes();
    this.recipes$ = recipes;

    if(!localStorage.getItem("appsArr") || !localStorage.getItem("entreeArr") || !localStorage.getItem("dessertArr")){
      this.createLocalStorageArrays();
    }else{
      this.checkForRecipeChanges();
    }

    if(window.innerWidth <= 1000){
      this.isMobile = true;
    };
  }

  createLocalStorageArrays(){
    this.recipes$.forEach((r:any) => {
      if(r.type[0] === "entremeses y bocas" || r.type[0] === "ensaladas" || r.type[0] === "huevos" || r.type[0] === "caldos y sopas" || r.type[0] === "platos ligeros"){
        this.appsArr.push(r);
      }
      if(r.type[0] === "carne de res" || r.type[0] === "comida tipica" || r.type[0] === "carne de cerdo" || r.type[0] === "pavos" || r.type[0] === "aves" || r.type[0] === "pastas" || r.type[0] === "arroces" || r.type[0] === "pescados y mariscos"){
        this.entreeArr.push(r);
      }
      if(r.type[0] === "pasteles" || r.type[0] === "dulces caseros" || r.type[0] === "postres livianos" || r.type[0] === "cakes" || r.type[0] === "dulces"){
        this.dessertArr.push(r);
      }
    });
    localStorage.setItem("appsArr", JSON.stringify(this.appsArr));
    localStorage.setItem("entreeArr", JSON.stringify(this.entreeArr));
    localStorage.setItem("dessertArr", JSON.stringify(this.dessertArr));
  }

  findLowestFeaturedCount(arr:any, type:string){
    let fCount = 100000000;
    let lowestCountElement;
    for(const element of arr) {
      if(!element.featuredCount){
        element.featuredCount++;
        localStorage.setItem(type,JSON.stringify(arr));
        return element.id;
      }else if(element.featuredCount < fCount){
        lowestCountElement = element;
        fCount = element.featuredCount;
      }
    };
    lowestCountElement.featuredCount++;
    localStorage.setItem(type,JSON.stringify(arr));
    return lowestCountElement.id;
  }

  checkForRecipeChanges(){
    this.appsArr = JSON.parse(localStorage.getItem("appsArr") || "[]");
    this.entreeArr = JSON.parse(localStorage.getItem("entreeArr") || "[]");
    this.dessertArr = JSON.parse(localStorage.getItem("dessertArr") || "[]");
    this.featuredMeals = JSON.parse(localStorage.getItem("featuredMealArr") || "[]");

    if(this.appsArr.length > 0){
      this.searchArrayandUpdate(this.appsArr, "appsArr");
    }

    if(this.entreeArr.length > 0){
      this.searchArrayandUpdate(this.entreeArr, "entreeArr");
    }
    if(this.dessertArr.length > 0){
      this.searchArrayandUpdate(this.dessertArr, "dessertArr");
    }
  }

  searchArrayandUpdate(array:any, type:string){
    array.forEach((recipe:any,index:number) => {
      let found = this.recipes$.find(({ _id }:any) => _id === recipe._id);
      if(found && (JSON.stringify(recipe) != JSON.stringify(found))){
        array.splice(index,1,found);
        localStorage.setItem(type, JSON.stringify(array));

        // check featured meal array for changed recipe:
        this.featuredMeals.forEach((fmRecipe,i) => {
          if(fmRecipe._id === found._id){
            this.featuredMeals.splice(i,1,found);
            localStorage.setItem("featuredMealArr", JSON.stringify(this.featuredMeals));
          }
        });
      }
    });
  }

}
