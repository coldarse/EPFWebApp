import { asNativeElements, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { appFunc } from '../_models/_appFunc';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { HttpErrorResponse } from '@angular/common/http';
import { templateJitUrl } from '@angular/compiler';

declare const loadKeyboard: any;
declare const deleteKeyboard: any;
declare const closeKeyboard: any;

@Component({
  selector: 'app-i-akaun-registration',
  templateUrl: './i-akaun-registration.component.html',
  styleUrls: ['./i-akaun-registration.component.css'],
})
export class IAkaunRegistrationComponent implements OnInit {
  @ViewChild('email') email: ElementRef | undefined;
  @ViewChild('emailDDL') emailDDL: ElementRef | undefined;
  @ViewChild('emailDDLText') emailDDLText: ElementRef | undefined;

  @ViewChild('account_number') account_number: ElementRef | undefined;
  @ViewChild('password_1') password_1: ElementRef | undefined;
  @ViewChild('password_2') password_2: ElementRef | undefined;
  @ViewChild('secure_phrase') secure_phrase: ElementRef | undefined;

  EnterPhoneNumber = true;
  EnterEmailAddress = false;
  PhoneEmailConfirmation = false;
  AskActivate = false;
  IAkaunTNC = false;
  ActivateInformation = false;
  SuccessActivation = false;
  PromptRegisterISaraan = false;
  SetIdPassword = false;
  Failed = false;
  isCallAPI = false;
  phoneError = false;
  xagreedTnc = true;
  emptySecret = false;
  emptyID = false;
  emptyPassword = false;
  emptyConfirmPW = false;
  accountAlpha = false;
  passwordAlpha = false;
  accountMin = false;
  accountMax = false;
  passwordMin = false;
  passwordMax = false;
  imageSelect = false;
  securePhraseMax = false;
  passwordMatch = false;
  isiAkaunActModuleEnabled = false;
  isCustom = false;
  emailError = false;

  phoneNo = '';
  emailAddress = '';
  TnC = '';
  errorDesc = '';
  content_version = '';
  ic = '';
  name = '';
  acctNo = '';
  password1 = '';
  password2 = '';
  securePhrase = '';
  emailDDLTextValue = '';
  fullEmailAddress = '';
  elist = 'gmail.com';

  checkboxImages: any[] = [];
  emailList: string[] = [
    'gmail.com',
    'hotmail.com',
    'yahoo.com',
    'custom'
  ];
  
  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) {}

  ngOnInit(): void {
    this.translate.use(selectLang.selectedLang);

    for (var val of appFunc.modules){
      if(val.moduleID == 8){
        if(val.enabled == true){
          if(appFunc.isInBetween(
            new Date("0001-01-01T" + val.operationStart + ":00"), 
            new Date("0001-01-01T" + val.operationEnd + ":00"), 
            new Date("0001-01-01T" + appFunc.getCurrentTime()))){
            this.isiAkaunActModuleEnabled = true;
          }
        }
      }
    }

    this.ic = appFunc.currMemberDetail.primaryIdNum;
    this.name = appFunc.currMemberDetail.custName;
  }

  clickTNC() {
    this.xagreedTnc = !this.xagreedTnc;
  }

  EnterPhoneNumberYes() {
    this.phoneError = false;
    if (this.phoneNo.length < 10) {
      this.phoneError = true;
    } 
    else {
      this.EnterPhoneNumber = false;
      this.EnterEmailAddress = true;
      setTimeout(() => { 
        loadKeyboard();
      }, 500);
    }
  }

  onChange(event: any){
    if(event.target.value == 'custom'){
      this.isCustom = true;
    }
  }

  reset(){
    this.elist = this.emailList[0];
    this.isCustom = false;
  }

  EnterPhoneNumberNo() {
    this.route.navigate(['mainMenu']);
  }

  EnterEmailAddressYes() {
    this.emailError = false;

    if(this.email?.nativeElement.value == ''){
      this.fullEmailAddress = '';
      this.EnterEmailAddress = false;
      this.PhoneEmailConfirmation = true;
      deleteKeyboard();
    }
    else{
      if(this.isCustom){
        this.emailDDLTextValue = this.emailDDLText?.nativeElement.value;
        this.emailAddress = this.email?.nativeElement.value;
        this.fullEmailAddress = this.email?.nativeElement.value == 0 ? '' : this.email?.nativeElement.value + '@' + this.emailDDLText?.nativeElement.value;
      }
      else{
        this.emailAddress = this.email?.nativeElement.value;
        this.fullEmailAddress = this.email?.nativeElement.value == 0 ? '' : this.email?.nativeElement.value + '@' + this.emailDDL?.nativeElement.value;
      }

      if(appFunc.isEmail(this.fullEmailAddress)){
        this.EnterEmailAddress = false;
        this.PhoneEmailConfirmation = true;
        deleteKeyboard();
      }
      else{
        this.emailError = true;
      }
    }
  }

  
  EnterEmailAddressNo() {
    deleteKeyboard();
    this.EnterEmailAddress = false;
    this.EnterPhoneNumber = true;
  }

  PhoneEmailConfirmationYes() {
    this.isCallAPI = true;
    const iAkaunbody = {
      epfNum: appFunc.currMemberDetail.accNum,
      tacMobileNum: this.phoneNo,
      branchCode: '',
      migrationFlag: '',
      clientChannel: 'SST',
      source: '',
      subSource: '',
      ipAddress: '',
      validity: '',
      sessionId: appFunc.sessionId
    };
    if (this.fullEmailAddress == '') this.fullEmailAddress = '@';
    this._aldanService
      .iAkaunRegistration(
        appFunc.currMemberDetail.primaryIdNum, 
        appFunc.currMemberDetail.custName, 
        this.phoneNo, 
        this.fullEmailAddress, 
        selectLang.selectedLang, 
        iAkaunbody
      )
      .subscribe((result: any) => {
        this.isCallAPI = false;
        if (result.body.responseCode == '0') {
          if(this.isiAkaunActModuleEnabled){
            this.AskActivate = true;
          }
          else{
            this.SuccessActivation = true;
          }
          this.PhoneEmailConfirmation = false;
          deleteKeyboard();
        } else {
          this.PhoneEmailConfirmation = false;
          this.Failed = true;
          this.errorDesc = result.body.error.description;
        }
      },(err: HttpErrorResponse) => {
        appFunc.message = "HttpError";
        this.route.navigate(['outofservice']);
      });
  }

  PhoneEmailConfirmationNo() {
    this.PhoneEmailConfirmation = false;
    this.EnterEmailAddress = true;
    this.fullEmailAddress = '';

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  AskActivateYes() {
    this.isCallAPI = true;
    this._aldanService
      .GetTnC(
        selectLang.selectedLang, 
        appFunc.sessionId
      )
      .subscribe((result: any) => {
        this.isCallAPI = false;
        if (result.body.content != '') {
          this.xagreedTnc = true;
          this.TnC = result.body.content.toString();
          this.content_version = result.body.contentVersion;
          this.AskActivate = false;
          this.IAkaunTNC = true;
        } else {
          this.AskActivate = false;
          this.Failed = true;
          this.errorDesc = result.body.error[0].description;
        }
      },(err: HttpErrorResponse) => {
        appFunc.message = "HttpError";
        this.route.navigate(['outofservice']);
      });
  }

  AskActivateNo() {
    this.route.navigate(['mainMenu']);
  }

  IAkaunTNCyes() {
    this.IAkaunTNC = false;
    this.SetIdPassword = true;

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  IAkaunTNCno() {
    this.IAkaunTNC = false;
    this.AskActivate = true;
  }

  ActivateInformationYes() {
    this.emptySecret = false;
    this.imageSelect = false;
    this.securePhraseMax = false;

    this.securePhrase = this.secure_phrase?.nativeElement.value;

    let FilledIn = 0;
    let errorCount = 0;
    if (this.securePhrase.length != 0) FilledIn += 1;
    else this.emptySecret = true;

     //Check Selected Image
    let selectedCount = 0;
    let imageid: any;
    this.checkboxImages.forEach((elem: any) => {
      if (elem.checked == true) {
        selectedCount += 1;
        imageid = elem.imgId;
      }
    });

    if (selectedCount == 0) {
      errorCount += 1;
      this.imageSelect = true;
    }

    if (FilledIn == 1) {
      if (this.securePhrase.length > 10 || this.securePhrase.length == 0) {
        errorCount += 1;
        this.securePhraseMax = true;
      }

      if (errorCount == 0) {
        if (appFunc.bypassAPI != true) {
          this.isCallAPI = true;
          const iAkaunActBody = {
            "epfNum": appFunc.currMemberDetail.accNum,
            "id_no": this.ic,
            "user_id": this.acctNo,
            "new_password": this.password1,
            "secure_image_id": imageid,
            "secret_phrase": this.securePhrase,
            "terms_condition": this.content_version,
            "sessionId": appFunc.sessionId
          }

          this._aldanService.
            ActivateIAkaun(iAkaunActBody).
            subscribe((result: any) => {
              this.isCallAPI = false;
              if(result.body.epf_no != ""){

                this.ActivateInformation = false;
                this.SuccessActivation = true;

                deleteKeyboard()
              }
              else{
                this.ActivateInformation = false;
                this.Failed = true;
                this.errorDesc = 'unsuccesfuliAkaunActivation';
              }
            },(err: HttpErrorResponse) => {
              appFunc.message = "HttpError";
              this.route.navigate(['outofservice']);
            });
        }
        else{
          this.ActivateInformation = false;
          this.SuccessActivation = true;
        }
      }
      else
      {
        //if error
      }
    }
  }

  ActivateInformationNo() {
    this.ActivateInformation = false;
    this.SetIdPassword = true;
    this.checkboxImages = [];
    deleteKeyboard();

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  SetIdPasswordYes(){
    this.emptyID = false;
    this.emptyPassword = false;
    this.emptyConfirmPW = false;
    this.accountAlpha = false;
    this.accountAlpha = false;
    this.passwordAlpha = false;
    this.accountMin = false;
    this.accountMax = false;
    this.passwordMin = false;
    this.passwordMax = false;
    this.passwordMatch = false;

    this.acctNo = this.account_number?.nativeElement.value;
    this.password1 = this.password_1?.nativeElement.value;
    this.password2 = this.password_2?.nativeElement.value;

    let FilledIn = 0;
    if (this.acctNo.length != 0) FilledIn += 1;
    else{
      this.emptyID = true;
    }
    if (this.password1.length != 0) FilledIn += 1; 
    else{
      this.emptyPassword = true;
    }
    if (this.password2.length != 0) FilledIn += 1;
    else{
      this.emptyConfirmPW = true;
    }

    if (FilledIn == 3) {
      let errorCount = 0;
      //Check Alphanumeric
      if (!this.acctNo.match(/^[0-9a-zA-Z]+$/)) {
        errorCount += 1;
        this.accountAlpha = true;
      }
      if (!this.password1.match(/^[0-9a-zA-Z]+$/)) {
        errorCount += 1;
        this.passwordAlpha = true;
      }
      if (!this.password2.match(/^[0-9a-zA-Z]+$/)) {
        errorCount += 1;
        this.passwordAlpha = true;
      }
      //Check Min Length
      if (this.acctNo.length < 8) {
        errorCount += 1;
        this.accountMin = true;
      }
      if (this.password1.length < 8) {
        errorCount += 1;
        this.passwordMin = true;
      }
      if (this.password2.length < 8) {
        errorCount += 1;
        this.passwordMin = true;
      }
      //Check Max Length
      if (this.acctNo.length > 16) {
        errorCount += 1;
        this.accountMax = true;
      }
      if (this.password1.length > 20) {
        errorCount += 1;
        this.passwordMax = true;
      }
      if (this.password2.length > 20) {
        errorCount += 1;
        this.passwordMax = true;
      }
      //Check Password Match
      if (this.password1 != this.password2) {
        errorCount += 1;
        this.passwordMatch = true;
      }

      if (errorCount == 0) {
        this.checkboxImages = [];
        if (appFunc.bypassAPI != true) {
          this.isCallAPI = true;
          this._aldanService.
            GetSecureImage(appFunc.sessionId).
            subscribe((result: any) => {
              this.isCallAPI = false;
              if (result.body.imgId != '') {
                result.body.forEach((element: any) => {
                  this.checkboxImages.push({
                    imgId: element.imgId,
                    imgPath: element.imgPath,
                    checked: false,
                  });
                });
                this.SetIdPassword = false;
                this.ActivateInformation = true;
                setTimeout(() => {
                  loadKeyboard();
                }, 500);
              } else {
                this.Failed = true;
                this.SetIdPassword = false;
                this.errorDesc = result.body.error[0].description;
              }
              deleteKeyboard();
          },(err: HttpErrorResponse) => {
            appFunc.message = "HttpError";
            this.route.navigate(['outofservice']);
          });
        }
      }
    }
  }

  SetIdPasswordNo(){
    this.SetIdPassword = false;
    this.IAkaunTNC = true;

    deleteKeyboard();
  }

  SuccessActivationYes() {
    this.SuccessActivation = false;
    this.PromptRegisterISaraan = true;
  }

  SuccessActivationNo() {
    this.SuccessActivation = false;
    this.ActivateInformation = true;
  }

  PromptRegisterISaraanYes() {
    this.route.navigate(['iSaraanShariahSavingsRegistration']);
  }

  PromptRegisterISaraanNo() {
    this.route.navigate(['mainMenu']);
  }

  click1() {
    if (this.phoneNo.length < 10) this.phoneNo += '1';
  }

  click2() {
    if (this.phoneNo.length < 10) this.phoneNo += '2';
  }

  click3() {
    if (this.phoneNo.length < 10) this.phoneNo += '3';
  }

  click4() {
    if (this.phoneNo.length < 10) this.phoneNo += '4';
  }

  click5() {
    if (this.phoneNo.length < 10) this.phoneNo += '5';
  }

  click6() {
    if (this.phoneNo.length < 10) this.phoneNo += '6';
  }

  click7() {
    if (this.phoneNo.length < 10) this.phoneNo += '7';
  }

  click8() {
    if (this.phoneNo.length < 10) this.phoneNo += '8';
  }

  click9() {
    if (this.phoneNo.length < 10) this.phoneNo += '9';
  }

  click0() {
    if (this.phoneNo.length < 10) this.phoneNo += '0';
  }

  clickDel() {
    this.phoneNo = this.phoneNo.substring(0, this.phoneNo.length - 1);
  }

  clickImage(imgId: string) {
    this.checkboxImages.forEach((elem: any) => {
      if (imgId == elem.imgId) {
        elem.checked = true;
      } else {
        elem.checked = false;
      }
    });
  }

  failedYes() {
    this.route.navigate(['mainMenu']);
  }
}
