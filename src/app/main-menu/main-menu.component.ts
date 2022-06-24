import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { selectLang } from '../_models/language';
import { appFunc } from '../_models/_appFunc';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { signalRConnection } from '../_models/_signalRConnection';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  @ViewChild('bm') bm: ElementRef | undefined;
  @ViewChild('en') en: ElementRef | undefined;

  date = formatDate(new Date(), 'h:mm a d/M/yyyy', 'en');
  name = '';
  accountNum = "";
  checkBalanceEnabled = false;
  personalInformationEnabled = false;
  updateTACEnabled = false;
  iShariahiSaraanEnabled = false;
  thumbprintVerificationEnabled = false;
  iAkaunEnabled = false;

  constructor(
    private route: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {

    this.translate.use(selectLang.selectedLang);

    this.name = appFunc.currMemberDetail.custName;
    this.accountNum = appFunc.currMemberDetail.accNum;

    setInterval(() => {
      this.date = formatDate(new Date(), 'h:mm a d/M/yyyy', 'en');
    }, 1000);

    let isaraanishariahcount = 0;
    let iakauncount = 0;

    if(appFunc.modules != undefined){
      if(appFunc.checkModuleAvailability(appFunc.modules) == 0){
        appFunc.message = "Under Maintenance";
        this.route.navigate(['outofservice']);
      }

      for (var val of appFunc.modules){
        if(val.moduleID == 1){
          if(val.enabled == true){
            if(appFunc.isInBetween(new Date("0001-01-01T" + val.operationStart + ":00"), new Date("0001-01-01T" + val.operationEnd + ":00"), new Date("0001-01-01T" + appFunc.getCurrentTime()))){
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
            if(appFunc.isInBetween(new Date("0001-01-01T" + val.operationStart + ":00"), new Date("0001-01-01T" + val.operationEnd + ":00"), new Date("0001-01-01T" + appFunc.getCurrentTime()))){
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
            if(appFunc.isInBetween(new Date("0001-01-01T" + val.operationStart + ":00"), new Date("0001-01-01T" + val.operationEnd + ":00"), new Date("0001-01-01T" + appFunc.getCurrentTime()))){
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
            if(appFunc.isInBetween(new Date("0001-01-01T" + val.operationStart + ":00"), new Date("0001-01-01T" + val.operationEnd + ":00"), new Date("0001-01-01T" + appFunc.getCurrentTime()))){
              isaraanishariahcount += 1;
            }
          }
        }
        else if(val.moduleID == 6){
          if(val.enabled == true){
            if(appFunc.isInBetween(new Date("0001-01-01T" + val.operationStart + ":00"), new Date("0001-01-01T" + val.operationEnd + ":00"), new Date("0001-01-01T" + appFunc.getCurrentTime()))){
              isaraanishariahcount += 1;
            }
          }
        }
        else if(val.moduleID == 7){
          if(val.enabled == true){
            if(appFunc.isInBetween(new Date("0001-01-01T" + val.operationStart + ":00"), new Date("0001-01-01T" + val.operationEnd + ":00"), new Date("0001-01-01T" + appFunc.getCurrentTime()))){
              iakauncount += 1;
            }
          }
        }
        else if(val.moduleID == 8){
          if(val.enabled == true){
            if(appFunc.isInBetween(new Date("0001-01-01T" + val.operationStart + ":00"), new Date("0001-01-01T" + val.operationEnd + ":00"), new Date("0001-01-01T" + appFunc.getCurrentTime()))){
              iakauncount += 1;
            }
          }
        }
      }
    }
    
    if(iakauncount > 0) this.iAkaunEnabled = true;
    if(isaraanishariahcount > 0) this.iShariahiSaraanEnabled = true;
    if(appFunc.currMemberDetail.iAkaunStatus == "A") this.iAkaunEnabled = false;
    
  }

  ngAfterViewInit(): void{

    this.date = formatDate(new Date(), 'h:mm a d/M/yyyy', 'en');
    
    if(selectLang.selectedLang == 'bm'){
      this.bm?.nativeElement.focus();
    }
    else{
      this.en?.nativeElement.focus();
    }
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
    appFunc.endSession = true;
    this.route.navigate(['verifyMyKad']);
  }


}
