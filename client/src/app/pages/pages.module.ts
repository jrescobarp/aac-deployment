import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ComponentsModule } from '../components/components.module'
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';
import {MatTooltipModule} from '@angular/material/tooltip';



@NgModule({
  declarations: [
    HomeComponent,
    ViewRecipeComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MatTooltipModule,
  ]
})
export class PagesModule { }
