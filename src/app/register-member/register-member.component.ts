import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


declare const loadKeyboard: any;
declare const deleteKeyboard: any;
declare const closeKeyboard: any;

@Component({
  selector: 'app-register-member',
  templateUrl: './register-member.component.html',
  styleUrls: ['./register-member.component.css']
})
export class RegisterMemberComponent implements OnInit {

  RegKWSP = true;
  RegShariah = false;
  RegSaraan = false;
  RegIAkaun = false;
  page1 = false;
  page2 = false;
  page3 = false;
  page4 = false;
  page5 = false;
  page6 = false;
  page7 = false;
  page8 = false;
  page9 = false;
  page10 = false;
  page11 = false;
  page12 = false;
  page13 = false;
  page14 = true;

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
  }

  ngAfterViewInit(){
    loadKeyboard();
  }

  page1yes(){
    this.page1 = false;
    this.page2 = true;
  }

  page1no(){
    this.route.navigate(['mainMenu']);
  }

  page2yes(){
    this.page2 = false;
    this.page3 = true;
  }

  page2no(){
    this.page2 = false;
    this.page1 = true;
  }

  page3yes(){
    this.page3 = false;
    this.page4 = true;
  }

  page3no(){
    this.page3 = false;
    this.page2 = true;
  }

  page4yes(){
    this.page4 = false;
    this.page5 = true;
  }

  page4no(){
    this.page4 = false;
    this.page3 = true;
  }

  page5yes(){
    this.page5 = false;
    this.page6 = true;
  }

  page5no(){
    this.page5 = false;
    this.page4 = true;
  }

  page6yes(){
    this.page6 = false;
    this.page7 = true;
  }

  

 

}