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
  page1 = true;
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
  page14 = false;

  phoneNo = "";


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

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  page2no(){
    this.page2 = false;
    this.page1 = true;

    deleteKeyboard();
  }

  page3yes(){
    this.page3 = false;
    this.page4 = true;

    deleteKeyboard()
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

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  page5yes(){
    this.page5 = false;
    this.page6 = true;
  }

  page6yes(){
    this.page6 = false;
    this.page7 = true;

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  page6no(){
    this.page6 = false;
    this.page5 = true;
  }

  page7yes(){
    this.page7 = false;
    this.page8 = true;

    deleteKeyboard()
  }

  page7no(){
    this.page7 = false;
    this.page6 = true;
  }

  page8yes(){
    this.page8 = false;
    this.page9 = true;
  }

  selectiSaraan(){
    this.page9 = false;
    this.page12 = true;
  }

  selectShariah(){
    this.page9 = false;
    this.page10 = true;
  }

  page10yes(){
    this.page10 = false;
    this.page11 = true;
  }

  page10no(){
    this.page10 = false;
    this.page9 = true;
  }

  page11yes(){
    this.page11 = false;
    this.page12 = true;
  }

  page12yes(){
    this.page12 = false;
    this.page13 = true;
  }

  page12no(){
    this.route.navigate(['mainMenu']);
  }

  page13yes(){
    this.page13 = false;
    this.page14 = true;
  }

  page13no(){
    this.page13 = false;
    this.page12 = true;
  }

  page14yes(){
    this.route.navigate(['mainMenu']);
  }


  click1(){
    if(this.phoneNo.length < 10) this.phoneNo += "1";
  }

  click2(){
    if(this.phoneNo.length < 10) this.phoneNo += "2";
  }

  click3(){
    if(this.phoneNo.length < 10) this.phoneNo += "3";
  }

  click4(){
    if(this.phoneNo.length < 10) this.phoneNo += "4";
  }

  click5(){
    if(this.phoneNo.length < 10) this.phoneNo += "5";
  }

  click6(){
    if(this.phoneNo.length < 10) this.phoneNo += "6";
  }

  click7(){
    if(this.phoneNo.length < 10) this.phoneNo += "7";
  }

  click8(){
    if(this.phoneNo.length < 10) this.phoneNo += "8";
  }

  click9(){
    if(this.phoneNo.length < 10) this.phoneNo += "9";
  }

  click0(){
    if(this.phoneNo.length < 10) this.phoneNo += "0";
  }

  clickDel(){
    this.phoneNo = this.phoneNo.substring(0, this.phoneNo.length - 1);
  }
  

 

}