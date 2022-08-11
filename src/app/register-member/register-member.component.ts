import { state } from '@angular/animations';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { businessTypes } from '../_models/modelClass';
import { appFunc } from '../_models/_appFunc';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { signalRConnection } from '../_models/_signalRConnection';

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
  @ViewChild('contract') contractHTML: ElementRef | undefined;

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
  failedTAC = true;
  failediAkaun = true;
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
  isSuri = false;
  isAIO = false;

  jobSectors: businessTypes[] = [];
  checkboxImages: any[] = [];
  emailList: string[] = ['gmail.com', 'hotmail.com', 'yahoo.com', 'custom'];

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
  defaultDDL = 'default';
  currentLang = 'bm';
  errorCode = '';

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
    this.dob = formatDate(currentMyKadDetails.DOB, 'dd/MM/yyyy', 'en');
    this.nationality = currentMyKadDetails.Citizenship;
    this.gender = currentMyKadDetails.Gender;
    this.race = currentMyKadDetails.Race;
    this.religion = currentMyKadDetails.Religion;

    if (selectLang.selectedLang == 'bm') {
      if (this.gender == 'Male') {
        this.gender = 'LELAKI';
      } else if (this.gender == 'Female') {
        this.gender = 'PEREMPUAN';
      }
    } else {
      if (this.gender == 'Male') {
        this.gender = 'MALE';
      } else {
        this.gender = 'FEMALE';
      }

      if (this.nationality == 'WARGANEGARA') {
        this.nationality = 'CITIZEN';
      }

      if (this.race == 'MELAYU') {
        this.race = 'MALAY';
      } else if (this.race == 'CINA') {
        this.race = 'CHINESE';
      } else if (this.race == 'INDIA') {
        this.race = 'INDIAN';
      }
    }
  }

  onChange(event: any) {
    if (event.target.value == 'custom') {
      this.isCustom = true;
    }
  }

  reset() {
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

    if (this.email?.nativeElement.value == '') {
      this.noEmail = true;
      this.fullEmailAddress = '';
      this.InsertEmailPage = false;
      this.ValidateProfilePage = true;
      deleteKeyboard();
    } else {
      this.noEmail = false;
      if (this.isCustom) {
        this.emailDDLTextValue = this.emailDDLText?.nativeElement.value;
        this.emailAddress = this.email?.nativeElement.value;
        this.fullEmailAddress =
          this.email?.nativeElement.value == 0
            ? ''
            : this.email?.nativeElement.value +
              '@' +
              this.emailDDLText?.nativeElement.value;
      } else {
        this.emailAddress = this.email?.nativeElement.value;
        this.fullEmailAddress =
          this.email?.nativeElement.value == 0
            ? ''
            : this.email?.nativeElement.value +
              '@' +
              this.emailDDL?.nativeElement.value;
      }

      if (appFunc.isEmail(this.fullEmailAddress)) {
        this.InsertEmailPage = false;
        this.ValidateProfilePage = true;
        deleteKeyboard();
      } else {
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
    // if (residentStat == 'X') {
    //   switch (currentMyKadDetails.State.toUpperCase()) {
    //     case 'SABAH': {
    //       areaCode = 'E';
    //       break;
    //     }
    //     case 'SARAWAK': {
    //       areaCode = 'F';
    //       break;
    //     }
    //     default: {
    //       areaCode = 'D';
    //       break;
    //     }
    //   }
    // } else {
    //   switch (currentMyKadDetails.State.toUpperCase()) {
    //     case 'SABAH': {
    //       areaCode = 'B';
    //       break;
    //     }
    //     case 'SARAWAK': {
    //       areaCode = 'C';
    //       break;
    //     }
    //     default: {
    //       areaCode = 'A';
    //       break;
    //     }
    //   }
    // }
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
      case 'HAINANESE': {
        race = '0203';
        break;
      }
      case 'HENGHUA': {
        race = '0204';
        break;
      }
      case 'HOKCHIA': {
        race = '0205';
        break;
      }
      case 'HOKCHIU': {
        race = '0206';
        break;
      }
      case 'HOKKIEN': {
        race = '0207';
        break;
      }
      case 'KHEK (HAKKA)': {
        race = '0208';
        break;
      }
      case 'KWONGSAI': {
        race = '0209';
        break;
      }
      case 'TEOCHEW': {
        race = '0210';
        break;
      }
      case 'INDIA': {
        race = '0300';
        break;
      }
      case 'MALAYALI': {
        race = '0301';
        break;
      }
      case 'PUNJABI': {
        race = '0302';
        break;
      }
      case 'SIKH': {
        race = '0303';
        break;
      }
      case 'TAMIL': {
        race = '0304';
        break;
      }
      case 'TELEGU': {
        race = '0305';
        break;
      }
      case 'MALABARI': {
        race = '0306';
        break;
      }
      case 'INDIA MUSLIM': {
        race = '0307';
        break;
      }
      case 'BANGLADESHI': {
        race = '0400';
        break;
      }
      case 'PAKISTANI': {
        race = '0500';
        break;
      }
      case 'SRI LANKA': {
        race = '0600';
        break;
      }
      case 'TAMIL SRI LANKA': {
        race = '0601';
        break;
      }
      case 'MELAYU SRI LANKA': {
        race = '0602';
        break;
      }
      case 'SINHALESE': {
        race = '0603';
        break;
      }
      case 'INDONESIA': {
        race = '0700';
        break;
      }
      case 'TIDUNG': {
        race = '0701';
        break;
      }
      case 'ETNIK SABAH': {
        race = '0800';
        break;
      }
      case 'BAJAU': {
        race = '0801';
        break;
      }
      case 'DUSUN': {
        race = '0802';
        break;
      }
      case 'KADAZAN': {
        race = '0803';
        break;
      }
      case 'MURUT': {
        race = '0804';
        break;
      }
      case 'SINO-NATIVE': {
        race = '0805';
        break;
      }
      case 'SULUK': {
        race = '0806';
        break;
      }
      case 'BINADAN': {
        race = '0901';
        break;
      }
      case 'BISAYA': {
        race = '0902';
        break;
      }
      case 'BONGOL': {
        race = '0903';
        break;
      }
      case 'BRUNEI': {
        race = '0904';
        break;
      }
      case 'DUMPAS': {
        race = '0905';
        break;
      }
      case 'IRANUN': {
        race = '0906';
        break;
      }
      case 'IDAHAN': {
        race = '0907';
        break;
      }
      case 'KWIJAU': {
        race = '0908';
        break;
      }
      case 'KEDAYAN': {
        race = '0909';
        break;
      }
      case 'LINGKABAU': {
        race = '0910';
        break;
      }
      case 'LUNDAYEH': {
        race = '0911';
        break;
      }
      case 'LASAU': {
        race = '0912';
        break;
      }
      case 'MELANAU': {
        race = '0913';
        break;
      }
      case 'MANGKAAK': {
        race = '0914';
        break;
      }
      case 'MATAGANG': {
        race = '0915';
        break;
      }
      case 'MINOKOK': {
        race = '0916';
        break;
      }
      case 'MOMOGUN': {
        race = '0918';
        break;
      }
      case 'PAITAN': {
        race = '0919';
        break;
      }
      case 'RUMANAU': {
        race = '0920';
        break;
      }
      case 'RUNGUS': {
        race = '0921';
        break;
      }
      case 'SUNGAI': {
        race = '0922';
        break;
      }
      case 'SONSONGAN': {
        race = '0923';
        break;
      }
      case 'SINULIHAN': {
        race = '0924';
        break;
      }
      case 'TOMBONUO': {
        race = '0925';
        break;
      }
      case 'TAGAL': {
        race = '0926';
        break;
      }
      case 'TINAGAS': {
        race = '0927';
        break;
      }
      case 'COCOS': {
        race = '0928';
        break;
      }
      case 'KIMARAGANG': {
        race = '0929';
        break;
      }
      case 'BOLONGAN': {
        race = '0930';
        break;
      }
      case 'BUTON': {
        race = '0931';
        break;
      }
      case 'BUMIPUTERA SARAWAK': {
        race = '1000';
        break;
      }
      case 'MELAYU SARAWAK': {
        race = '1001';
        break;
      }
      case 'MELANAU': {
        race = '1002';
        break;
      }
      case 'KEDAYAN': {
        race = '1003';
        break;
      }
      case 'IBAN ATAU SEA DAYAK': {
        race = '1004';
        break;
      }
      case 'BIDAYUH ATAU LAND DAYAK': {
        race = '1005';
        break;
      }
      case 'KAYAN': {
        race = '1006';
        break;
      }
      case 'KENYAH': {
        race = '1007';
        break;
      }
      case 'MURUT ATAU LUN BAWANG': {
        race = '1008';
        break;
      }
      case 'KELABIT': {
        race = '1009';
        break;
      }
      case 'PUNAN': {
        race = '1010';
        break;
      }
      case 'BISAYA': {
        race = '1101';
        break;
      }
      case 'BERAWAN': {
        race = '1102';
        break;
      }
      case 'BELOT': {
        race = '1103';
        break;
      }
      case 'BHUKET ATAU UKIT': {
        race = '1104';
        break;
      }
      case 'BALAU': {
        race = '1105';
        break;
      }
      case 'BATANG AI': {
        race = '1106';
        break;
      }
      case 'BATU ELAH': {
        race = '1107';
        break;
      }
      case 'BAKETAN': {
        race = '1108';
        break;
      }
      case 'BINTULU': {
        race = '1109';
        break;
      }
      case 'BADENG': {
        race = '1110';
        break;
      }
      case 'DUSUN': {
        race = '1111';
        break;
      }
      case 'JAGOI': {
        race = '1112';
        break;
      }
      case 'LAKIPUT': {
        race = '1113';
        break;
      }
      case 'KAJANG': {
        race = '1114';
        break;
      }
      case 'KEJAMAN': {
        race = '1115';
        break;
      }
      case 'KANOWIT': {
        race = '1116';
        break;
      }
      case 'LIRONG': {
        race = '1117';
        break;
      }
      case 'LEMANAK': {
        race = '1118';
        break;
      }
      case 'LAHANAN': {
        race = '1119';
        break;
      }
      case 'LISUM ATAU LUGUM': {
        race = '1120';
        break;
      }
      case 'MATU': {
        race = '1121';
        break;
      }
      case 'MEMALOH': {
        race = '1122';
        break;
      }
      case 'MELIKIN': {
        race = '1123';
        break;
      }
      case 'MELAING': {
        race = '1124';
        break;
      }
      case 'NGORIK ATAU MUREK': {
        race = '1125';
        break;
      }
      case 'MENONDO': {
        race = '1126';
        break;
      }
      case 'JAMOK': {
        race = '1127';
        break;
      }
      case 'SEBOP': {
        race = '1128';
        break;
      }
      case 'SEDUAN': {
        race = '1129';
        break;
      }
      case 'SEKAPAN': {
        race = '1130';
        break;
      }
      case 'SEGALANG': {
        race = '1131';
        break;
      }
      case 'SIHAN': {
        race = '1132';
        break;
      }
      case 'SEPING': {
        race = '1133';
        break;
      }
      case 'SARIBAS': {
        race = '1134';
        break;
      }
      case 'SEBUYAU': {
        race = '1135';
        break;
      }
      case 'SKRANG': {
        race = '1136';
        break;
      }
      case 'SABAN': {
        race = '1137';
        break;
      }
      case 'SELAKAN': {
        race = '1138';
        break;
      }
      case 'SELAKO': {
        race = '1139';
        break;
      }
      case 'TAGAL': {
        race = '1140';
        break;
      }
      case 'TABUN': {
        race = '1141';
        break;
      }
      case 'TUTONG': {
        race = '1142';
        break;
      }
      case 'TANJONG': {
        race = '1143';
        break;
      }
      case 'TATAU': {
        race = '1144';
        break;
      }
      case 'TAUP': {
        race = '1145';
        break;
      }
      case 'UKIT': {
        race = '1146';
        break;
      }
      case 'UNKOP': {
        race = '1147';
        break;
      }
      case 'ULU AI': {
        race = '1148';
        break;
      }
      case 'ORANG ASLI (SEMENANJUNG)': {
        race = '1200';
        break;
      }
      case 'JAKUN': {
        race = '1201';
        break;
      }
      case 'NEGRITO': {
        race = '1202';
        break;
      }
      case 'SAKAI': {
        race = '1203';
        break;
      }
      case 'SEMAI': {
        race = '1204';
        break;
      }
      case 'SEMALAI': {
        race = '1205';
        break;
      }
      case 'TEMIAR': {
        race = '1206';
        break;
      }
      case 'SENOI': {
        race = '1207';
        break;
      }
      case 'PENAN': {
        race = '1208';
        break;
      }
      case 'LAIN-LAIN ASIA': {
        race = '1300';
        break;
      }
      case 'ARAB': {
        race = '1301';
        break;
      }
      case 'BURMESE': {
        race = '1302';
        break;
      }
      case 'EURASIAN': {
        race = '1303';
        break;
      }
      case 'FIJIAN': {
        race = '1304';
        break;
      }
      case 'FILIPINO': {
        race = '1305';
        break;
      }
      case 'GURKHA': {
        race = '1306';
        break;
      }
      case 'JAPANESE': {
        race = '1307';
        break;
      }
      case 'KHMER': {
        race = '1308';
        break;
      }
      case 'KOREAN': {
        race = '1309';
        break;
      }
      case 'MALTESE': {
        race = '1310';
        break;
      }
      case 'PORTUGESE': {
        race = '1311';
        break;
      }
      case 'THAI': {
        race = '1312';
        break;
      }
      case 'VIETNAMESE': {
        race = '1313';
        break;
      }
      case 'IRANIAN': {
        race = '1314';
        break;
      }
      case 'AFGHAN': {
        race = '1315';
        break;
      }
      case 'CAUCASIAN': {
        race = '1316';
        break;
      }
      case 'KYRGYZ': {
        race = '1317';
        break;
      }
      case 'UBIAN': {
        race = '1318';
        break;
      }
      case 'EUROPEAN': {
        race = '1400';
        break;
      }
      case 'BRITISH': {
        race = '1401';
        break;
      }
      case 'ALGERIA': {
        race = '1402';
        break;
      }
      case 'ANTIGUA-BARBUDA': {
        race = '1403';
        break;
      }
      case 'AUSTRALIA': {
        race = '1404';
        break;
      }
      case 'ANGOLA': {
        race = '1405';
        break;
      }
      case 'ARGENTINA': {
        race = '1406';
        break;
      }
      case 'ALBANIA': {
        race = '1407';
        break;
      }
      case 'AUSTRIA': {
        race = '1408';
        break;
      }
      case 'MIDDLE AFRICA': {
        race = '1410';
        break;
      }
      case 'SOUTH AFRICA': {
        race = '1411';
        break;
      }
      case 'BAHRAIN': {
        race = '1412';
        break;
      }
      case 'BAHAMAS': {
        race = '1413';
        break;
      }
      case 'BARBADOS': {
        race = '1414';
        break;
      }
      case 'BELIZE': {
        race = '1415';
        break;
      }
      case 'BOTSWANA': {
        race = '1416';
        break;
      }
      case 'BENIN': {
        race = '1418';
        break;
      }
      case 'BHUTAN': {
        race = '1419';
        break;
      }
      case 'BOLIVIA': {
        race = '1420';
        break;
      }
      case 'BRAZIL': {
        race = '1421';
        break;
      }
      case 'BURUNDI': {
        race = '1422';
        break;
      }
      case 'BULGARIA': {
        race = '1423';
        break;
      }
      case 'BELGIUM': {
        race = '1424';
        break;
      }
      case 'BELARUS': {
        race = '1425';
        break;
      }
      case 'BOSNIA-HERZEGOVINA': {
        race = '1427';
        break;
      }
      case 'CAMEROON': {
        race = '1428';
        break;
      }
      case 'CHAD': {
        race = '1429';
        break;
      }
      case 'CANADA': {
        race = '1430';
        break;
      }
      case 'CYPRUS': {
        race = '1431';
        break;
      }
      case 'CAPE VERDE': {
        race = '1432';
        break;
      }
      case 'CROTIA': {
        race = '1433';
        break;
      }
      case 'CHILE': {
        race = '1434';
        break;
      }
      case 'COLOMBIA': {
        race = '1435';
        break;
      }
      case 'COMOROS': {
        race = '1436';
        break;
      }
      case 'COSTA-RICA': {
        race = '1437';
        break;
      }
      case 'CUBA': {
        race = '1438';
        break;
      }
      case 'DJBOUTI': {
        race = '1439';
        break;
      }
      case 'DOMINICA': {
        race = '1440';
        break;
      }
      case 'DAHOMEY': {
        race = '1441';
        break;
      }
      case 'DENMARK': {
        race = '1442';
        break;
      }
      case 'EQUADOR': {
        race = '1443';
        break;
      }
      case 'EL SALVADOR': {
        race = '1444';
        break;
      }
      case 'EQUATORIAL GUINEA': {
        race = '1445';
        break;
      }
      case 'ETOPIA': {
        race = '1446';
        break;
      }
      case 'FRANCE': {
        race = '1448';
        break;
      }
      case 'FINLAND': {
        race = '1449';
        break;
      }
      case 'GABON': {
        race = '1451';
        break;
      }
      case 'GAMBIA': {
        race = '1452';
        break;
      }
      case 'GUINEA': {
        race = '1453';
        break;
      }
      case 'GUINEA-BISSAU': {
        race = '1454';
        break;
      }
      case 'GHANA': {
        race = '1455';
        break;
      }
      case 'GRENADA': {
        race = '1456';
        break;
      }
      case 'GUYANA': {
        race = '1457';
        break;
      }
      case 'GUATEMALA': {
        race = '1458';
        break;
      }
      case 'GREECE': {
        race = '1459';
        break;
      }
      case 'GERMANY': {
        race = '1460';
        break;
      }
      case 'HAITI': {
        race = '1461';
        break;
      }
      case 'HONDURAS': {
        race = '1462';
        break;
      }
      case 'HUNGARY': {
        race = '1463';
        break;
      }
      case 'HONG KONG': {
        race = '1464';
        break;
      }
      case 'IRAQ': {
        race = '1466';
        break;
      }
      case 'IVORY COAST': {
        race = '1467';
        break;
      }
      case 'ISRAEL': {
        race = '1468';
        break;
      }
      case 'IRELAND': {
        race = '1469';
        break;
      }
      case 'ITALY': {
        race = '1470';
        break;
      }
      case 'ICELAND': {
        race = '1471';
        break;
      }
      case 'JORDAN': {
        race = '1472';
        break;
      }
      case 'JAMAICA': {
        race = '1473';
        break;
      }
      case 'KUWAIT': {
        race = '1475';
        break;
      }
      case 'KENYA': {
        race = '1476';
        break;
      }
      case 'KIRIBATI': {
        race = '1477';
        break;
      }
      case 'KOREA(UTARA)': {
        race = '1479';
        break;
      }
      case 'KEMBOJA': {
        race = '1480';
        break;
      }
      case 'LEBANON': {
        race = '1481';
        break;
      }
      case 'LIBYA': {
        race = '1482';
        break;
      }
      case 'LESOTHO': {
        race = '1483';
        break;
      }
      case 'LAOS': {
        race = '1484';
        break;
      }
      case 'LIBERIA': {
        race = '1485';
        break;
      }
      case 'LUXEMBOURG': {
        race = '1486';
        break;
      }
      case 'MALI': {
        race = '1487';
        break;
      }
      case 'MALDIVES': {
        race = '1488';
        break;
      }
      case 'MAURITANIA': {
        race = '1489';
        break;
      }
      case 'MOROCCO': {
        race = '1490';
        break;
      }
      case 'MALAWI': {
        race = '1491';
        break;
      }
      case 'MADAGASCAR': {
        race = '1493';
        break;
      }
      case 'MAURITIUS': {
        race = '1494';
        break;
      }
      case 'MEXICO': {
        race = '1495';
        break;
      }
      case 'MOZAMBIQUE': {
        race = '1496';
        break;
      }
      case 'MONGOLIA': {
        race = '1497';
        break;
      }
      case 'MESIR': {
        race = '1498';
        break;
      }
      case 'MYANMAR': {
        race = '1499';
        break;
      }
      case 'LAIN-LAIN': {
        race = '1500';
        break;
      }
      case 'NAMIBIA': {
        race = '1501';
        break;
      }
      case 'NAURU': {
        race = '1502';
        break;
      }
      case 'NEW ZEALAND': {
        race = '1503';
        break;
      }
      case 'NIGERIA': {
        race = '1504';
        break;
      }
      case 'NEPAL': {
        race = '1505';
        break;
      }
      case 'NICARAGUA': {
        race = '1506';
        break;
      }
      case 'NETHERLAND': {
        race = '1507';
        break;
      }
      case 'NORWAY': {
        race = '1508';
        break;
      }
      case 'OMAN': {
        race = '1509';
        break;
      }
      case 'PAPUA NEW GUINEA': {
        race = '1510';
        break;
      }
      case 'PALESTIN': {
        race = '1511';
        break;
      }
      case 'PANAMA': {
        race = '1512';
        break;
      }
      case 'PARAGUAY': {
        race = '1513';
        break;
      }
      case 'PERU': {
        race = '1514';
        break;
      }
      case 'POLAND': {
        race = '1515';
        break;
      }
      case 'QATAR': {
        race = '1517';
        break;
      }
      case 'ROMANIA': {
        race = '1518';
        break;
      }
      case 'RWANDA': {
        race = '1519';
        break;
      }
      case 'REPUBLIK CZECH': {
        race = '1520';
        break;
      }
      case 'REPUBLIK SLOVAKIA': {
        race = '1521';
        break;
      }
      case 'SENEGAL': {
        race = '1522';
        break;
      }
      case 'SIERRA LEONE': {
        race = '1523';
        break;
      }
      case 'SOMALIA': {
        race = '1524';
        break;
      }
      case 'SUDAN': {
        race = '1525';
        break;
      }
      case 'SYRIA': {
        race = '1526';
        break;
      }
      case 'ST.LUCIA': {
        race = '1527';
        break;
      }
      case 'ST.VINCENT': {
        race = '1528';
        break;
      }
      case 'SYCHELLES': {
        race = '1529';
        break;
      }
      case 'SOLOMON ISLAND': {
        race = '1530';
        break;
      }
      case 'SRI LANKA': {
        race = '1531';
        break;
      }
      case 'SWAZILAND': {
        race = '1532';
        break;
      }
      case 'SAMOA': {
        race = '1533';
        break;
      }
      case 'SAO TOME & PRINCIPE': {
        race = '1534';
        break;
      }
      case 'SURINAM': {
        race = '1535';
        break;
      }
      case 'SAMOA BARAT': {
        race = '1536';
        break;
      }
      case 'SWEDEN': {
        race = '1537';
        break;
      }
      case 'SPAIN': {
        race = '1538';
        break;
      }
      case 'SWITZERLAND': {
        race = '1539';
        break;
      }
      case 'TUNISIA': {
        race = '1540';
        break;
      }
      case 'TURKEY': {
        race = '1541';
        break;
      }
      case 'TANZANIA': {
        race = '1542';
        break;
      }
      case 'TONGA': {
        race = '1543';
        break;
      }
      case 'TRINIDAD & TOBAGO': {
        race = '1544';
        break;
      }
      case 'TUVALI': {
        race = '1545';
        break;
      }
      case 'TOGO': {
        race = '1547';
        break;
      }
      case 'TAIWAN': {
        race = '1548';
        break;
      }
      case 'UGANDA': {
        race = '1549';
        break;
      }
      case 'UNITED ARAB EMIRATES': {
        race = '1550';
        break;
      }
      case 'UPPER VOLTA': {
        race = '1551';
        break;
      }
      case 'URUGUAY': {
        race = '1552';
        break;
      }
      case 'RUSSIA': {
        race = '1553';
        break;
      }
      case 'UKRAINE': {
        race = '1554';
        break;
      }
      case 'UNITED STATES': {
        race = '1555';
        break;
      }
      case 'VANUATU': {
        race = '1556';
        break;
      }
      case 'VENEZUELA': {
        race = '1557';
        break;
      }
      case 'YEMEN': {
        race = '1559';
        break;
      }
      case 'YUGOSLAVIA': {
        race = '1560';
        break;
      }
      case 'MACEDONIA': {
        race = '1561';
        break;
      }
      case 'ZAIRE': {
        race = '1562';
        break;
      }
      case 'ZAMBIA': {
        race = '1563';
        break;
      }
      case 'ZIMBABWE': {
        race = '1564';
        break;
      }
      case 'MAKLUMAT TIADA': {
        race = '9999';
        break;
      }
      case 'TELUGU': {
        race = '0308';
        break;
      }
      case 'ORISSA': {
        race = '0309';
        break;
      }
      case 'MELAYU SABAH': {
        race = '0917';
        break;
      }
      case 'KAGAYAN': {
        race = '0932';
        break;
      }
      case 'PENAN': {
        race = '1011';
        break;
      }
      case 'UZBEKISTAN': {
        race = '1319';
        break;
      }
      case 'AZERBAIJAN': {
        race = '1320';
        break;
      }
      case 'SIAM': {
        race = '1321';
        break;
      }
      case 'KONGFOO': {
        race = '0211';
        break;
      }
      case 'HYLAM': {
        race = '0212';
        break;
      }
      case 'KENGCHU': {
        race = '0213';
        break;
      }
      case 'KOCHOU': {
        race = '0214';
        break;
      }
      case 'CEYLONESE': {
        race = '0604';
        break;
      }
      case 'TIDUNG': {
        race = '0807';
        break;
      }
      case 'BALABAK': {
        race = '0933';
        break;
      }
      case 'KADAZAN-SINO': {
        race = '0934';
        break;
      }
      case 'DUSUN-SINO': {
        race = '0935';
        break;
      }
      case 'BAJAU-SINO': {
        race = '0936';
        break;
      }
      case 'MURUT-SINO': {
        race = '0937';
        break;
      }
      case 'BRUNEI-SINO': {
        race = '0938';
        break;
      }
      case 'RUNGUS-SINO': {
        race = '0939';
        break;
      }
      case 'BISAYA-SINO': {
        race = '0940';
        break;
      }
      case 'IDAHAN-SINO': {
        race = '0941';
        break;
      }
      case 'IRANUN-SINO': {
        race = '0942';
        break;
      }
      case 'KEDAYAN-SINO': {
        race = '0943';
        break;
      }
      case 'SUNGAI-SINO': {
        race = '0944';
        break;
      }
      case 'LUNDAYEH-SINO': {
        race = '0945';
        break;
      }
      case 'SULUK-SINO': {
        race = '0946';
        break;
      }
      case 'TIDUNG-SINO': {
        race = '0947';
        break;
      }
      case 'BOLONGAN-SINO': {
        race = '0948';
        break;
      }
      case 'BALABAK-SINO': {
        race = '0949';
        break;
      }
      case 'TRING': {
        race = '1012';
        break;
      }
      case 'LOGAT': {
        race = '1013';
        break;
      }
      case 'BAH MALI': {
        race = '1014';
        break;
      }
      case 'NAROM': {
        race = '1015';
        break;
      }
      case 'BAKONG': {
        race = '1016';
        break;
      }
      case 'MIRIEK': {
        race = '1017';
        break;
      }
      case 'DALI': {
        race = '1018';
        break;
      }
      case 'SEGAN': {
        race = '1019';
        break;
      }
      case 'TORAJA': {
        race = '1149';
        break;
      }
      case 'TIMOR': {
        race = '1150';
        break;
      }
      case 'MENADO': {
        race = '1151';
        break;
      }
      case 'MANURA': {
        race = '1152';
        break;
      }
      case 'BATAK': {
        race = '1153';
        break;
      }
      case 'PATHAN': {
        race = '1154';
        break;
      }
      case 'TONGANS': {
        race = '1155';
        break;
      }
      case 'KAZAKHSTAN': {
        race = '1322';
        break;
      }
      case 'TAJIKISTAN': {
        race = '1323';
        break;
      }
      case 'SLOVENIA': {
        race = '1565';
        break;
      }
      case 'TURKMENISTAN': {
        race = '1566';
        break;
      }
      case 'PEOPLES REPUBLIC OF CHINA': {
        race = '1324';
        break;
      }
      case 'REPUBLIC OF INDIA': {
        race = '1516';
        break;
      }
      case 'MAKLUMAT TIDAK DIPEROLEHI': {
        race = '9998';
        break;
      }
    }
    let stateCode = '';
    var stateName = currentMyKadDetails.State.toUpperCase();

    if (stateName.includes('JOHOR')) {
      stateCode = '1';
    }
    if (stateName.includes('KEDAH')) {
      stateCode = '2';
    }
    if (stateName.includes('KELANTAN')) {
      stateCode = '3';
    }
    if (stateName.includes('MELAKA')) {
      stateCode = '4';
    }
    if (stateName.includes('NEGERI SEMBILAN')) {
      stateCode = '5';
    }
    if (stateName.includes('PAHANG')) {
      stateCode = '6';
    }
    if (stateName.includes('PINANG')) {
      stateCode = '7';
    }
    if (stateName.includes('PERAK')) {
      stateCode = '8';
    }
    if (stateName.includes('PERLIS')) {
      stateCode = '9';
    }
    if (stateName.includes('SELANGOR')) {
      stateCode = '10';
    }
    if (stateName.includes('TERENGGANU')) {
      stateCode = '11';
    }
    if (stateName.includes('SABAH')) {
      stateCode = '12';
    }
    if (stateName.includes('SARAWAK')) {
      stateCode = '13';
    }
    if (stateName.includes('KUALA LUMPUR') || stateName.includes('KL')) {
      stateCode = '14';
    }
    if (stateName.includes('LABUAN')) {
      stateCode = '15';
    }
    if (stateName.includes('PUTRAJAYA')) {
      stateCode = '16';
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
      case 'SIKH': {
        //SIKHISM
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
        religion = '9';
        break;
      }
      case 'TAO': {
        religion = 'A';
        break;
      }
      case 'KONFUSIANISME': {
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
        religion = '9';
        break;
      }
    }

    let cifNo = '';
    if (appFunc.resubmission == 'Y') {
      cifNo = appFunc.resubmissionNo;
    }

    const body = {
      cifNum: cifNo,
      regType: 'M',
      accNum: '',
      accType: '',
      primaryIdTypeCode: 'IN',
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
      resubmission: appFunc.resubmission,
      sessionId: appFunc.sessionId,
    };

    this._aldanService
      .MemberRegistrationAIO(body, selectLang.selectedLang)
      .subscribe(
        (result: any) => {
          if (result.body.isNewMemberRegisterSuccess) {
            if (result.body.isAddTACSuccess) this.failedTAC = false;
            if (result.body.isIAkaunRegisterSuccess) {
              this.failediAkaun = false;
              this.isiAkaunRegSuccessful = true;
            }
            appFunc.currMemberDetail = result.body.memberProfileResponse.detail;
            this.KWSPMemberNo = appFunc.currMemberDetail.accNum;
            this.KWSPCustomerNo = appFunc.currMemberDetail.cifNum;
            this.isCallAPI = false;
            this.ValidateProfilePage = false;
            this.RegisterSuccessPage = true;
          } else {
            //Failed AIO
            this.ValidateProfilePage = false;
            this.Failed = true;
            this.isAIO = true;
            this.errorDesc = result.body.error[0].description;
            // appFunc.message = "HttpError";
            // appFunc.code = "ESB Error";
            // this.route.navigate(['outofservice']);
          }
        },
        (err: HttpErrorResponse) => {
          appFunc.message = 'HttpError';
          appFunc.code = 'E' + err.status.toString() + ': ESB Error';
          this.route.navigate(['outofservice']);
        }
      );
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
    if (!this.isiAkaunRegSuccessful) {
      this.RegKWSP = false;
      this.RegShariah = true;
      if (this.isiSaraanModuleEnabled || this.isiShariahModuleEnabled) {
        this.RegisterSuccessPage = false;
        this.PickShariahPage = true;
      } else {
        this.route.navigate(['mainMenu']);
      }
    } else {
      if (this.isiAkaunRegModuleEnabled) {
        if (this.isiAkaunActModuleEnabled) {
          if (
            selectLang.selectedLang == 'bm'
              ? appFunc.iAkaunActTNCBM != undefined
              : appFunc.iAkaunActTNCEN != undefined
          ) {
            this.TnC =
              selectLang.selectedLang == 'bm'
                ? appFunc.iAkaunActTNCBM.content.toString()
                : appFunc.iAkaunActTNCEN.content.toString();
            this.content_version =
              selectLang.selectedLang == 'bm'
                ? appFunc.iAkaunActTNCBM.contentVersion
                : appFunc.iAkaunActTNCEN.contentVersion;
            this.RegisterSuccessPage = false;
            this.TnCPage = true;
            this.RegKWSP = false;
            this.RegIAkaun = true;
          } else {
            this.isCallAPI = true;
            if (appFunc.bypassAPI != true) {
              this._aldanService.GetTnC(selectLang.selectedLang).subscribe(
                (result: any) => {
                  this.isCallAPI = false;
                  if (result.body.content != '') {
                    if (selectLang.selectedLang == 'bm') {
                      appFunc.iAkaunActTNCBM = result.body;
                    } else {
                      appFunc.iAkaunActTNCEN = result.body;
                    }
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
                },
                (err: HttpErrorResponse) => {
                  this.isCallAPI = false;
                  this.RegisterSuccessPage = false;
                  this.Failed = true;
                  this.errorDesc = 'HttpError';
                }
              );
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

  RegisterSuccessNo() {
    this.route.navigate(['mainMenu']);
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
    else {
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

          this._aldanService.ActivateIAkaun(iAkaunActBody).subscribe(
            (result: any) => {
              this.isCallAPI = false;
              if (result.body.epf_no != '') {
                this.ActivateiAkaunPage = false;
                this.ActivateSuccessPage = true;

                deleteKeyboard();
              } else {
                this.errorCode = result.body.error.code;
                this.ActivateiAkaunPage = false;
                this.Failed = true;
                if (this.errorCode == '461') {
                  this.errorDesc = 'notUniqueID';
                } else {
                  this.errorDesc = 'unsuccesfuliAkaunActivation';
                }
                deleteKeyboard();
              }
            },
            (err: HttpErrorResponse) => {
              this.ActivateiAkaunPage = false;
              this.Failed = true;
              this.errorDesc = 'HttpError';
            }
          );
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
    else {
      this.emptyID = true;
    }
    if (this.password1.length != 0) FilledIn += 1;
    else {
      this.emptyPassword = true;
    }
    if (this.password2.length != 0) FilledIn += 1;
    else {
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
          this._aldanService.GetSecureImage(appFunc.sessionId).subscribe(
            (result: any) => {
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
            },
            (err: HttpErrorResponse) => {
              appFunc.message = 'HttpError';
              appFunc.code = 'E' + err.status.toString() + ': ESB Error';
              this.route.navigate(['outofservice']);
            }
          );
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
      if (
        selectLang.selectedLang == 'bm'
          ? appFunc.iShariahTNCBM != undefined
          : appFunc.iShariahTNCEN != undefined
      ) {
        this.Contract =
          selectLang.selectedLang == 'bm'
            ? appFunc.iShariahTNCBM.content
            : appFunc.iShariahTNCEN.content;
        this.PickShariahPage = false;
        this.ShariahTnCPage = true;
        this.xagreedTnc2 = true;
        this.RegShariah = true;
        setTimeout(() => {
          this.contractHTML?.nativeElement.insertAdjacentHTML(
            'afterbegin',
            this.Contract
          );
        }, 200);
      } else {
        this.isCallAPI = true;
        this._aldanService.GetContract(selectLang.selectedLang).subscribe(
          (result: any) => {
            this.isCallAPI = false;
            if (result.body.content != '') {
              if (selectLang.selectedLang == 'bm') {
                appFunc.iShariahTNCBM = result.body;
              } else {
                appFunc.iShariahTNCEN = result.body;
              }
              this.Contract = result.body.content;
              this.PickShariahPage = false;
              this.ShariahTnCPage = true;
              this.xagreedTnc2 = true;
              this.RegShariah = true;
              setTimeout(() => {
                this.contractHTML?.nativeElement.insertAdjacentHTML(
                  'afterbegin',
                  this.Contract
                );
              }, 200);
            } else {
              this.PickShariahPage = false;
              this.Failed = true;
              this.errorDesc = result.body.error[0].description;
            }
          },
          (err: HttpErrorResponse) => {
            appFunc.message = 'HttpError';
            appFunc.code = 'E' + err.status.toString() + ': ESB Error';
            this.route.navigate(['outofservice']);
          }
        );
      }
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

    this._aldanService.iShariahRegistration(iShariahBody).subscribe(
      (result: any) => {
        this.isCallAPI = false;
        if (result.body.responseCode == '0') {
          this.ShariahTnCPage = false;
          this.ShariahSuccessPage = true;
        } else {
          this.ShariahTnCPage = false;
          this.Failed = true;
          this.errorDesc = result.body.error[0].description;
        }
      },
      (err: HttpErrorResponse) => {
        appFunc.message = 'HttpError';
        appFunc.code = 'E' + err.status.toString() + ': ESB Error';
        this.route.navigate(['outofservice']);
      }
    );
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
        idType: 'IN',
        businessTypeCode: this.selectedJobSector.code,
        remark: '',
        sourceRegistrationChannel: 'SST',
        applicationReceivedDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        sourceCreationID: 'SST',
        sourceTerminalID: signalRConnection.kioskCode.substring(0, 10),
        sourceBranchNo: '0',
        sessionId: appFunc.sessionId,
      };

      this._aldanService.iSaraanRegistration(iSaraanBody).subscribe(
        (result: any) => {
          if (result.status == 200) {
            this.isCallAPI = false;
            if (result.body.responseCode == '0') {
              this.SelectJobPage = false;
              this.SaraanSuccessPage = true;
              if (result.body.detail.businessTypeCode == 'S910') {
                this.isSuri = true;
              }
            } else {
              this.SelectJobPage = false;
              this.Failed = true;
              this.errorDesc = 'unsuccessfuliSaraan';
            }
          } else {
            appFunc.message = result.message;
            appFunc.code = 'ESB Error';
            this.route.navigate(['outofservice']);
          }
        },
        (err: HttpErrorResponse) => {
          appFunc.message = 'HttpError';
          appFunc.code = 'E' + err.status.toString() + ': ESB Error';
          this.route.navigate(['outofservice']);
        }
      );
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
    if (this.phoneNo.length < 40) this.phoneNo += '1';
  }

  click2() {
    if (this.phoneNo.length < 40) this.phoneNo += '2';
  }

  click3() {
    if (this.phoneNo.length < 40) this.phoneNo += '3';
  }

  click4() {
    if (this.phoneNo.length < 40) this.phoneNo += '4';
  }

  click5() {
    if (this.phoneNo.length < 40) this.phoneNo += '5';
  }

  click6() {
    if (this.phoneNo.length < 40) this.phoneNo += '6';
  }

  click7() {
    if (this.phoneNo.length < 40) this.phoneNo += '7';
  }

  click8() {
    if (this.phoneNo.length < 40) this.phoneNo += '8';
  }

  click9() {
    if (this.phoneNo.length < 40) this.phoneNo += '9';
  }

  click0() {
    if (this.phoneNo.length < 40) this.phoneNo += '0';
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

  selectJob(jobSector: any) {
    this.defaultDDL = jobSector.code;
    this.selectedJobSector = jobSector;
  }

  failedYes() {
    if (this.errorCode == '461') {
      this.SetIdPassword = true;
      this.Failed = false;
      setTimeout(() => {
        loadKeyboard();
      }, 500);
    } else if (this.RegIAkaun) {
      this.Failed = false;
      this.RegIAkaun = false;
      this.RegShariah = true;
      this.PickShariahPage = true;
    } else if (this.RegShariah) {
      this.Failed = false;
      this.RegShariah = false;
      this.RegisteriSaraanPage = true;
      this.RegSaraan = true;
    } else if (this.isAIO) {
      this.route.navigate(['startup']);
    } else {
      this.route.navigate(['mainMenu']);
    }
  }
}
