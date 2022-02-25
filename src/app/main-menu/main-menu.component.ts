import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { selectLang } from '../_models/language';
import { appFunc } from '../_models/_appFunc';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  date : any;
  name = "Chen Jiunn Haw";

  checkBalanceEnabled = false;
  personalInformationEnabled = false;
  updateTACEnabled = false;
  iShariahiSaraanEnabled = false;
  thumbprintVerificationEnabled = false;
  iAkaunEnabled = false;

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use(selectLang.selectedLang);
    this.name = currentMyKadDetails.Name

    if(appFunc.checkModuleAvailability(appFunc.modules) == 0){
      appFunc.message = "Under Maintenance";
      this.route.navigate(['outofservice']);
    }

    let isaraanishariahcount = 0;
    let iakauncount = 0;

    for (var val of appFunc.modules){
      if(val.moduleID == 1){
        if(val.enabled == true){
          if(appFunc.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
            this.checkBalanceEnabled = true;
          }
          else{
            this.checkBalanceEnabled = false;
          }
        }
        else{
          this.checkBalanceEnabled = false;
        }
      }
      else if(val.moduleID == 2){
        if(val.enabled == true){
          if(appFunc.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
            this.updateTACEnabled = true;
          }
          else{
            this.updateTACEnabled = false;
          }
        }
        else{
          this.updateTACEnabled = false;
        }
      }
      else if(val.moduleID == 3){
        if(val.enabled == true){
          if(appFunc.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
            this.personalInformationEnabled = true;
          }
          else{
            this.personalInformationEnabled = false;
          }
        }
        else{
          this.personalInformationEnabled = false;
        }
      }
      else if(val.moduleID == 5){
        if(val.enabled == true){
          if(appFunc.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
            isaraanishariahcount += 1;
          }
        }
      }
      else if(val.moduleID == 6){
        if(val.enabled == true){
          if(appFunc.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
            isaraanishariahcount += 1;
          }
        }
      }
      else if(val.moduleID == 7){
        if(val.enabled == true){
          if(appFunc.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
            iakauncount += 1;
          }
        }
      }
      else if(val.moduleID == 8){
        if(val.enabled == true){
          if(appFunc.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
            iakauncount += 1;
          }
        }
      }
    }

    if(iakauncount > 0) this.iAkaunEnabled = true;
    if(isaraanishariahcount > 0) this.iShariahiSaraanEnabled = true;

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
