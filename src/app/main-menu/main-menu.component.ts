import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { selectLang } from '../_models/language';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use(selectLang.selectedLang);
  }

  selectBM(){
    selectLang.selectedLang = 'bm'
    this.translate.use(selectLang.selectedLang);
  }

  selectEN(){
    selectLang.selectedLang = 'en'
    this.translate.use(selectLang.selectedLang);
  }

  checkBalance(){
    this.route.navigate(['checkBalance']);
  }

  personalInformation(){
    this.route.navigate(['personalInformation']);
  }

  updateTAC(){
    this.route.navigate(['updateTAC']);
  }

  iSaraanRegistrationShariahSavings(){
    this.route.navigate(['iSaraanShariahSavingsRegistration']);
  }

  thumbprintConfirmation(){
    this.route.navigate(['thumbprintConfirmation']);
  }

  iAkaunRegistration(){
    this.route.navigate(['iAkaunRegistration']);
  }


}
