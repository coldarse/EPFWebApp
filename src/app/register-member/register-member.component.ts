import { state } from '@angular/animations';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { businessTypes } from '../_models/modelClass';
import { appFunc } from '../_models/_appFunc';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';

declare const loadKeyboard: any;
declare const deleteKeyboard: any;
declare const closeKeyboard: any;

@Component({
  selector: 'app-register-member',
  templateUrl: './register-member.component.html',
  styleUrls: ['./register-member.component.css'],
})
export class RegisterMemberComponent implements OnInit {
  @ViewChild('email') email: ElementRef | undefined;
  @ViewChild('emailDDL') emailDDL: ElementRef | undefined;
  @ViewChild('emailDDLText') emailDDLText: ElementRef | undefined;

  @ViewChild('account_number') account_number: ElementRef | undefined;
  @ViewChild('password_1') password_1: ElementRef | undefined;
  @ViewChild('password_2') password_2: ElementRef | undefined;
  @ViewChild('secure_phrase') secure_phrase: ElementRef | undefined;
  @ViewChild('contract') contractHTML : ElementRef | undefined;

  RegKWSP = true;
  RegShariah = false;
  RegSaraan = false;
  RegIAkaun = false;
  RegisterMemberPage = true;
  InsertPhonePage = false;
  InsertEmailPage = false;
  ValidateProfilePage = false;
  RegisterSuccessPage = false;
  TnCPage = false;
  SetIdPassword = false;
  ActivateiAkaunPage = false;
  ActivateSuccessPage = false;
  PickShariahPage = false;
  ShariahTnCPage = false;
  ShariahSuccessPage = false;
  RegisteriSaraanPage = false;
  SelectJobPage = false;
  SaraanSuccessPage = false;
  Failed = false;
  failedTAC = false;
  failediAkaun = false;
  isiAkaunRegModuleEnabled = false;
  isiAkaunActModuleEnabled = false;
  isiShariahModuleEnabled = false;
  isiSaraanModuleEnabled = false;
  xagreedTnc1 = true;
  xagreedTnc2 = true;
  phoneError = false;
  emailError = false;
  isCustom = false;
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
  isCallAPI = false;
  noEmail = false;
  isiAkaunRegSuccessful = false;

  jobSectors: businessTypes[] = [];
  checkboxImages: any[] = [];
  emailList: string[] = [
    'gmail.com',
    'hotmail.com',
    'yahoo.com',
    'custom'
  ];

  dob: any;
  selectedJobSector: any;

  emailDDLTextValue = '';
  fullEmailAddress = '';
  name = '';
  ic = '';
  nationality = '';
  gender = '';
  race = '';
  religion = '';
  KWSPMemberNo = '';
  KWSPCustomerNo = '';
  errorDesc = '';
  acctNo = '';
  password1 = '';
  password2 = '';
  securePhrase = '';
  TnC = '';
  content_version = '';
  Contract = '';
  phoneNo = '';
  emailAddress = '';
  elist = 'gmail.com';
  defaultDDL = "default";
  currentLang = 'bm';

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) {}

  ngOnInit(): void {
    this.translate.use(selectLang.selectedLang);

    this.jobSectors = appFunc.businessTypes;
    this.currentLang = selectLang.selectedLang;

    for (var val of appFunc.modules) {
      if (val.moduleID == 5) {
        if (val.enabled == true) {
          if (
            appFunc.isInBetween(
              new Date('0001-01-01T' + val.operationStart + ':00'),
              new Date('0001-01-01T' + val.operationEnd + ':00'),
              new Date('0001-01-01T' + appFunc.getCurrentTime())
            )
          ) {
            this.isiSaraanModuleEnabled = true;
          }
        }
      } else if (val.moduleID == 6) {
        if (val.enabled == true) {
          if (
            appFunc.isInBetween(
              new Date('0001-01-01T' + val.operationStart + ':00'),
              new Date('0001-01-01T' + val.operationEnd + ':00'),
              new Date('0001-01-01T' + appFunc.getCurrentTime())
            )
          ) {
            this.isiShariahModuleEnabled = true;
          }
        }
      } else if (val.moduleID == 7) {
        if (val.enabled == true) {
          if (
            appFunc.isInBetween(
              new Date('0001-01-01T' + val.operationStart + ':00'),
              new Date('0001-01-01T' + val.operationEnd + ':00'),
              new Date('0001-01-01T' + appFunc.getCurrentTime())
            )
          ) {
            this.isiAkaunRegModuleEnabled = true;
          }
        }
      } else if (val.moduleID == 8) {
        if (val.enabled == true) {
          if (
            appFunc.isInBetween(
              new Date('0001-01-01T' + val.operationStart + ':00'),
              new Date('0001-01-01T' + val.operationEnd + ':00'),
              new Date('0001-01-01T' + appFunc.getCurrentTime())
            )
          ) {
            this.isiAkaunActModuleEnabled = true;
          }
        }
      }
    }

    this.name = currentMyKadDetails.Name;
    this.ic = currentMyKadDetails.ICNo;
    this.dob = formatDate(currentMyKadDetails.DOB, 'dd/MM/yyyy' ,'en');
    this.nationality = currentMyKadDetails.Citizenship;
    this.gender = currentMyKadDetails.Gender;
    this.race = currentMyKadDetails.Race;
    this.religion = currentMyKadDetails.Religion;

    if(selectLang.selectedLang == 'bm'){
      if(this.gender == 'Male'){
        this.gender = 'LELAKI';
      }
      else if(this.gender == "Female"){
        this.gender = 'PEREMPUAN';
      }

    }
    else{
      if(this.gender == 'Male'){
        this.gender = 'MALE';
      }
      else{
        this.gender = 'FEMALE';
      }

      if(this.nationality == 'WARGANEGARA'){
        this.nationality = 'CITIZEN'
      }

      if(this.race == "MELAYU"){
        this.race = "MALAY";
      }
      else if (this.race == "CINA"){
        this.race = "CHINESE";
      }
      else if (this.race == "INDIA"){
        this.race = "INDIAN";
      }
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

  RegisterMemberYes() {
    this.RegisterMemberPage = false;
    this.InsertPhonePage = true;
  }

  RegisterMemberNo() {
    appFunc.endSession = true;
    this.route.navigate(['verifyMyKad']);
  }

  InsertPhoneYes() {
    this.phoneError = false;
    if (this.phoneNo.length < 10) {
      this.phoneError = true;
    } else {
      this.InsertPhonePage = false;
      this.InsertEmailPage = true;

      setTimeout(() => {
        loadKeyboard();
      }, 500);
    }
  }

  InsertPhoneNo() {
    this.InsertPhonePage = false;
    this.RegisterMemberPage = true;

    deleteKeyboard();
  }

  InsertEmailYes() {
    this.emailError = false;

    if(this.email?.nativeElement.value == '')
    {
      this.noEmail = true;
      this.fullEmailAddress = '';
      this.InsertEmailPage = false;
      this.ValidateProfilePage = true;
      deleteKeyboard();
    }
    else
    {
      this.noEmail = false;
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
        this.InsertEmailPage = false;
        this.ValidateProfilePage = true;
        deleteKeyboard();
      }
      else{
        this.emailError = true;
      }
    }
    deleteKeyboard();
  }

  InsertEmailNo() {
    deleteKeyboard();
    this.InsertEmailPage = false;
    this.InsertPhonePage = true;
  }

  ValidateProfileYes() {
    this.isCallAPI = true;
    let residentStat = '';
    switch (currentMyKadDetails.Citizenship) {
      case 'WARGANEGARA': {
        residentStat = 'B';
        break;
      }
      case 'WARGANEGARA - AMJ': {
        residentStat = 'C';
        break;
      }
      case 'PEMASTAUTIN SEMENTARA': {
        residentStat = 'H';
        break;
      }
      case 'PEMASTAUTIN TETAP': {
        residentStat = 'M';
        break;
      }
      case 'PEMASTAUTIN TETAP - AMJ': {
        residentStat = 'P';
        break;
      }
      case 'BELUM DITENTUKAN': {
        residentStat = 'Q';
        break;
      }
      case 'BUKAN WARGANEGARA': {
        residentStat = 'X';
        break;
      }
      default: {
        residentStat = '9';
        break;
      }
    }

    let gender = '';
    switch (currentMyKadDetails.Gender) {
      case 'Male': {
        gender = 'M';
        break;
      }
      case 'Female': {
        gender = 'F';
        break;
      }
    }

    let areaCode = '';
    if (residentStat == 'X') {
      switch (currentMyKadDetails.State.toUpperCase()) {
        case 'SABAH': {
          areaCode = 'E';
          break;
        }
        case 'SARAWAK': {
          areaCode = 'F';
          break;
        }
        default: {
          areaCode = 'D';
          break;
        }
      }
    } else {
      switch (currentMyKadDetails.State.toUpperCase()) {
        case 'SABAH': {
          areaCode = 'B';
          break;
        }
        case 'SARAWAK': {
          areaCode = 'C';
          break;
        }
        default: {
          areaCode = 'A';
          break;
        }
      }
    }
    let race = '';
    switch (currentMyKadDetails.Race.toUpperCase()) {
      case 'MELAYU': {
        race = '0100';
        break;
      }
      case 'BUGIS': {
        race = '0101';
        break;
      }
      case 'BOYAN': {
        race = '0102';
        break;
      }
      case 'BANJAR': {
        race = '0103';
        break;
      }
      case 'JAWA': {
        race = '0104';
        break;
      }
      case 'JAWI PEKAN': {
        race = '0105';
        break;
      }
      case 'MINANGKABAU': {
        race = '0106';
        break;
      }
      case 'CINA': {
        race = '0200';
        break;
      }
      case 'CANTONESE': {
        race = '0201';
        break;
      }
      case 'FOOCHOW': {
        race = '0202';
        break;
      }
      case 'HAINANANESE': {
        race = '0203';
        break;
      }
    }
    let stateCode = '';
    var stateName  = currentMyKadDetails.State.toUpperCase();
    
    if(stateName.includes("JOHOR"))
    {
      stateCode = "1";
    }
    if(stateName.includes("KEDAH"))
    {
      stateCode = "2";
    }
    if(stateName.includes("KELANTAN"))
    {
      stateCode = "3";
    }
    if(stateName.includes("MELAKA"))
    {
      stateCode = "4";
    }
    if(stateName.includes("NEGERI SEMBILAN"))
    {
      stateCode = "5";
    }
    if(stateName.includes("PAHANG"))
    {
      stateCode = "6";
    }
    if(stateName.includes("PINANG"))
    {
      stateCode = "7";
    }
    if(stateName.includes("PERAK"))
    {
      stateCode = "8";
    }
    if(stateName.includes("PERLIS"))
    {
      stateCode = "9";
    }
    if(stateName.includes("SELANGOR"))
    {
      stateCode = "10";
    }
    if(stateName.includes("TERENGGANU"))
    {
      stateCode = "11";
    }
    if(stateName.includes("SABAH"))
    {
      stateCode = "12";
    }
    if(stateName.includes("SARAWAK"))
    {
      stateCode = "13";
    }
    if(stateName.includes("KUALA LUMPUR") || stateName.includes("KL"))
    {
      stateCode = "14";
    }
    if(stateName.includes("LABUAN"))
    {
      stateCode = "15";
    }
    if(stateName.includes("PUTRAJAYA"))
    {
      stateCode = "16";
    }
  
    let religion = '';
    switch (currentMyKadDetails.Religion.toUpperCase()) {
      case 'ISLAM': {
        religion = '1';
        break;
      }
      case 'KRISTIAN': {
        religion = '2';
        break;
      }
      case 'BUDDHA': {
        religion = '3';
        break;
      }
      case 'HINDU': {
        religion = '4';
        break;
      }
      case 'SIKHISM': {
        religion = '5';
        break;
      }
      case 'TIADA AGAMA': {
        religion = '6';
        break;
      }
      case 'LAIN UGAMA': {
        religion = '7';
        break;
      }
      case 'MAKLUMAT TIADA': {
        religion = '8';
        break;
      }
      case 'TAO': {
        religion = '9';
        break;
      }
      case 'KONFUSIANISME': {
        religion = 'A';
        break;
      }
      case 'ISLAM': {
        religion = 'B';
        break;
      }
      case 'BAHAI': {
        religion = 'C';
        break;
      }
      case 'JUDAISM': {
        religion = 'D';
        break;
      }
      default: {
        religion = '8';
        break;
      }
    }

    const body = {
      cifNum: '',
      regType: 'M',
      accNum: '',
      accType: '',
      primaryIdTypeCode: currentMyKadDetails.CategoryType,
      primaryIdNum: currentMyKadDetails.ICNo,
      custName: currentMyKadDetails.Name,
      birthDate: currentMyKadDetails.DOB.toString().replace('T00:00:00', ''),
      residentStatus: residentStat,
      gender: gender,
      citizenCountry: 'MAL',
      race: race,
      religion: religion,
      matrimAsset: 'N',
      handicapRemarks: '',
      regChannel: 'SST',
      regRcvdDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      prefComChannel: 'ML',
      addLine1: currentMyKadDetails.Address1,
      addLine2: currentMyKadDetails.Address2,
      addLine3: currentMyKadDetails.Address3,
      addLine4: '',
      addLine5: '',
      postalCode: currentMyKadDetails.PostCode,
      cityStateZip: currentMyKadDetails.City,
      stateCode: stateCode,
      countryCode: 'MAL',
      addRemarks: 'Permenant Address',
      addLine1A: currentMyKadDetails.Address1,
      addLine2A: currentMyKadDetails.Address2,
      addLine3A: currentMyKadDetails.Address3,
      addLine4A: '',
      addLine5A: '',
      postalCode1: currentMyKadDetails.PostCode,
      cityStateZip1: currentMyKadDetails.City,
      stateCode1: stateCode,
      countryCode1: 'MAL',
      addRemarks1: 'Correspondance Address',
      homePhone: '',
      officePhone: '',
      mobilePhone: this.phoneNo,
      faxNum: '',
      emailAdd: this.fullEmailAddress,
      areaCode: areaCode,
      creationDate: '0001-01-01',
      creationTime: '',
      creationUserID: '',
      creationTerminalID: '',
      creationBranchNo: '',
      lastMaintDate: '0001-01-01',
      lastMaintTime: '',
      lastMaintUserID: '',
      lastMaintTerminalID: '',
      lastMaintBranchNo: '',
      sessionId: appFunc.sessionId,
    };

    const Profilebody = {
      "regType": "M",
      "accNum": '',
      "accType": "S",
      "searchType": "I",
      "idNum": currentMyKadDetails.ICNo,
      "idType": currentMyKadDetails.CategoryType,
      "reqTypeCode": '',
      "sessionId": appFunc.sessionId
    }

    this._aldanService
    .MemberRegistration(body, selectLang.selectedLang)
    .subscribe((result: any) => {
      if (result.body.responseCode == '0') {

        this.KWSPMemberNo = result.body.detail.accNum;
        this.KWSPCustomerNo = result.body.detail.cifNum;

        const addMobileTACBody = {
          custNum: this.KWSPCustomerNo,
          tacMobilePhoneCode: 'TA',
          tacMobilePhone: this.phoneNo,
          registrationDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          registrationChannel: 'SST',
          status: 'P',
          checkForDuplicate: 'N',
          generateRequestNum: 'N',
          requestNum: '',
          sessionId: appFunc.sessionId,
        };

        this._aldanService
          .AddTAC(addMobileTACBody)
          .subscribe((result: any) => {
            if (result.body.responseCode == '0') { // TAC Success
              if (this.isiAkaunRegModuleEnabled) { // iAkaun is Enabled

                const iAkaunbody = {
                  epfNum: this.KWSPMemberNo,
                  tacMobileNum: this.phoneNo,
                  branchCode: '',
                  migrationFlag: '',
                  clientChannel: 'SST',
                  source: '',
                  subSource: '',
                  ipAddress: '',
                  validity: '',
                  sessionId: appFunc.sessionId,
                };

                if (this.fullEmailAddress == '') this.fullEmailAddress = '@';
                this._aldanService
                  .iAkaunRegistration(
                    currentMyKadDetails.ICNo, 
                    currentMyKadDetails.Name, 
                    this.phoneNo, 
                    this.fullEmailAddress, 
                    selectLang.selectedLang, 
                    iAkaunbody
                  )
                  .subscribe((result: any) => {
                    let iAkaunres = result;
                    this._aldanService
                      .MemberProfileInfo(Profilebody)
                      .subscribe((result: any) => {
                        this.isCallAPI = false;
                        deleteKeyboard();
                        if (result.body.responseCode == '0') appFunc.currMemberDetail = result.body.detail;
                        this.ValidateProfilePage = false;
                        this.RegisterSuccessPage = true;
                        if(iAkaunres.body.responseCode == '0'){
                          this.isiAkaunRegSuccessful = true;
                        }
                        else{ //failed register iAkaun
                          this.isiAkaunRegModuleEnabled = false;
                          this.failediAkaun = true;
                        }
                      },(err: HttpErrorResponse) => {
                        appFunc.message = "HttpError";
                        this.route.navigate(['outofservice']);
                      });
                  },(err: HttpErrorResponse) => { //failed register iAkaun
                    appFunc.message = "HttpError";
                    this.route.navigate(['outofservice']);
                  });
              } 
              else{ // iAkaun is disabled
                this._aldanService
                  .MemberProfileInfo(Profilebody)
                  .subscribe((result: any) => {
                    this.isCallAPI = false;
                    if (result.body.responseCode == '0') {
                      appFunc.currMemberDetail = result.body.detail;
                      this.ValidateProfilePage = false;
                      this.RegisterSuccessPage = true;
                      deleteKeyboard();
                    }
                    else{
                      this.isCallAPI = false;
                      this.ValidateProfilePage = false;
                      this.errorDesc = result.body.error[0].description;
                      this.Failed = true;
                    }
                });
              }
            }
            else { // Failed TAC
              this.failedTAC = true;
              const iAkaunbody = {
                epfNum: this.KWSPMemberNo,
                tacMobileNum: this.phoneNo,
                branchCode: '',
                migrationFlag: '',
                clientChannel: 'SST',
                source: '',
                subSource: '',
                ipAddress: '',
                validity: '',
                sessionId: appFunc.sessionId,
              };

              if (this.fullEmailAddress == '') this.fullEmailAddress = "@";
              this._aldanService
                .iAkaunRegistration(
                  currentMyKadDetails.ICNo, 
                  currentMyKadDetails.Name, 
                  this.phoneNo, 
                  this.fullEmailAddress, 
                  selectLang.selectedLang, 
                  iAkaunbody
                )
                .subscribe((result: any) => {
                  let iAkaunRes = result;
                  this._aldanService
                    .MemberProfileInfo(Profilebody)
                    .subscribe((result: any) => {
                      this.isCallAPI = false;
                      deleteKeyboard();
                      if (result.body.responseCode == '0') appFunc.currMemberDetail = result.body.detail;
                      this.ValidateProfilePage = false;
                      this.RegisterSuccessPage = true;
                      if(iAkaunRes.body.responseCode == '0'){
                        this.isiAkaunRegSuccessful = true;
                      }
                      else{ //failed register iAkaun
                        this.isiAkaunRegModuleEnabled = false;
                        this.failediAkaun = true;
                      }
                    },(err: HttpErrorResponse) => {
                      appFunc.message = "HttpError";
                      this.route.navigate(['outofservice']);
                    });
                },(err: HttpErrorResponse) => { //failed register iAkaun
                  appFunc.message = "HttpError";
                  this.route.navigate(['outofservice']);
                });
            }
          },(err: HttpErrorResponse) => {
            appFunc.message = "HttpError";
            this.route.navigate(['outofservice']);
          });
      } 
      else {
        appFunc.message = 'unsuccesfulRegistration';
        this.route.navigate(['outofservice']);
      }
    },(err: HttpErrorResponse) => {
      appFunc.message = "HttpError";
      this.route.navigate(['outofservice']);
    });
  }

  ValidateProfileNo() {
    this.ValidateProfilePage = false;
    this.InsertEmailPage = true;
    this.fullEmailAddress = '';

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  RegisterSuccessYes() {
    if(!this.isiAkaunRegSuccessful){
      this.RegKWSP = false;
      this.RegShariah = true;
      if (this.isiSaraanModuleEnabled || this.isiShariahModuleEnabled) {
        this.RegisterSuccessPage = false;
        this.PickShariahPage = true;
      } else {
        this.route.navigate(['mainMenu']);
      }
    }
    else{
      if (this.isiAkaunRegModuleEnabled) {
        if (this.isiAkaunActModuleEnabled) {
          this.isCallAPI = true;
          if (appFunc.bypassAPI != true) {
            this._aldanService
              .GetTnC(selectLang.selectedLang, appFunc.sessionId)
              .subscribe((result: any) => {
                this.isCallAPI = false;
                if (result.body.content != '') {
                  this.TnC = result.body.content.toString();
                  this.content_version = result.body.contentVersion;
                  this.RegisterSuccessPage = false;
                  this.TnCPage = true;
                  this.RegKWSP = false;
                  this.RegIAkaun = true;
                } else {
                  this.RegisterSuccessPage = false;
                  this.Failed = true;
                  this.errorDesc = result.body.error[0].description;
                }
              },(err: HttpErrorResponse) => {
                this.isCallAPI = false;
                this.RegisterSuccessPage = false;
                this.Failed = true;
                this.errorDesc = "HttpError";
              });
          }
        } else {
          if (this.isiSaraanModuleEnabled || this.isiShariahModuleEnabled) {
            this.RegisterSuccessPage = false;
            this.PickShariahPage = true;
          } else {
            this.route.navigate(['mainMenu']);
          }
        }
      } else {
        if (this.isiSaraanModuleEnabled || this.isiShariahModuleEnabled) {
          this.RegisterSuccessPage = false;
          this.PickShariahPage = true;
        } else {
          this.route.navigate(['mainMenu']);
        }
      }
    }
    
  }

  clickTNC1() {
    this.xagreedTnc1 = !this.xagreedTnc1;
  }

  clickTNC2() {
    this.xagreedTnc2 = !this.xagreedTnc2;
  }

  TnCYes() {
    this.TnCPage = false;
    this.SetIdPassword = true;

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  TnCNo() {
    this.xagreedTnc1 = true;
    this.TnCPage = false;
    this.RegisterSuccessPage = true;
  }

  ActivateInformationYes() {
    this.emptySecret = false;
    this.imageSelect = false;
    this.securePhraseMax = false;

    this.securePhrase = this.secure_phrase?.nativeElement.value;

    let FilledIn = 0;
    let errorCount = 0;
    if (this.securePhrase.length != 0) FilledIn += 1;
    else{
      this.emptySecret = true;
    }

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
            epfNum: this.KWSPMemberNo,
            id_no: this.ic,
            user_id: this.acctNo,
            new_password: this.password1,
            secure_image_id: imageid,
            secret_phrase: this.securePhrase,
            terms_condition: this.content_version,
            sessionId: appFunc.sessionId,
          };

          this._aldanService
            .ActivateIAkaun(iAkaunActBody)
            .subscribe((result: any) => {
              this.isCallAPI = false;
              if (result.body.epf_no != "") {
                this.ActivateiAkaunPage = false;
                this.ActivateSuccessPage = true;

                deleteKeyboard();
              } else {
                this.ActivateiAkaunPage = false;
                this.Failed = true;
                this.errorDesc = result.body.error[0].description;
              }
            },(err: HttpErrorResponse) => {
              this.ActivateiAkaunPage = false;
              this.Failed = true;
              this.errorDesc = "HttpError";
            });
        } else {
          this.isCallAPI = false;
          this.ActivateiAkaunPage = false;
          this.ActivateSuccessPage = true;
        }
      } else {
        this.isCallAPI = false;
      }
    }
  }

  ActivateInformationNo() {
    this.ActivateiAkaunPage = false;
    this.SetIdPassword = true;

    this.checkboxImages = [];
    deleteKeyboard();

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  SetIdPasswordYes() {
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
        if (appFunc.bypassAPI != true) {
          this.isCallAPI = true;
          this._aldanService
            .GetSecureImage(appFunc.sessionId)
            .subscribe((result: any) => {
              deleteKeyboard();
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
                this.ActivateiAkaunPage = true;
                setTimeout(() => {
                  loadKeyboard();
                }, 500);
              } else {
                this.SetIdPassword = false;
                this.Failed = true;
                this.errorDesc = result.body.error[0].description;
              }
            },(err: HttpErrorResponse) => {
              appFunc.message = "HttpError";
              this.route.navigate(['outofservice']);
            });
        }
      }
    }
  }

  SetIdPasswordNo() {
    this.SetIdPassword = false;
    this.TnCPage = true;

    deleteKeyboard();
  }

  ActivateSuccessYes() {
    this.RegIAkaun = false;
    this.RegShariah = true;
    this.ActivateSuccessPage = false;
    this.PickShariahPage = true;
  }

  IShariahNo() {
    this.PickShariahPage = false;
    this.RegisteriSaraanPage = true;
  }

  IShariahYes() {
    if (appFunc.bypassAPI != true) {
      this.isCallAPI = true;
      this._aldanService
        .GetContract(selectLang.selectedLang, appFunc.sessionId)
        .subscribe((result: any) => {
          this.isCallAPI = false;
          if (result.body.content != '') {
            this.Contract = result.body.content;
            this.PickShariahPage = false;
            this.ShariahTnCPage = true;
            this.xagreedTnc2 = true;
            this.RegShariah = true;
            setTimeout(() => {
              this.contractHTML?.nativeElement.insertAdjacentHTML('afterbegin', this.Contract);
            }, 200)
          } else {
            this.PickShariahPage = false;
            this.Failed = true;
            this.errorDesc = result.body.error[0].description;
          }
        },(err: HttpErrorResponse) => {
          appFunc.message = "HttpError";
          this.route.navigate(['outofservice']);
        });
    }
  }

  ShariahTnCYes() {
    this.isCallAPI = true;
    const iShariahBody = {
      custNum: this.KWSPCustomerNo,
      accNum: this.KWSPMemberNo,
      accType: 'S',
      electChannel: 'SST',
      electReceivedDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      electReceivedTime: formatDate(new Date(), 'hh.mm.ss', 'en'),
      electReceivedBranch: '1',
      electDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      electBranch: '1',
      electStatus: 'A',
      reasonCode: '',
      akadRefNum: '',
      docRefNum: '',
      sessionId: appFunc.sessionId,
    };

    this._aldanService
      .iShariahRegistration(iShariahBody)
      .subscribe((result: any) => {
        this.isCallAPI = false;
        if (result.body.responseCode == '0') {
          this.ShariahTnCPage = false;
          this.ShariahSuccessPage = true;
        } else {
          this.ShariahTnCPage = false;
          this.Failed = true;
          this.errorDesc = result.body.error[0].description;
        }
      },(err: HttpErrorResponse) => {
        appFunc.message = "HttpError";
        this.route.navigate(['outofservice']);
      });
  }

  ShariahTnCNo() {
    this.ShariahTnCPage = false;
    this.PickShariahPage = true;
  }

  ShariahSuccessYes() {
    this.ShariahSuccessPage = false;
    this.RegisteriSaraanPage = true;
    this.RegShariah = false;
    this.RegSaraan = true;
  }

  RegisteriSaraanYes() {
    this.RegisteriSaraanPage = false;
    this.SelectJobPage = true;
  }

  RegisteriSaraanNo() {
    this.route.navigate(['mainMenu']);
  }

  SelectJobYes() {
    if (this.selectedJobSector != undefined) {
      this.isCallAPI = true;
      const iSaraanBody = {
        idNum: currentMyKadDetails.ICNo,
        idType: currentMyKadDetails.CategoryType,
        businessTypeCode: this.selectedJobSector.code,
        remark: '',
        sourceRegistrationChannel: 'SST',
        applicationReceivedDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        sourceCreationID: 'SST',
        sourceTerminalID: 'SST',
        sourceBranchNo: '0',
        sessionId: appFunc.sessionId,
      };

      this._aldanService
        .iSaraanRegistration(iSaraanBody)
        .subscribe((result: any) => {
          if(result.status == 200){
            this.isCallAPI = false;
            if (result.body.responseCode == '0') {
              this.SelectJobPage = false;
              this.SaraanSuccessPage = true;
            } else {
              this.SelectJobPage = false;
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
  }

  SelectJobNo() {
    this.SelectJobPage = false;
    this.RegisteriSaraanPage = true;
  }

  SaraanSuccessYes() {
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

  selectJob(jobSector: any){
    this.defaultDDL = jobSector.code;
    this.selectedJobSector = jobSector;
  }

  failedYes() {
    if(this.RegIAkaun){
      this.Failed = false;
      this.RegIAkaun = false;
      this.RegShariah = true;
      this.PickShariahPage = true;
    }
    else if(this.RegShariah){
      this.Failed = false;
      this.RegShariah = false;
      this.RegisteriSaraanPage = true;
      this.RegSaraan = true;
    }
    else{
      this.route.navigate(['mainMenu']);
    }
  }
}
