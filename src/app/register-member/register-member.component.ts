import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { appFunc } from '../_models/_appFunc';
import { currentMemberDetails } from '../_models/_currentMemberDetails';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { signalRConnection } from '../_models/_signalRConnection';


declare const loadKeyboard: any;
declare const deleteKeyboard: any;
declare const closeKeyboard: any;

@Component({
  selector: 'app-register-member',
  templateUrl: './register-member.component.html',
  styleUrls: ['./register-member.component.css']
})
export class RegisterMemberComponent implements OnInit {
  
  @ViewChild('email') email : ElementRef | undefined;
  @ViewChild('emailDDL') emailDDL : ElementRef | undefined;

  @ViewChild('account_number') account_number : ElementRef | undefined;
  @ViewChild('password_1') password_1 : ElementRef | undefined;
  @ViewChild('password_2') password_2 : ElementRef | undefined;
  @ViewChild('secure_phrase') secure_phrase : ElementRef | undefined;

  RegKWSP = true;
  RegShariah = false;
  RegSaraan = false;
  RegIAkaun = false;
  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;
  page5 = false;
  page6 = false;
  page7 = false;
  page8 = false;
  page9 = false;
  page10 = false;
  page11 = false;
  page12 = false;
  page13 = false;
  page14 = false;
  Failed = false;

  xagreedTnc1 = true;
  xagreedTnc2 = true;

  checkboxImages = [
    { name: "checkbox1", id: 1, checked: false, src: "assets/images/fish.svg" },
    { name: "checkbox2", id: 2, checked: false, src: "assets/images/frog.svg" },
    { name: "checkbox3", id: 3, checked: false, src: "assets/images/snail.svg" },
    { name: "checkbox4", id: 4, checked: false, src: "assets/images/lamb.svg" },
    { name: "checkbox5", id: 5, checked: false, src: "assets/images/penguin.svg" },
  ];

  jobSectors = [
    { name: "agriculture", id: 1, malay: "Pertanian", english: "Pertanian" },
    { name: "retired", id: 2, malay: "Pekerja berpencen", english: "Pekerja berpencen" },
    { name: "business", id: 3, malay: "Perniagaan", english: "Perniagaan" },
    { name: "aquaculture", id: 4, malay: "Akuakultur/Penangkapan ikan", english: "Akuakultur/Penangkapan ikan" },
    { name: "transport", id: 5, malay: "Transportasi", english: "Transportasi" },
    { name: "sales", id: 6, malay: "Agen jualan", english: "Agen jualan" },
    { name: "artist", id: 7, malay: "Seniman/Kreatif", english: "Seniman/Kreatif" },
    { name: "housewife", id: 8, malay: "Suri rumah", english: "Suri rumah" },
    { name: "prof", id: 9, malay: "Profesional", english: "Profesional" },
    { name: "service", id: 10, malay: "Perkhidmatan", english: "Perkhidmatan" },
    { name: "gig", id: 11, malay: "Pekerjaan gig", english: "Pekerjaan gig" },
    { name: "other", id: 12, malay: "Yang lain", english: "Yang lain" },
  ]

  phoneNo = "";
  emailAddress = "";
  emailList: string[] = ["aldantechnology.com", "gmail.com", "hotmail.com", "yahoo.com"];

  name = "MUHAMMAD WAHYU NIZAM BIN OMIR";
  ic = "921130105537";
  dob: any;
  nationality = "WARGANEGARA";
  gender = "LELAKI";
  race = "MALAY";
  religion = "ISLAM";

  phoneError = false;
  emailError = false;

  KWSPMemberNo = "22131512";
  KWSPCustomerNo = "";

  acctNo = "";
  password1 = "";
  password2 = "";
  securePhrase = "";

  defaultDDL = "";
  selectedJobSector: any = undefined;
  currentLang = "bm"

  accountAlpha = false;
  passwordAlpha = false;
  accountMin = false;
  accountMax = false;
  passwordMin = false;
  passwordMax = false;
  imageSelect = false;
  securePhraseMax = false;
  passwordMatch = false;

  


  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService,
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');

    this.currentLang = selectLang.selectedLang;
    if(selectLang.selectedLang == 'bm'){
      this.defaultDDL = "Sila pilih daripada pilihan berikut";
    }else{
      this.defaultDDL = "Sila pilih daripada pilihan berikut";
    }


    let hardcode = true;
    if(hardcode){
      this.hardcodedIC();
    }

    this.name = currentMyKadDetails.Name;
    this.ic = currentMyKadDetails.ICNo;
    this.dob = currentMyKadDetails.DOB;
    this.nationality = currentMyKadDetails.Citizenship;
    this.gender = currentMyKadDetails.Gender;
    this.race = currentMyKadDetails.Race;
    this.religion = currentMyKadDetails.Religion;

    this.acctNo = this.ic;
  }

  ngAfterViewInit(){
    loadKeyboard();
  }

  hardcodedIC(){
    let harcodedic = "111111007894"
    currentMyKadDetails.Name = "John Smith";
    currentMyKadDetails.ICNo = harcodedic.toString().replace("*", "");
    currentMyKadDetails.OldICNo = "";
    currentMyKadDetails.DOB = new Date("1957-08-31");
    currentMyKadDetails.POB =  "SELANGOR";
    currentMyKadDetails.Gender = "Male";
    currentMyKadDetails.Citizenship = "WARGANEGARA";
    currentMyKadDetails.IssueDate = new Date("2020-01-01");
    currentMyKadDetails.Race = "CINA";
    currentMyKadDetails.Religion = "ISLAM";
    currentMyKadDetails.Address1 = "6 Jln 14/70A";
    currentMyKadDetails.Address2 = "";
    currentMyKadDetails.Address3 = "Sri Hartamas";
    currentMyKadDetails.PostCode = "50480";
    currentMyKadDetails.City = "Kuala Lumpur";
    currentMyKadDetails.State = "W. PERSEKUTUAN(KL)";
    currentMyKadDetails.Country = "Malaysia";
    currentMyKadDetails.Address = "";
    currentMyKadDetails.RJ = "";
    currentMyKadDetails.KT = "";
    currentMyKadDetails.GreenCardNationality = "";
    currentMyKadDetails.GreenCardExpiryDate = new Date("0000-00-00");
    currentMyKadDetails.CardVersion = "";
    currentMyKadDetails.OtherID = "";
    currentMyKadDetails.CategoryType = "W";
  }

  page1yes(){
    this.page1 = false;
    this.page2 = true;
  }

  page1no(){
    this.route.navigate(['mainMenu']);
  }

  page2yes(){
    this.phoneError = false;
    if(this.phoneNo.length < 10){
      this.phoneError = true;
    }
    else{
      this.page2 = false;
      this.page3 = true;
  
      setTimeout(() => {
        loadKeyboard();
      }, 500);
    }
  }

  page2no(){
    this.page2 = false;
    this.page1 = true;

    deleteKeyboard();
  }

  page3yes(){
    this.emailError = false;
    if(this.email?.nativeElement.value != ""){
      this.page3 = false;
      this.page4 = true;
      this.emailAddress = this.email?.nativeElement.value + "@" + this.emailDDL?.nativeElement.value;
      deleteKeyboard();
    }
    else{
      this.emailError = true;
    }
  }

  page3no(){
    this.page3 = false;
    this.page2 = true;
  }

  page4yes(){
    
    if(appFunc.bypassAPI != true){
      let residentStat = "";
      switch(currentMyKadDetails.Citizenship){
        case "WARGANEGARA":{
          residentStat = "B";
          break;
        }
        case "WARGANEGARA - AMJ":{
          residentStat = "C";
          break;
        } 
        case "PEMASTAUTIN SEMENTARA":{
          residentStat = "H";
          break;
        }
        case "PEMASTAUTIN TETAP":{
          residentStat = "M";
          break;
        }
        case "PEMASTAUTIN TETAP - AMJ":{
          residentStat = "P";
          break;
        }
        case "BELUM DITENTUKAN":{
          residentStat = "Q";
          break;
        }
        case "BUKAN WARGANEGARA":{
          residentStat = "X";
          break;
        }
        default:{
          residentStat = "9";
          break;
        }
      }
  
      let gender = "";
      switch(currentMyKadDetails.Gender){
        case "Male": {
          gender = "M";
          break;
        }
        case "Female": {
          gender = "F";
          break;
        }
      }
  
      let areaCode = "";
      switch(currentMyKadDetails.State.toUpperCase()){
        case "SABAH": {
          areaCode = "E";
          break;
        }
        case "SARAWAK": {
          areaCode = "F";
          break;
        }
        default: {
          areaCode = "D";
          break;
        }
      }
  
      let race = "";
      switch(currentMyKadDetails.Race.toUpperCase()){
        case "MELAYU": {
          gender = "0100";
          break;
        }
        case "BUGIS": {
          gender = "0101";
          break;
        }
        case "BOYAN": {
          gender = "0102";
          break;
        }
        case "BANJAR": {
          gender = "0103";
          break;
        }
        case "JAWA": {
          gender = "0104";
          break;
        }
        case "JAWI PEKAN": {
          gender = "0105";
          break;
        }
        case "MINANGKABAU": {
          gender = "0106";
          break;
        }
        case "CINA": {
          gender = "0200";
          break;
        }
        case "CANTONESE": {
          gender = "0201";
          break;
        }
        case "FOOCHOW": {
          gender = "0202";
          break;
        }
        case "HAINANANESE": {
          gender = "0203";
          break;
        }
      }
  
      let religion = "";
      switch(currentMyKadDetails.Religion.toUpperCase()){
        case "ISLAM":{
          religion = "1";
          break;
        }
        case "KRISTIAN":{
          religion = "2";
          break;
        }
        case "BUDDHA":{
          religion = "3";
          break;
        }
        case "HINDU":{
          religion = "4";
          break;
        }
        case "SIKHISM":{
          religion = "5";
          break;
        }
        case "TIADA AGAMA":{
          religion = "6";
          break;
        }
        case "LAIN UGAMA":{
          religion = "7";
          break;
        }
        case "MAKLUMAT TIADA":{
          religion = "8";
          break;
        }
        case "TAO":{
          religion = "9";
          break;
        }
        case "KONFUSIANISME":{
          religion = "A";
          break;
        }
        case "ISLAM":{
          religion = "B";
          break;
        }
        case "BAHAI":{
          religion = "C";
          break;
        }
        case "JUDAISM":{
          religion = "D";
          break;
        }
        default:{
          religion = "8";
          break;
        }
      }
  
      const body = {
        "cifNum": "",
        "regType": "M",
        "accNum": "",
        "accType": "",
        "primaryIdTypeCode": currentMyKadDetails.CategoryType,
        "primaryIdNum": currentMyKadDetails.ICNo,
        "custName": currentMyKadDetails.Name,
        "birthDate": currentMyKadDetails.DOB,
        "residentStatus": residentStat,
        "gender": gender,
        "citizenCountry": "MAL",
        "race": race,
        "religion": religion,
        "matrimAsset": "N",
        "handicapRemarks": "",
        "regChannel": "KSK",
        "regRcvdDate": "2001-01-01",
        "prefComChannel": "ML",
        "addLine1": currentMyKadDetails.Address1,
        "addLine2": currentMyKadDetails.Address2,
        "addLine3": currentMyKadDetails.Address3,
        "addLine4": "",
        "addLine5": "",
        "postalCode": currentMyKadDetails.PostCode,
        "cityStateZip": currentMyKadDetails.State,
        "stateCode": "15",
        "countryCode": "MAL",
        "addRemarks": "TEST Permanent Address Remarks",
        "addLine1A": currentMyKadDetails.Address1,
        "addLine2A": currentMyKadDetails.Address2,
        "addLine3A": currentMyKadDetails.Address3,
        "addLine4A": "",
        "addLine5A": "",
        "postalCode1": currentMyKadDetails.PostCode,
        "cityStateZip1": currentMyKadDetails.State,
        "stateCode1": "15",
        "countryCode1": "MAL",
        "addRemarks1": "TEST Correspondence Address Remarks",
        "homePhone": "",
        "officePhone": "",
        "mobilePhone": this.phoneNo,
        "faxNum": "",
        "emailAdd": this.emailAddress,
        "areaCode": areaCode,
        "creationDate": "0001-01-01",
        "creationTime": "",
        "creationUserID": "",
        "creationTerminalID": "",
        "creationBranchNo": "",
        "lastMaintDate": "0001-01-01",
        "lastMaintTime": "",
        "lastMaintUserID": "",
        "lastMaintTerminalID": "",
        "lastMaintBranchNo": ""
      }
  
      this._aldanService.MemberRegistration(body).subscribe((result: any) =>{ //Call Register Member
        if(result.responseCode == "0"){
  
          this.KWSPMemberNo = result.detail.accNum;
          this.KWSPCustomerNo = result.detail.cifNum;

          const addMobileTACBody  = {
            "custNum": this.KWSPCustomerNo,
            "tacMobilePhoneCode": "TA",
            "tacMobilePhone": this.phoneNo,
            "registrationDate": formatDate(new Date(), 'yyyy-MM-dd', 'en'),
            "registrationChannel": "SAO",
            "status": "P",
            "checkForDuplicate": "N",
            "generateRequestNum": "N",
            "requestNum": ""
          }

          this._aldanService.AddTAC(addMobileTACBody).subscribe((result: any) => { //Call Add TAC
            if(result.responseCode == "0"){
              const iAkaunbody = {
                "epfNum": this.KWSPMemberNo,
                "tacMobileNum": this.phoneNo,
                "branchCode": "",
                "migrationFlag": "",
                "clientChannel": "SST",
                "source": "",
                "subSource": "",
                "ipAddress": "",
                "validity": ""
              }
        
              this._aldanService.iAkaunRegistration(iAkaunbody).subscribe((result: any) => { //Call Register I-Akaun
                if(result.responseCode == "0"){
          
                  this.page4 = false;
                  this.page5 = true;
            
                  deleteKeyboard()
                }
                else{
                  this.Failed = true;
                }
              });
            }
            else{
              this.Failed = true;
            }
          });
        }
        else{
          this.Failed = true;
        }
      });
    }
    else{
      this.page4 = false;
      this.page5 = true;
    }
  }

  page4no(){
    this.page4 = false;
    this.page3 = true;

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  page5yes(){
    this.page5 = false;
    this.page6 = true;
  }

  clickTNC1(){
    this.xagreedTnc1 = !this.xagreedTnc1;
  }
  clickTNC2(){
    this.xagreedTnc2 = !this.xagreedTnc2;
  }

  page6yes(){
    this.page6 = false;
    this.page7 = true;

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  page6no(){
    this.page6 = false;
    this.page5 = true;
  }

  

  page7yes(){

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

    this.acctNo = this.account_number?.nativeElement.value
    this.password1 = this.password_1?.nativeElement.value
    this.password2 = this.password_2?.nativeElement.value
    this.securePhrase = this.secure_phrase?.nativeElement.value

    let FilledIn = 0;
    if (this.acctNo.length != 0) FilledIn += 1;
    if (this.password1.length != 0) FilledIn += 1;
    if (this.password2.length != 0) FilledIn += 1;
    if (this.securePhrase.length != 0) FilledIn += 1;

    if(FilledIn == 4){
      let errorCount = 0;
      //Check Alphanumeric
      if (!this.acctNo.match(/^[0-9a-z]+$/)){
        errorCount += 1;
        this.accountAlpha = true;
      } 
      if (!this.password1.match(/^[0-9a-z]+$/)){
        errorCount += 1;
        this.passwordAlpha = true;
      } 
      if (!this.password2.match(/^[0-9a-z]+$/)){
        errorCount += 1;
        this.passwordAlpha = true;
      } 
      //Check Min Length
      if (this.acctNo.length < 8){
        errorCount += 1;
        this.accountMin = true;
      } 
      if (this.password1.length < 8){
        errorCount += 1;
        this.passwordMin = true;
      } 
      if (this.password2.length < 8){
        errorCount += 1;
        this.passwordMin = true;
      } 
      //Check Max Length
      if (this.acctNo.length > 16){
        errorCount += 1;
        this.accountMax = true;
      } 
      if (this.password1.length > 20){
        errorCount += 1;
        this.passwordMax = true;
      } 
      if (this.password2.length > 20){
        errorCount += 1;
        this.passwordMax = true;
      } 
      if (this.securePhrase.length > 10 || this.securePhrase.length == 0){
        errorCount += 1;
        this.securePhraseMax = true;
      } 
      //Check Password Match
      if (this.password1 != this.password2){
        errorCount += 1;
        this.passwordMatch = true;
      } 
      //Check Selected Image
      let selectedCount = 0;
      this.checkboxImages.forEach((elem: any) => {
        if(elem.checked == true){
          selectedCount += 1;
        }
      });
      if (selectedCount == 0){
        errorCount += 1;
        this.imageSelect = true;
      } 
      
      if (errorCount == 0){
        if(appFunc.bypassAPI != true){ //Waiting for I-Akaun Activation API
          // const iAkaunbody = {
          //   "epfNum": this.KWSPMemberNo,
          //   "tacMobileNum": this.phoneNo,
          //   "branchCode": "",
          //   "migrationFlag": "",
          //   "clientChannel": "SST",
          //   "source": "",
          //   "subSource": "",
          //   "ipAddress": "",
          //   "validity": ""
          // }
    
          // this._aldanService.iAkaunRegistration(iAkaunbody).subscribe((result: any) => {
          //   if(result.responseCode == "0"){
      
          //     this.page7 = false;
          //     this.page8 = true;
        
          //     deleteKeyboard()
          //   }
          //   else{
          //     this.Failed = true;
          //   }
          // });
          this.page7 = false;
          this.page8 = true;
    
          deleteKeyboard()
        }
        else{
          this.page7 = false;
          this.page8 = true;
    
          deleteKeyboard()
        }
      }
      else{
        //If Error
      }
    }

    
  }

  page7no(){
    this.page7 = false;
    this.page6 = true;

    deleteKeyboard()
  }

  page8yes(){
    this.page8 = false;
    this.page9 = true;
  }

  selectiSaraan(){
    this.page9 = false;
    this.page12 = true;
  }

  selectShariah(){
    this.page9 = false;
    this.page10 = true;
  }

  page10yes(){

    if(appFunc.bypassAPI != true){
      const iShariahBody = {
        "custNum": this.KWSPCustomerNo,
        "accNum": this.KWSPMemberNo,
        "accType": "S",
        "electChannel": "SAO",
        "electReceivedDate": formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        "electReceivedTime": formatDate(new Date(), 'h:MM:ss', 'en'),
        "electReceivedBranch": "1",
        "electDate": "2019-10-11",
        "electBranch": "1",
        "electStatus": "A",
        "reasonCode": "",
        "akadRefNum": "",
        "docRefNum": ""
      }

      this._aldanService.iShariahRegistration(iShariahBody).subscribe((result:any) => {
        if(result.responseCode == "0"){

          

          this.page10 = false;
          this.page11 = true;

        }
        else{
          this.Failed = true;
        }
      });
    }
    else{
      this.page10 = false;
      this.page11 = true;
    }
  }

  page10no(){
    this.page10 = false;
    this.page9 = true;
  }

  page11yes(){
    this.page11 = false;
    this.page12 = true;
  }

  page12yes(){
    this.page12 = false;
    this.page13 = true;
  }

  page12no(){
    this.route.navigate(['mainMenu']);
  }

  page13yes(){

    if(this.selectedJobSector == undefined){

    }
    else{
      if(appFunc.bypassAPI != true){
        const iSaraanBody = {
          "idNum": currentMyKadDetails.ICNo,
          "idType": currentMyKadDetails.CategoryType,
          "businessTypeCode": this.selectedJobSector.id,
          "remark": "",
          "sourceRegistrationChannel": "SST",
          "applicationReceivedDate": formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          "sourceCreationID": "SST",
          "sourceTerminalID": "SST",
          "sourceBranchNo": "0"
        }
  
        this._aldanService.iSaraanRegistration(iSaraanBody).subscribe((result: any) => {
          if(result.responseCode == "0"){
  
            this.page13 = false;
            this.page14 = true;
  
          }
          else{
            this.Failed = true;
          }
        });
      }
      else{
        this.page14 = true;
        this.page13 = false;
      }
    }

    
    
  }

  page13no(){
    this.page13 = false;
    this.page12 = true;
  }

  page14yes(){
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

  clickImage(name: string){
    this.checkboxImages.forEach((elem: any) => {
      if(name == elem.name){
        elem.checked = true;
      }
      else{
        elem.checked = false;
      }
    });
  }

  selectJob(jobSector: any){
    this.defaultDDL = (this.currentLang == "bm" ? jobSector.malay : jobSector.english);
    this.selectedJobSector = jobSector;
  }

  failedYes(){
    this.route.navigate(['mainMenu']);
  }
  



}