import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { appFunc } from '../_models/_appFunc';
import { currentMemberDetails } from '../_models/_currentMemberDetails';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { accessToken } from '../_models/token';
import { HttpHeaders } from '@angular/common/http';

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
  Failed = false;
  phoneNo = '';
  emailAddress = '';
  TnC = '';

  phoneError = false;
  xagreedTnc = true;

  accountAlpha = false;
  passwordAlpha = false;
  accountMin = false;
  accountMax = false;
  passwordMin = false;
  passwordMax = false;
  imageSelect = false;
  securePhraseMax = false;
  passwordMatch = false;

  ic = '';
  name = '';
  acctNo = '';
  password1 = '';
  password2 = '';
  securePhrase = '';

  emailList: string[] = [
    'aldantechnology.com',
    'gmail.com',
    'hotmail.com',
    'yahoo.com',
  ];

  checkboxImages: any[] = [];

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) {}

  ngOnInit(): void {
    this.translate.use('bm');
    accessToken.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + accessToken.token,
      }),
    };

    // let hardcode = true;
    // if (hardcode) {
    //   this.hardcodedIC();
    // }

    this.ic = currentMyKadDetails.ICNo;
    this.name = currentMyKadDetails.Name;

    this.acctNo = this.ic;
  }

  hardcodedIC() {
    let harcodedic = '111111007894';
    currentMyKadDetails.Name = 'John Smith';
    currentMyKadDetails.ICNo = harcodedic.toString().replace('*', '');
    currentMyKadDetails.OldICNo = '';
    currentMyKadDetails.DOB = new Date('1957-08-31');
    currentMyKadDetails.POB = 'SELANGOR';
    currentMyKadDetails.Gender = 'Male';
    currentMyKadDetails.Citizenship = 'WARGANEGARA';
    currentMyKadDetails.IssueDate = new Date('2020-01-01');
    currentMyKadDetails.Race = 'CINA';
    currentMyKadDetails.Religion = 'ISLAM';
    currentMyKadDetails.Address1 = '6 Jln 14/70A';
    currentMyKadDetails.Address2 = '';
    currentMyKadDetails.Address3 = 'Sri Hartamas';
    currentMyKadDetails.PostCode = '50480';
    currentMyKadDetails.City = 'Kuala Lumpur';
    currentMyKadDetails.State = 'W. PERSEKUTUAN(KL)';
    currentMyKadDetails.Country = 'Malaysia';
    currentMyKadDetails.Address = '';
    currentMyKadDetails.RJ = '';
    currentMyKadDetails.KT = '';
    currentMyKadDetails.GreenCardNationality = '';
    currentMyKadDetails.GreenCardExpiryDate = new Date('0000-00-00');
    currentMyKadDetails.CardVersion = '';
    currentMyKadDetails.OtherID = '';
    currentMyKadDetails.CategoryType = 'W';
  }

  ngAfterViewInit() {
    loadKeyboard();
  }

  clickTNC() {
    this.xagreedTnc = !this.xagreedTnc;
  }

  EnterPhoneNumberYes() {
    this.phoneError = false;
    if (this.phoneNo.length < 10) {
      this.phoneError = true;
    } else {
      this.EnterPhoneNumber = false;
      this.EnterEmailAddress = true;

      setTimeout(() => {
        loadKeyboard();
      }, 500);
    }
  }

  EnterPhoneNumberNo() {
    this.route.navigate(['mainMenu']);
  }

  EnterEmailAddressYes() {
    //if(this.email?.nativeElement.value != ""){
    this.EnterEmailAddress = false;
    this.PhoneEmailConfirmation = true;
    this.emailAddress =
      this.email?.nativeElement.value == 0
        ? ''
        : this.email?.nativeElement.value +
          '@' +
          this.emailDDL?.nativeElement.value;
    deleteKeyboard();
    //}
  }

  EnterEmailAddressNo() {
    this.EnterEmailAddress = false;
    this.EnterPhoneNumber = true;
  }

  PhoneEmailConfirmationYes() {
    if (appFunc.bypassAPI != true) {
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

      this._aldanService
        .iAkaunRegistration(iAkaunbody)
        .subscribe((result: any) => {
          if (result.responseCode == '0') {
            this.PhoneEmailConfirmation = false;
            this.AskActivate = true;

            deleteKeyboard();
          } else {
            this.PhoneEmailConfirmation = false;
            this.Failed = true;
          }
        });
    }
  }

  PhoneEmailConfirmationNo() {
    this.PhoneEmailConfirmation = false;
    this.EnterEmailAddress = true;

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  AskActivateYes() {
    if (appFunc.bypassAPI != false) {
      this._aldanService
        .GetTnC(selectLang.selectedLang, appFunc.sessionId)
        .subscribe((result: any) => {
          if (result.content != '') {
            this.TnC = result.content.toString();
            console.log(this.TnC);
            this.AskActivate = false;
            this.IAkaunTNC = true;
          } else {
            this.AskActivate = false;
            this.Failed = true;
          }
        });
    }
  }

  AskActivateNo() {
    this.route.navigate(['mainMenu']);
  }

  IAkaunTNCyes() {
    if (appFunc.bypassAPI != false) {
      this._aldanService.GetSecureImage(appFunc.sessionId).subscribe((result: any) => {
        if (result.imgId != '') {
          result.forEach((element: any) => {
            this.checkboxImages.push({
              imgId: element.imgId,
              imgPath: element.imgPath,
              checked: false,
            });
          });
          this.IAkaunTNC = false;
          this.ActivateInformation = true;
        } else {
          this.Failed = true;
        }
      });
    }

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  IAkaunTNCno() {
    this.IAkaunTNC = false;
    this.AskActivate = true;
  }

  ActivateInformationYes() {
    this.accountAlpha = false;
    this.accountAlpha = false;
    this.passwordAlpha = false;
    this.accountMin = false;
    this.accountMax = false;
    this.passwordMin = false;
    this.passwordMax = false;
    this.imageSelect = false;
    this.securePhraseMax = false;
    this.passwordMatch = false;

    this.acctNo = this.account_number?.nativeElement.value;
    this.password1 = this.password_1?.nativeElement.value;
    this.password2 = this.password_2?.nativeElement.value;
    this.securePhrase = this.secure_phrase?.nativeElement.value;

    let FilledIn = 0;
    if (this.acctNo.length != 0) FilledIn += 1;
    if (this.password1.length != 0) FilledIn += 1;
    if (this.password2.length != 0) FilledIn += 1;
    if (this.securePhrase.length != 0) FilledIn += 1;

    if (FilledIn == 4) {
      let errorCount = 0;
      //Check Alphanumeric
      if (!this.acctNo.match(/^[0-9a-z]+$/)) {
        errorCount += 1;
        this.accountAlpha = true;
      }
      if (!this.password1.match(/^[0-9a-z]+$/)) {
        errorCount += 1;
        this.passwordAlpha = true;
      }
      if (!this.password2.match(/^[0-9a-z]+$/)) {
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
      if (this.securePhrase.length > 10 || this.securePhrase.length == 0) {
        errorCount += 1;
        this.securePhraseMax = true;
      }
      //Check Password Match
      if (this.password1 != this.password2) {
        errorCount += 1;
        this.passwordMatch = true;
      }
      //Check Selected Image
      let selectedCount = 0;
      this.checkboxImages.forEach((elem: any) => {
        if (elem.checked == true) {
          selectedCount += 1;
        }
      });
      if (selectedCount == 0) {
        errorCount += 1;
        this.imageSelect = true;
      }

      if (errorCount == 0) {
        if (appFunc.bypassAPI != true) {
          const iAkaunActBody = {
            "epfNum": appFunc.currMemberDetail.accNum,
            "id_no": this.ic,
            "name": this.name,
            "user_id": this.acctNo,
            "new_password": this.password1,
            "confirm_new_password": this.password2,
            "secure_image_id": this.checkboxImages,
            "secret_phrase": this.securePhrase,
            "terms_condition": "46"
          }

          this._aldanService.ActivateIAkaun(iAkaunActBody, appFunc.sessionId).subscribe((result: any) => {
            if(result.epfNum != null){

              this.ActivateInformation = false;
              this.SuccessActivation = true;

              deleteKeyboard()
            }
            else{
              this.ActivateInformation = false;
              this.Failed = true;
            }
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
