import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare const loadKeyboard: any;
declare const deleteKeyboard: any;
declare const closeKeyboard: any;

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent implements OnInit {
  page1 = true;
  page2 = false;
  page3 = false;

  address1 = "NO 46";
  address2 = "JALAN BP 10/1";
  address3 = "BANDAR BUKIT PUCHONG 2";
  postcode = "47170";
  city = "PUCHONG";
  state = "SELANGOR DAHRUL EHSAN";
  country = "MALAYSIA";
  homeNo = "";
  officeNo = "";
  phoneNo = "";
  email = "wahyu@aldantechnology.com";

  spacer = " ";
  comma = ", ";

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  page1yes(){
    this.page1 = false;
    this.page2 = true;

    deleteKeyboard();
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

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  page3yes(){
    this.route.navigate(['mainMenu']);
  }


}
