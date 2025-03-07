import { Component, Input, Output, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Comment, User } from '../../models'
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.scss']
})
export class CommentsSectionComponent {
  @Input() comments_arr: any[];
  @Input() isMobile!: boolean;
  @Input() parentObject: any;
  @Input() parentType: any;
  @Input() mainCommentSection: boolean;
  showBtns = false;
  replyTxt = "";
  userInfo : any;
  comment : Comment = {
    user_id: "",
    username: "",
    text: "",
    upvotes: [],
    date_created: 0,
    replies: [],
    parent_id: "",
    parent_type: "",
    update_arr: []
  };

  constructor(
    private apiService: ApiService,
    private _snackbar: MatSnackBar
) { }

  ngOnInit(){
    this.apiService.getUserInfo().subscribe((user:any) => {
      this.userInfo = user;  // Update local user info whenever it changes
      console.log('Updated user info in commentDisplay:', this.userInfo);
    });
  }

  resetComment(){
    this.comment = {
      user_id: "",
      username: "",
      text: "",
      upvotes: [],
      date_created: 0,
      replies: [],
      parent_id: "",
      parent_type: "",
      update_arr: []
    }
  }

  commentBtnToggle(setToggle:boolean){
    if(this.userInfo){
      this.showBtns = setToggle;
    }else{
      this._snackbar.open("inicia sesión o crea una cuenta para comentar", '', {duration: 2500, panelClass: ['aac-red']});
    }
  }

  submitComment(id:string, updateArr: [], parentType: string, reply = false,replyIndex = -1){
    this.comment.user_id = this.userInfo._id ? this.userInfo._id : '';
    this.comment.username = this.userInfo.username ? this.userInfo.username : '';
    this.comment.date_created = Date.now();
    this.comment.parent_id = id;
    // this.comment.update_arr = updateArr;
    this.comment.update_arr = JSON.parse(JSON.stringify(updateArr));
    this.comment.parent_type = parentType;
    if(reply){
      this.comment.text = this.replyTxt;
    }

    this.apiService.createComment(this.comment).subscribe((result: any) =>{
      this.comment._id = JSON.parse(result)._id;
      let dereferComment = { ...this.comment, replies: [] };
      if(reply){
        this.parentObject.comments[replyIndex].replies.push(dereferComment);
        this.replyTxt = "";
      }else{
        this.parentObject.comments.push(dereferComment);
      }
      if(!this.comments_arr.length){
        this.comments_arr.push(dereferComment);
      }
      this.resetComment();
    });
  }

  showReplyInput(id:string, showTxt:string){
    if(this.userInfo){
      document.getElementById(id + "-comment")!.style.display=showTxt;
    }else{
      this._snackbar.open("inicia sesión o crea una cuenta para comentar", '', {duration: 2500, panelClass: ['aac-red']});
    }
    // document.getElementById(id + "-comment")!.style.display=showTxt;
  }

  viewReplies(id:string, comment: any, index: number){
    let el = document.getElementById(id + "-" + index + "-comment-replies");
    let chevron = document.getElementById(id + "-" + index + "-comment-replies-chevron");
    if(el!.style.display === "none"){
      el!.style.display = '';
      chevron!.classList.remove('fa-chevron-down');
      chevron!.classList.add('fa-chevron-up');
    }else{
      el!.style.display = 'none';
      chevron!.classList.remove('fa-chevron-up');
      chevron!.classList.add('fa-chevron-down');
    }
  }

  filtrarComentariosUpvotes(path:string, type:string){
    if(type === 'desc'){
      this.parentObject.comments.sort((a:any, b:any) => {
        // new to old
        if (a[path].length > b[path].length) {return -1;}
        if (a[path].length < b[path].length) {return 1;}
        return 0;
      });
    }else{
      this.parentObject.comments.sort((a:any, b:any) => {
        // new to old
        if (a[path].length < b[path].length) {return -1;}
        if (a[path].length > b[path].length) {return 1;}
        return 0;
      });
    }
  }

  filtrarComentariosDate(path:string, type:string){
    if(type === 'desc'){
      this.parentObject.comments.sort((a:any, b:any) => {
        // new to old
        if (a[path] > b[path]) {return -1;}
        if (a[path] < b[path]) {return 1;}
        return 0;
      });
    }else{
      this.parentObject.comments.sort((a:any, b:any) => {
        // new to old
        if (a[path] < b[path]) {return -1;}
        if (a[path] > b[path]) {return 1;}
        return 0;
      });
    }
  }
}
