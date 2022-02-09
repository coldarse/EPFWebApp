import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { selectLang } from '../_models/language';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  date : any;
  name = "Chen Jiunn Haw";

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use(selectLang.selectedLang);
    //this.name = currentMyKadDetails.Name

    setInterval(() => {
      this.date = formatDate(new Date(), 'h:MM a d/M/yyyy', 'en');
    }, 1000);
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

  logOut(){
    this.route.navigate(['']);
  }


}
