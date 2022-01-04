import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-thumbprint-confirmation',
  templateUrl: './thumbprint-confirmation.component.html',
  styleUrls: ['./thumbprint-confirmation.component.css']
})
export class ThumbprintConfirmationComponent implements OnInit {

  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;
  popup = false;

  checkedAnsuran = false;
  checkedBina = false;
  checked50yo = false;
  checked55yo = false;
  checkedEducation = false;
  checked1mil = false;

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
  }

  




  checkAnsuran(){
    this.checkedAnsuran = !this.checkedAnsuran;
  }

  checkBina(){
    this.checkedBina = !this.checkedBina;
  }

  check50yo(){
    this.checked50yo = !this.checked50yo;
  }

  checkEducation(){
    this.checkedEducation = !this.checkedEducation;
  }

  check1mil(){
    this.checked1mil = !this.checked1mil;
  }

  check55yo(){
    this.checked55yo = !this.checked55yo;
  }

  page1yes(){
    this.page1 = false;
    this.page2 = true;
  }

  page1no(){
    this.route.navigate(['mainMenu']);
  }

  page2no(){
    this.page2 = false;
    this.page1 = true;
  }

  page2yes(){
    let x = 0;
    if(this.checkedAnsuran == false) x++;
    if(this.checkedBina == false) x++;
    if(this.checked50yo == false) x++;
    if(this.checkedEducation == false) x++;
    if(this.checked1mil == false) x++;
    if(this.checked55yo == false) x++;

    if(x > 0) this.popup= true;
    else {
      this.page2 = false;
      this.page3 = true;
    }
  }

  page3no(){
    this.page3 = false;
    this.page2 = true;
  }

  page4no(){
    this.route.navigate(['mainMenu']);
  }

  page4yes(){
    this.route.navigate(['mainMenu']);
  }

  popupYes(){
    this.popup = false;
    this.page2 = false;
    this.page3 = true;
  }

  skip(){
    this.page3 = false;
    this.page4 = true;

    console.log("page1: " + this.page1);
    console.log("page2: " + this.page2);
    console.log("page3: " + this.page3);
    console.log("page4: " + this.page4);
  }

}
