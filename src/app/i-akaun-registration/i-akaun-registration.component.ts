import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare const loadKeyboard: any;
declare const deleteKeyboard: any;
declare const closeKeyboard: any;

@Component({
  selector: 'app-i-akaun-registration',
  templateUrl: './i-akaun-registration.component.html',
  styleUrls: ['./i-akaun-registration.component.css']
})
export class IAkaunRegistrationComponent implements OnInit {

  @ViewChild('email') email : ElementRef | undefined;
  @ViewChild('emailDDL') emailDDL : ElementRef | undefined;

  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;
  page5 = false;
  page6 = false;
  page7 = false;
  page8 = false;
  phoneNo = "";
  emailAddress = "";

  emailList: string[] = ["aldantechnology.com", "gmail.com", "hotmail.com", "yahoo.com"];

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

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  page1no(){
    this.route.navigate(['mainMenu']);
  }

  page2yes(){

    if(this.email?.nativeElement.value != ""){
      this.page2 = false;
      this.page3 = true;
      this.emailAddress = this.email?.nativeElement.value + "@" + this.emailDDL?.nativeElement.value;
      deleteKeyboard();
    }
    
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

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  page4yes(){
    this.page4 = false;
    this.page5 = true;
  }

  page4no(){
    this.route.navigate(['mainMenu']);
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

  page6no(){
    this.page6 = false;
    this.page5 = true;
  }

  page7yes(){
    this.page7 = false;
    this.page8 = true;
  }

  page7no(){
    this.page7 = false;
    this.page6 = true;
  }

  page8yes(){
    this.route.navigate(['iSaraanShariahSavingsRegistration']);
  }

  page8no(){
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
