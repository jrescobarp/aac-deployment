import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../models'
import { ApiService } from '../../api.service'
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models'
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.scss']
})
export class ViewRecipeComponent{
  recipe: BehaviorSubject<Recipe> = new BehaviorSubject<Recipe>({
    _id: '',
    name:'',
    description: '',
    portions: '',
    steps: [],
    verbs: [],
    ingredients: [],
    type: [],
    connected_recipes: [],
    comments: [],
    featured_meal_count:0,
    book: [],
    images:[]
  });
  isMobile = false;
  userInfo : any;
  isFavorite = false;
  connectedRecipe: any;
  recipeDescription: any;
  recipeId = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private _snackbar: MatSnackBar,
  ) { }

  async ngOnInit() {
    if(window.innerWidth <= 1000){
      this.isMobile = true;
    };

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No id provided');
    }

    this.apiService.getUserInfo().subscribe((user:any) => {
      this.userInfo = user;  // Update local user info whenever it changes
    });

    this.apiService.getRecipe(id !).subscribe((recipe) => {
      this.recipe.next(recipe);
      this.recipeId = recipe._id!;
      const descriptionDiv = document.getElementById("descriptionDiv");
      let descTxt = recipe.description;

      // connected_recipes logic
      if(recipe.connected_recipes.length){
        this.connectedRecipe = recipe.connected_recipes;
          this.connectedRecipe.forEach((r:any, index:number) => {
            // [routerLink]=["/recipe","' + this.connectedRecipe[index]._id + '"]
            let linkTxt = '<a class="connectedRecipeLink" href="/recipe/' + this.connectedRecipe[index]._id + '" target="_blank" style="color: rgba(206,60,81,1) !important;">' + this.connectedRecipe[index].name.toLowerCase() + '</a>';
            descTxt = descTxt.replaceAll(this.connectedRecipe[index].name.toLowerCase(),linkTxt);
            recipe.ingredients = recipe.ingredients.map((str:string) => str.replace(new RegExp(this.connectedRecipe[index].name.toLowerCase(), 'gi'), linkTxt));
            recipe.steps = recipe.steps.map((str:string) => str.replace(new RegExp(this.connectedRecipe[index].name.toLowerCase(), 'gi'), linkTxt));
          });
      }
      this.createLI(recipe.ingredients,"ingredientList");
      this.createLI(recipe.steps,"stepsList");

      // description logic
      if(recipe.description.length){
        descriptionDiv!.setAttribute('style', 'display:block');
        descriptionDiv!.setAttribute('style', 'margin:.3em');
        let noteFound = descTxt.toLowerCase().search("nota:");
        let startIndex =0;
        let allNotes: string[] = [];

        if(noteFound >=0 && noteFound != 0){
          descriptionDiv!.innerHTML += descTxt.slice(0,noteFound);
          allNotes = descTxt.slice(noteFound).toLocaleLowerCase().split('nota:').filter(section => section.trim() !== '');
        }else if(noteFound >=0){
          allNotes = descTxt.toLocaleLowerCase().split('nota:').filter(section => section.trim() !== '');
        }else if(noteFound < 0){
          descriptionDiv!.innerHTML += descTxt;
        }

        for(let i =startIndex;i < allNotes.length;i++){
          const newNote = document.createElement("div");
          newNote.setAttribute('style', 'margin-top:1em');
          newNote.innerHTML = "Nota: "+ allNotes[i];
          descriptionDiv!.appendChild(newNote);
        }
      }
      if(this.userInfo){
        this.checkFavorites();
      }
      // console.log("RECIPEEE:", recipe);
    });

    // if(!this.userInfo){
    //   this.apiService.getUserInfo().subscribe((user:any) => {
    //     this.userInfo = user;  // Update local user info whenever it changes
    //     console.log("CF2");
    //     if(this.userInfo){
    //       this.checkFavorites();
    //     }
    //     console.log('Updated user info in commentDisplay:', this.userInfo);
    //   });
    // }
  }

  // check for : in ingredients and steps (dont add number or dot to those steps/ingredients)

  copyToClipboard(type:string){
    let copyTxt = "";
    if(type === "all"){
      copyTxt += this.recipe.value.name + "\n\n";
    }
    if(type === "ingredients" || type === "all"){
      this.recipe.value.ingredients.forEach((element, index) => {
        copyTxt += element + (index < (this.recipe.value.ingredients.length - 1) ? "\n" : "");
      });
      copyTxt += "\n\n";
    }
    if(type === "steps" || type === "all"){
      this.recipe.value.steps.forEach((element, index) => {
        copyTxt += (index + 1) + ". "+ element + (index < (this.recipe.value.steps.length - 1) ? "\n" : "");
      });
      copyTxt += "\n\n";
    }
    navigator.clipboard.writeText(copyTxt);
  }

  checkFavorites(){
    this.userInfo.recipes.forEach((element:any) => {
      if(element._id === this.recipe.value._id){
        this.isFavorite = true;
      }
    });
  }

  addRecipeToFavorites(){
    this.checkFavorites();
    if(!this.isFavorite){
      this.userInfo.recipes.push(this.recipe.value!);
      this.apiService.updateUser(this.userInfo._id!, this.userInfo).subscribe((userInfo:any)=>{
        this._snackbar.open(this.recipe.value.name + " ha sido agregada a tu lista de favoritos", '', {duration: 2500, panelClass: ['aac-green']});
        this.isFavorite = true;
      });
    }else{
      this._snackbar.open("Ya esta la receta en tu lista de favoritos", '', {duration: 2500, panelClass: ['aac-red']});
    }
  }

  removeRecipeFromFavorites(){
    this.userInfo.recipes.forEach((element:any, index:any) => {
      if(element._id === this.recipe.value._id){
        this.userInfo.recipes.splice(index, 1);
      }
    });
    this.apiService.updateUser(this.userInfo._id!, this.userInfo).subscribe((userInfo:any)=>{
      this.isFavorite = false;
      this._snackbar.open(this.recipe.value.name + " ha sido borrado de tu lista de favoritos", '', {duration: 2500, panelClass: ['aac-red']});
    });
  }

  recheckFavorites($event:any){

    // if($event === "logout"){
    //   this.
    // }else{
    //   this.userInfo = JSON.parse($event);
    // }
    // this.checkFavorites();
  }

  createLI(values:any,listId:string){
    let list = document.getElementById(listId);
    values.forEach((element:any) => {
      const newLi = document.createElement("li");
      newLi.innerHTML = element;
      list!.appendChild(newLi);
    });
  }

}
