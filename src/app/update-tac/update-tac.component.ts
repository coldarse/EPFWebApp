import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { appFunc } from '../_models/_appFunc';
import { signalRConnection } from '../_models/_signalRConnection';
import { formatDate } from '@angular/common';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';

@Component({
  selector: 'app-update-tac',
  templateUrl: './update-tac.component.html',
  styleUrls: ['./update-tac.component.css']
})
export class UpdateTACComponent implements OnInit {

  EnterPhoneNo = true;
  PhoneNoConfirmation = false;
  Success = false;
  Failed = false;
  phoneError = false;
  isCallAPI = false;

  phoneNo = '';
  errorDesc = '';
  successMessage = '';

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) { }

  ngOnInit(): void {
    this.translate.use(selectLang.selectedLang);
  }

  EnterPhoneNoYes(){
    this.phoneError = false;
    if(this.phoneNo.length < 11){
      this.phoneError = true;
    }
    else{
      this.EnterPhoneNo = false;
      this.PhoneNoConfirmation = true;
    }
  }

  EnterPhoneNoNo(){
    this.route.navigate(['mainMenu']);
  }

  PhoneNoConfirmationYes(){
    this.isCallAPI = true;

    if(appFunc.currMemberDetail.tacMobilePhone.length == 0){
      const addMobileTACBody = {
        custNum: appFunc.currMemberDetail.cifNum,
        tacMobilePhoneCode: 'TA',
        tacMobilePhone: this.phoneNo,
        registrationDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        registrationChannel: 'SST',
        status: 'P',
        checkForDuplicate: 'N',
        generateRequestNum: 'N',
        requestNum: '',
        sessionId: appFunc.sessionId,
      }

      this._aldanService.
      AddTAC(addMobileTACBody).
      subscribe((result: any) => {
        if(result.body.responseCode == "0"){
          const body = {
            "regType": "M",
            "accNum": "",
            "accType": "",
            "searchType": "I",
            "idNum": currentMyKadDetails.ICNo,
            "idType": currentMyKadDetails.CategoryType,
            "reqTypeCode": "",
            "sessionId": appFunc.sessionId
          }

          this._aldanService.
            MemberProfileInfo(body).
            subscribe((result: any) => {
              this.isCallAPI = false;
              if(result.body.responseCode == "0"){
                appFunc.currMemberDetail = result.body.detail;
                this.PhoneNoConfirmation = false;
                this.Success = true;
                this.successMessage = 'registerTACSuccessMsg';
              }
              else{
                this.PhoneNoConfirmation = false;
                this.Failed = true;
                this.errorDesc = result.body.error[0].description;
              }
            },(err: HttpErrorResponse) => {
              appFunc.message = "HttpError";
              this.route.navigate(['outofservice']);
            });
          
        }
        else{
          this.PhoneNoConfirmation = false;
          this.Failed = true;
          this.errorDesc = 'unsuccessfulUpdateTAC';
        }
      },(err: HttpErrorResponse) => {
        appFunc.message = "HttpError";
        this.route.navigate(['outofservice']);
      });
    }
    else{
      const updateTACBody = {
        custNum: appFunc.currMemberDetail.cifNum,
        tacMobilePhoneCode: "TA",
        tacMobilePhone: this.phoneNo,
        amendmentChannel: "SST",
        status: "P",
        checkForDuplicate: "N",
        generateRequestNum: "N",
        requestNum: '',
        sessionId: appFunc.sessionId
      }

      this._aldanService.
      UpdateTAC(updateTACBody).
      subscribe((result: any) => {
        if(result.body.responseCode == "0"){
          const body = {
            "regType": "",
            "accNum": "",
            "accType": "",
            "searchType": "I",
            "idNum": currentMyKadDetails.ICNo,
            "idType": currentMyKadDetails.CategoryType,
            "reqTypeCode": "",
            "sessionId": appFunc.sessionId
          }

          this._aldanService.
            MemberProfileInfo(body).
            subscribe((result: any) => {
              this.isCallAPI = false;
              if(result.body.responseCode == "0"){
                appFunc.currMemberDetail = result.body.detail;
                this.PhoneNoConfirmation = false;
                this.Success = true;
                this.successMessage = 'registerTACSuccessMsg';
              }
              else{
                this.PhoneNoConfirmation = false;
                this.Failed = true;
                this.errorDesc = result.body.error[0].description;
              }
            },(err: HttpErrorResponse) => {
              appFunc.message = "HttpError";
              this.route.navigate(['outofservice']);
            });
        }
        else{
          this.PhoneNoConfirmation = false;
          this.Failed = true;
          this.errorDesc = 'unsuccessfulUpdateTAC';
        }
      },(err: HttpErrorResponse) => {
        appFunc.message = "HttpError";
        this.route.navigate(['outofservice']);
      });
    }
    

    

    
  }

  PhoneNoConfirmationNo(){
    this.PhoneNoConfirmation = false;
    this.EnterPhoneNo = true;
  }

  SuccessYes(){
    this.route.navigate(['mainMenu']);
  }

  click1(){
    if(this.phoneNo.length < 11) this.phoneNo += "1";
  }

  click2(){
    if(this.phoneNo.length < 11) this.phoneNo += "2";
  }

  click3(){
    if(this.phoneNo.length < 11) this.phoneNo += "3";
  }

  click4(){
    if(this.phoneNo.length < 11) this.phoneNo += "4";
  }

  click5(){
    if(this.phoneNo.length < 11) this.phoneNo += "5";
  }

  click6(){
    if(this.phoneNo.length < 11) this.phoneNo += "6";
  }

  click7(){
    if(this.phoneNo.length < 11) this.phoneNo += "7";
  }

  click8(){
    if(this.phoneNo.length < 11) this.phoneNo += "8";
  }

  click9(){
    if(this.phoneNo.length < 11) this.phoneNo += "9";
  }

  click0(){
    if(this.phoneNo.length < 11) this.phoneNo += "0";
  }

  clickDel(){
    this.phoneNo = this.phoneNo.substring(0, this.phoneNo.length - 1);
  }

  failedYes(){
    this.route.navigate(['mainMenu']);
  }

}
