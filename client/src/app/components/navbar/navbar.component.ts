import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() recName: string;
  @Input() path: string;
  @Input() showProfileDropdown: boolean = false;
  @Output() logInChange = new EventEmitter<any>();

  isMobile = false;

  ngOnInit(): void {
    if(window.innerWidth <= 1000){
      this.isMobile = true;
    };
  }

  hover(imgName:string) {
    var el = document.getElementById("navUserIcon");
    el!.setAttribute('src', '../../../assets/'+imgName);
  }

  userChange($event:any){
    this.logInChange.emit($event);
  }

}
