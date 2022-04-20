import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { appFunc } from '../_models/_appFunc';
import { signalRConnection } from '../_models/_signalRConnection';

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
  phoneNo = "";
  errorDesc = "";

  phoneError = false;
  isCallAPI = false;


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
    if(this.phoneNo.length < 10){
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
    if(appFunc.bypassAPI != true){
      this.isCallAPI = true;
      const updateTACBody = {
        "custNum": appFunc.currMemberDetail.cifNum,
        "tacMobilePhoneCode": "TA",
        "tacMobilePhone": this.phoneNo,
        "amendmentChannel": "KSK",
        "status": "P",
        "checkForDuplicate": "N",
        "generateRequestNum": "N",
        "requestNum": "",
        "sessionId": appFunc.sessionId
      }

      this._aldanService.UpdateTAC(updateTACBody).subscribe((result: any) => {
        if(result.status == 200){
          this.isCallAPI = false;
          if(result.body.responseCode == "0"){
            this.PhoneNoConfirmation = false;
            this.Success = true;
          }
          else{
            this.PhoneNoConfirmation = false;
            this.Failed = true;
            this.errorDesc = result.body.error[0].description;
          }
        }
        else{
          appFunc.message = result.message;
          this.route.navigate(['outofservice']);
        }
      },(err: HttpErrorResponse) => {
        appFunc.message = "HttpError";
        this.route.navigate(['outofservice']);
      });
    }
    else{
      this.PhoneNoConfirmation = false;
      this.Success = true;
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

  failedYes(){
    this.route.navigate(['mainMenu']);
  }

}
