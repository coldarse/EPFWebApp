import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { $ } from 'protractor';

@Component({
  selector: 'app-thumbprint-confirmation',
  templateUrl: './thumbprint-confirmation.component.html',
  styleUrls: ['./thumbprint-confirmation.component.css']
})
export class ThumbprintConfirmationComponent implements OnInit {

  ThumbprintAgreeDisagree = false;
  Selections = false;
  ThumbprintVerification = false;
  Selected = false;
  popup = false;
  popupAnsuran = false;
  popup50Tahun = false;
  popupMissing = true;

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

  ThumbprintAgreeDisagreeYes(){
    this.ThumbprintAgreeDisagree = false;
    this.Selections = true;
  }

  ThumbprintAgreeDisagreeNo(){
    this.route.navigate(['mainMenu']);
  }

  SelectionsNo(){
    this.Selections = false;
    this.ThumbprintAgreeDisagree = true;
  }

  SelectionsYes(){
    let x = 0;
    if(this.checkedAnsuran == false) x++;
    if(this.checkedBina == false) x++;
    if(this.checked50yo == false) x++;
    if(this.checkedEducation == false) x++;
    if(this.checked1mil == false) x++;
    if(this.checked55yo == false) x++;

    if(x > 0) this.popup= true;
    else {
      this.Selections = false;
      this.ThumbprintVerification = true;
    }
  }

  ThumbprintVerificationNo(){
    this.ThumbprintVerification = false;
    this.Selections = true;
  }

  SelectedNo(){
    this.route.navigate(['mainMenu']);
  }

  SelectedYes(){
    this.route.navigate(['mainMenu']);
  }

  popupYes(){
    this.popup = false;
    this.Selections = false;
    this.ThumbprintVerification = true;
  }

  skip(){
    this.ThumbprintVerification = false;
    this.Selected = true;
  }

}
