import { Component, Input, Output, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Comment } from '../../models'

@Component({
  selector: 'app-upvote-btn',
  templateUrl: './upvote-btn.component.html',
  styleUrls: ['./upvote-btn.component.scss']
})
export class UpvoteBtnComponent {
  @Input() mainComponent: any;
  @Input() userId: string;
  @Input() componentType: string;

  constructor(
    private apiService: ApiService,
    private _snackbar: MatSnackBar
) { }

  ngOnInit(): void {}

  upvote(){
    if(this.userId){
      this.mainComponent.upvotes.push(this.userId);
      if(this.componentType === "comment"){
        this.apiService.updateComment(this.mainComponent._id!, this.mainComponent).subscribe((result:any) =>{});
      }
      if(this.componentType === "image"){
        this.apiService.upvoteImg(this.mainComponent._id,this.mainComponent).subscribe((result: any) =>{});
      }
    }else{
      this._snackbar.open("inicia sesión o crea una cuenta para poder votar en comentarios", '', {duration: 2500, panelClass: ['aac-red']});
    }
  }

  removeUpvote(){
    this.mainComponent.upvotes.splice(this.mainComponent.upvotes.indexOf(this.userId), 1);
    if(this.componentType === "comment"){
      this.apiService.updateComment(this.mainComponent._id!, this.mainComponent).subscribe((result:any) =>{});
    }
    if(this.componentType === "image"){
      this.apiService.upvoteImg(this.mainComponent._id,this.mainComponent).subscribe((result: any) =>{});
    }
  }

  loginToUpvote(){
    this._snackbar.open("inicia sesión o crea una cuenta para poder votar en comentarios", '', {duration: 2500, panelClass: ['aac-red']});
  }
}
