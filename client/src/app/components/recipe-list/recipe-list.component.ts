import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../../api.service'
import { User } from '../../models'
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent{
  @Input() isMobile!: boolean;
  @Input() recipes: any;
  categoryObj = {
    name : "",
    recipes: []
  };
  chapters: any[] = [
    {"name":"entremeses y bocas","recipes":[]},{"name":"caldos y sopas","recipes":[]},{"name":"huevos","recipes":[]},{"name":"pescados y mariscos","recipes":[]},{"name":"salsas","recipes":[]},{"name":"arroces","recipes":[]},{"name":"platos ligeros","recipes":[]},
    {"name":"pastas","recipes":[]},{"name":"verduras y hortalizas","recipes":[]},{"name":"ensaladas","recipes":[]},{"name":"aves","recipes":[]},{"name":"pavos","recipes":[]},{"name":"carne de cerdo","recipes":[]},{"name":"carne de res","recipes":[]},{"name":"dulces caseros","recipes":[]},
    {"name":"pasteles","recipes":[]},{"name":"postres livianos","recipes":[]},{"name":"cakes","recipes":[]},{"name":"comida tipica","recipes":[]},{"name":"dulces","recipes":[]},{"name":"refrescos, batidos y cocteles","recipes":[]}];
    categoryList: any[] = [];
  favoritesList: any[] = [];
  allRecipes: any[] = [];
  allTypes: string[] = [];
  searchResultRecipes: any[] = [];
  recipeHistory: any[] = [];
  userInfo: any;
  searchInputTxt = "";

  constructor(
    private apiService: ApiService,
    private router:Router
  ) { }

  async ngOnInit() {
    this.apiService.getUserInfo().subscribe((user:any) => {
      this.userInfo = user;  // Update local user info whenever it changes
    });
  }

  async ngOnChanges(){
    this.createOptionsList();
  }

  async createOptionsList(){
      this.recipes.forEach((r:any) => {
        // this.allRecipes.push(r);
        for(let i = 1; i < r.type.length;i++){
        // r.type.forEach((type:any) => {
          if(this.categoryList.length){
            let found = this.categoryList.find(e => e.name === r.type[i]);
            if(found){
              found.recipes.push(r);
            }
            if(!found){
              this.categoryList.push({
                name: r.type[i],
                recipes: [r]
              });
              this.allTypes.push(r.type[i]);
            }
          }else{
            this.categoryList.push({
              name: r.type[i],
              recipes: [r]
            });
            this.allTypes.push(r.type[i]);
          }
        }

        let foundChapter = this.chapters.find(e => e.name === r.type[0]);
        if(foundChapter){
          foundChapter.recipes.push(r);
        }

      });
      // console.log(`allTypes: ${this.allTypes}`);
  }

  showHideSearchResults(displayTxt:string){
    document.getElementById("first")!.style.display = displayTxt;
  }

  onKeyUpSearch(event:any){
    this.searchInputTxt = event.target.value;
    this.searchResultRecipes = [];
    if(this.searchInputTxt){
      this.recipes.forEach((recipe:any) => {
        if(recipe.name.includes(this.searchInputTxt.toUpperCase())){
          this.searchResultRecipes.push(recipe);
        }
      });
    }
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
