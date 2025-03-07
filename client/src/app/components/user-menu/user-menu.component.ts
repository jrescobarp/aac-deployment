import { Component, Output, EventEmitter, Input } from '@angular/core';
import { User, Recipe } from "../../models"
import { ApiService  } from '../../api.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {

  // @Input() user: any;
  @Input() dropdownDisplay: boolean = false;
  @Input() isMobile!: boolean;
  @Output() logInChange = new EventEmitter<any>();
  loggedIn = false;
  userInfo: any;
  recipe_history: Recipe[] = [];

  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    private _snackbar: MatSnackBar,
    private router:Router) {}

  ngOnInit(): void {
    this.apiService.getUserInfo().subscribe((user:any) => {
      this.userInfo = user;  // Update local user info whenever it changes
      if(this.userInfo){
        this.updateUserInfo();
      }else{
        this.loggedIn = false;
        this.userInfo = null;
      }
      console.log('Updated user info in UserComp:', this.userInfo);
    });
  }

  ngOnChanges(){
    if(this.apiService.getUser()){
      this.userInfo = this.apiService.getUser();
      this.updateUserInfo();
    }
  }


  updateUserInfo(){
    this.loggedIn =true;
    // this.userInfo = userInfo;
    localStorage.setItem("recipeHistory", JSON.stringify(this.userInfo.recipe_history));
    this.recipe_history = this.userInfo.recipe_history;
  }

  async updateloginStatus($event:any){
    this.loggedIn = !this.loggedIn;
    this.userInfo = JSON.parse($event);
    this._snackbar.open("aprendamos a cocinar!", '', {duration: 2000, panelClass: ['aac-green']});
    this.logInChange.emit($event);
  }

  openModal(content:any) {
    this.modalService.open(content, { size:'lg', centered: true, ariaLabelledBy: 'modal-basic-title' });
	}

  logout(){
    this.apiService.logout().subscribe(result =>{
      this.userInfo = result;
      this.loggedIn = false;
      localStorage.setItem("recipeHistory", '[]');
      this._snackbar.open("sesión ha sido cerrada", '', {duration: 2500, panelClass: ['aac-red']});
      this.apiService.setUserInfo(null);
    });
  }

  recipeRedirect(recipe : any){
    if(this.userInfo){
      this.recipe_history = localStorage.getItem("recipeHistory") ? JSON.parse(localStorage.getItem("recipeHistory")!) : [];
      const foundDuplicateIndex = this.recipe_history.findIndex(e => e._id === recipe._id);
      if (foundDuplicateIndex > -1) {
        this.recipe_history.splice(foundDuplicateIndex, 1);
      }
      if(this.recipe_history.length === 30){
        this.recipe_history.splice(0, 1);
      }
      this.recipe_history.push(recipe);
      this.userInfo.recipe_history = this.recipe_history;
      localStorage.setItem("recipeHistory", JSON.stringify(this.recipe_history));
      this.apiService.updateUser(this.userInfo._id!, this.userInfo).subscribe((user) => {});
      this.modalService.dismissAll();
      this.router.navigate(['/recipe', recipe._id]);
    }else{
      this.modalService.dismissAll();
      this.router.navigate(['/recipe', recipe._id]);
    }
  }

}
