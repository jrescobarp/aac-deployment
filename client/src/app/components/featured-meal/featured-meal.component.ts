import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../api.service';
import { lastValueFrom} from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-meal',
  templateUrl: './featured-meal.component.html',
  styleUrls: ['./featured-meal.component.scss']
})
export class FeaturedMealComponent implements OnInit {
  @Input() featuredRecipeArr: any[];
  @Input() defaultFeaturedMealArr: any[];
  @Input() isMobile!: boolean;
  @Input() isHomePage: boolean;
  recipeImg = [];
  featuredMeals: any[];
  appsArr : any[] = [];
  entreeArr : any[] = [];
  dessertArr : any[] = [];
  randNumArr: number [] = [];
  userInfo: any;
  defaultMeals = false;
  featuredMealSetTime = 0;
  recipeHistory: any[] = [];

 constructor(private apiService: ApiService, private cdRef: ChangeDetectorRef, private router:Router ) {}

  ngOnInit(): void {
    this.apiService.getUserInfo().subscribe((user:any) => {
      this.userInfo = user;  // Update local user info whenever it changes
      console.log('Updated user info in RecipeDisplay:', this.userInfo);
    });

    this.appsArr = JSON.parse(localStorage.getItem("appsArr") || "[]");
    this.entreeArr = JSON.parse(localStorage.getItem("entreeArr") || "[]");
    this.dessertArr = JSON.parse(localStorage.getItem("dessertArr") || "[]");
    this.featuredMealSetTime = Number(localStorage.getItem("featuredMealSetTime"));

    if (this.appsArr.length && this.entreeArr.length && this.dessertArr.length) {
      if(!this.featuredMealSetTime || (Date.now() > Number(this.featuredMealSetTime + 86400000))){
      // if(!this.featuredMealSetTime || (Date.now() > Number(this.featuredMealSetTime + 10000))){
        this.createFeaturedMealArr();
        localStorage.setItem("featuredMealSetTime",Date.now().toString());
      }else{
        this.featuredMeals = JSON.parse(localStorage.getItem("featuredMealArr") || "[]");
      }
    }else{
      this.defaultMeals = false;
      this.featuredMeals = [
        {"_id":"646d63f27cf61a3d4d0df216","name":"FUNDIDO DE CAMARONES","description":"","portions":"","steps":["ponga esta pasta en trastos redondos y alrededor, galletas o pedacitos de pan tostado","debe poner un cuchillo para que cada invitado unte su porción en las galletas o pan"],"verbs":[""],"ingredients":["1/4 taza de leche","1 taza de mayonesa ","1cda. salsa inglesa ","pedacito de ajo","1 cebolla pequeila","2 gotas de chile ","6 onz.de camaron cocido y escurrido","1/2 lb. de queso kraft","galletas saladas Club social para poner alrededor del tazón","licúe todos los ingredientes","pruebe si está bien de sal"],"type":["entremeses y bocas","appetizer","ligero","snack","mariscos","camaron"],"connected_recipes":[],"comments":[],"book":["Aprendamos a Cocinar 1"],"images":[]},
        {"_id":"67a111969b2378e7b33e30fa","name":"LASAGNA DE CARNE","description":"","portions":"","steps":["en la licuadora ponga 2 huevos con las 2 cdas. de agua hirviendo y bata para unir bien","vierta esta mezcla en un tazón y agregue las 2 tazas de harina","amase un rato con la mano hasta unir todo bien","envuelva esto en papel encerado y ponga sobre algo tibio y esté dando vueltas para que la masa se ponga flexible","luego extienda sobre la tabla enharinada y con el rodillo a dejarla delgadita","corte las piezas de lasagna, tiras largas de más o menos 2 pulgadas de ancho","cuézala en agua hirviendo, con sal v aceite durante 15 minutos","deje reposar en agua del chorro por 1 o 2 horas","escurra bastante y póngala sobre manta húmeda para que no se peguen unas con, otras o compre pasta de lasagna comercial (1 Ibra.)","al dejarla en agua del chorro la pasta se pone mucho más ancha"],"verbs":["bata","cueza"],"ingredients":["pasta preparada en casa, pasta fresca","2 huevos","2 ctas.de agua hirviendo","2 tazas de Harina Todo Uso"],"type":["pastas"],"connected_recipes":[],"book":["Aprendamos a Cocinar 1"],"comments":[],"images":[]},
        {"_id":"67b40417d6ae91b8574a10a2","name":"PASTEL DE PIÑA","description":"","portions":"","steps":["reduzca el jugo de limón a dos cdas","reduzca el azúcar de 3/4 a 2/3 de taza","añada 2/3 de taza de piña picadita al relleno caliente","siga el mismo procedimiento que para el pastel de merengue limon"],"verbs":[""],"ingredients":["una concha básica para pasteles","2/3 taza de azúcar","7 cdas. de Harina Todo Uso","2 cdas. de maicena","1/2 cdta. de sal","2 1/4 tazas de agua hirviendo","3 yemas","1/4 taza de azúcar","2 cdas. de jugo de limón","3 cdas. de rallo de limón","3 claras de huevos"],"type":["pasteles"],"connected_recipes":["67b403b4ae93fed80bd3b0b8","67b40229943d0706f346a678"],"book":["Aprendamos a Cocinar 1"],"comments":[],"images":[]}
      ];
    }
  }

  randNumGenerator(num:number, index:number){
    if(!this.randNumArr[index]){
      this.randNumArr[index] = Math.floor((Math.random() * num));
    }
    return this.randNumArr[index];
  }

  async createFeaturedMealArr(){
    if (this.appsArr.length === 0 || this.entreeArr.length === 0 || this.dessertArr.length === 0) {
      console.error('One or more arrays are empty, cannot create featured meal.');
      this.defaultMeals = false;
      this.featuredMeals = [
        {"_id":"646d63f27cf61a3d4d0df216","name":"FUNDIDO DE CAMARONES","description":"","portions":"","steps":["ponga esta pasta en trastos redondos y alrededor, galletas o pedacitos de pan tostado","debe poner un cuchillo para que cada invitado unte su porción en las galletas o pan"],"verbs":[""],"ingredients":["1/4 taza de leche","1 taza de mayonesa ","1cda. salsa inglesa ","pedacito de ajo","1 cebolla pequeila","2 gotas de chile ","6 onz.de camaron cocido y escurrido","1/2 lb. de queso kraft","galletas saladas Club social para poner alrededor del tazón","licúe todos los ingredientes","pruebe si está bien de sal"],"type":["entremeses y bocas","appetizer","ligero","snack","mariscos","camaron"],"connected_recipes":[],"comments":[],"book":["Aprendamos a Cocinar 1"],"images":[]},
        {"_id":"67a111969b2378e7b33e30fa","name":"LASAGNA DE CARNE","description":"","portions":"","steps":["en la licuadora ponga 2 huevos con las 2 cdas. de agua hirviendo y bata para unir bien","vierta esta mezcla en un tazón y agregue las 2 tazas de harina","amase un rato con la mano hasta unir todo bien","envuelva esto en papel encerado y ponga sobre algo tibio y esté dando vueltas para que la masa se ponga flexible","luego extienda sobre la tabla enharinada y con el rodillo a dejarla delgadita","corte las piezas de lasagna, tiras largas de más o menos 2 pulgadas de ancho","cuézala en agua hirviendo, con sal v aceite durante 15 minutos","deje reposar en agua del chorro por 1 o 2 horas","escurra bastante y póngala sobre manta húmeda para que no se peguen unas con, otras o compre pasta de lasagna comercial (1 Ibra.)","al dejarla en agua del chorro la pasta se pone mucho más ancha"],"verbs":["bata","cueza"],"ingredients":["pasta preparada en casa, pasta fresca","2 huevos","2 ctas.de agua hirviendo","2 tazas de Harina Todo Uso"],"type":["pastas"],"connected_recipes":[],"book":["Aprendamos a Cocinar 1"],"comments":[],"images":[]},
        {"_id":"67b40417d6ae91b8574a10a2","name":"PASTEL DE PIÑA","description":"","portions":"","steps":["reduzca el jugo de limón a dos cdas","reduzca el azúcar de 3/4 a 2/3 de taza","añada 2/3 de taza de piña picadita al relleno caliente","siga el mismo procedimiento que para el pastel de merengue limon"],"verbs":[""],"ingredients":["una concha básica para pasteles","2/3 taza de azúcar","7 cdas. de Harina Todo Uso","2 cdas. de maicena","1/2 cdta. de sal","2 1/4 tazas de agua hirviendo","3 yemas","1/4 taza de azúcar","2 cdas. de jugo de limón","3 cdas. de rallo de limón","3 claras de huevos"],"type":["pasteles"],"connected_recipes":["67b403b4ae93fed80bd3b0b8","67b40229943d0706f346a678"],"book":["Aprendamos a Cocinar 1"],"comments":[],"images":[]}
      ];
      return;
    }
    this.featuredMeals = [];

    // get date time
    // truncate date after T
    // get timestamp of date
    // use truncated string%arr length to set a deterministic recipe

    let appArrNum = (Math.round(Math.random() * 100))%this.appsArr.length;
    // this.featuredMeals.push(this.appsArr[appArrNum]);
    let appetizer = await lastValueFrom(this.apiService.getRecipe(this.appsArr[appArrNum]._id));
    this.featuredMeals.push(appetizer);

    let entreeArrNum = (Math.round(Math.random() * 100))%this.entreeArr.length;
    let entree = await lastValueFrom(this.apiService.getRecipe(this.entreeArr[entreeArrNum]._id));
    this.featuredMeals.push(entree);
    // this.featuredMeals.push(this.entreeArr[entreeArrNum]);
    // this.apiService.getRecipe(this.entreeArr[entreeArrNum]._id).subscribe((recipe) => {
    //   this.featuredMeals.push(recipe);
    // });

    let dessertArrNum = (Math.round(Math.random() * 100))%this.dessertArr.length;
    let dessert = await lastValueFrom(this.apiService.getRecipe(this.dessertArr[dessertArrNum]._id));
    this.featuredMeals.push(dessert);
    // this.featuredMeals.push(this.dessertArr[dessertArrNum]);
    // this.apiService.getRecipe(this.dessertArr[dessertArrNum]._id).subscribe((recipe) => {
    //   this.featuredMeals.push(recipe);
    // });

    // this.featuredMeals.forEach((rec,i) => {
    //   this.apiService.getRecipe().subscribe((recipe) => {
    //     this.recipe.next(recipe);
    //   });
    // });

    localStorage.setItem("featuredMealArr",JSON.stringify(this.featuredMeals));
  }

  recipeRedirect(recipe : any){
    if(this.userInfo){
      this.recipeHistory = localStorage.getItem("recipeHistory") ? JSON.parse(localStorage.getItem("recipeHistory")!) : [];
      const foundDuplicateIndex = this.recipeHistory.findIndex(e => e._id === recipe._id);
      if (foundDuplicateIndex > -1) {
        this.recipeHistory.splice(foundDuplicateIndex, 1);
      }
      if(this.recipeHistory.length === 30){
        this.recipeHistory.splice(0, 1);
      }
      this.recipeHistory.push(recipe);
      this.userInfo.recipe_history = this.recipeHistory;
      localStorage.setItem("recipeHistory", JSON.stringify(this.recipeHistory));
      this.apiService.updateUser(this.userInfo._id!, this.userInfo).subscribe((user) => {});
      this.router.navigate(['/recipe', recipe._id]);
    }else{
      this.router.navigate(['/recipe', recipe._id]);
    }
  }
}
