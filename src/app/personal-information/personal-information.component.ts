import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { appFunc } from '../_models/_appFunc';
import { currentMemberAddress, currMemberAddress } from '../_models/_currentMemberDetails';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { signalRConnection } from '../_models/_signalRConnection';

declare const loadKeyboard: any;
declare const deleteKeyboard: any;
declare const closeKeyboard: any;

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent implements OnInit {

  @ViewChild('address_1') address_1 : ElementRef | undefined;
  @ViewChild('address_2') address_2 : ElementRef | undefined;
  @ViewChild('address_3') address_3 : ElementRef | undefined;
  @ViewChild('post_code') post_code : ElementRef | undefined;
  @ViewChild('city_') city_ : ElementRef | undefined;
  @ViewChild('country_') country_ : ElementRef | undefined;
  @ViewChild('state_') state_ : ElementRef | undefined;
  @ViewChild('home_no') home_no : ElementRef | undefined;
  @ViewChild('office_no') office_no : ElementRef | undefined;
  @ViewChild('phone_no') phone_no : ElementRef | undefined;
  @ViewChild('email_') email_ : ElementRef | undefined;


  UpdateProfilePage = true;
  SaveProfilePage = false;
  SaveSuccessPage = false;
  Failed = false;
  emptyFields = false;
  invalidState = false;
  invalidEmail = false;
  isCallAPI = false;
  errorDesc = "";
  address1 = "";
  address2 = "";
  address3 = "";
  postcode = "";
  city = "";
  state = "";
  stateCode = "";
  country = "";
  homeNo = "";
  officeNo = "";
  phoneNo = "";
  email = "";
  spacer = " ";
  comma = ", ";
  fullAddress = "";
  slist: string = '';
  stateList: string[] = [
    'JOHOR',
    'KEDAH',
    'KELANTAN',
    'MELAKA',
    'NEGERI SEMBILAN',
    'PAHANG',
    'PULAU PINANG',
    'PERAK',
    'PERLIS',
    'SELANGOR',
    'TERENGGANU',
    'SABAH',
    'SARAWAK',
    'KUALA LUMPUR',
    'LABUAN',
    'PUTRAJAYA'
  ];

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService : AldanService
  ) {}

  ngOnInit(): void {
    this.translate.use(selectLang.selectedLang);
    this.address1 = appFunc.currMemberDetail.addresses[1].addLine1.toUpperCase();
    this.address2 = appFunc.currMemberDetail.addresses[1].addLine2.toUpperCase();
    this.address3 = appFunc.currMemberDetail.addresses[1].addLine3.toUpperCase();
    this.postcode = appFunc.currMemberDetail.addresses[1].postalCode;
    this.country = appFunc.currMemberDetail.addresses[1].countryDesc.toUpperCase();
    this.state = appFunc.currMemberDetail.addresses[1].stateDesc.toUpperCase();
    this.city = appFunc.currMemberDetail.addresses[1].cityStateZip.toUpperCase();

    this.officeNo = appFunc.currMemberDetail.officePhone;
    this.phoneNo = appFunc.currMemberDetail.mobilePhone;
    this.homeNo = appFunc.currMemberDetail.homePhone;
    this.email = appFunc.currMemberDetail.emailAdd;

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  UpdateProfileYes(){
    this.invalidEmail = false;
    this.emptyFields = false;
    this.invalidState = false;

    this.address1 = this.address_1?.nativeElement.value
    this.address2 = this.address_2?.nativeElement.value
    this.address3 = this.address_3?.nativeElement.value
    this.postcode = this.post_code?.nativeElement.value
    this.city = this.city_?.nativeElement.value
    this.country = this.country_?.nativeElement.value
    this.state = this.state_?.nativeElement.value
    this.homeNo = this.home_no?.nativeElement.value
    this.officeNo = this.office_no?.nativeElement.value
    this.phoneNo = this.phone_no?.nativeElement.value
    this.email = this.email_?.nativeElement.value

    if(this.state != ""){
      if (this.state.includes("JOHOR")) {
        this.stateCode = "01";
      }
      if (this.state.includes("KEDAH")) {
        this.stateCode = "02";
      }
      if (this.state.includes("KELANTAN")) {
        this.stateCode = "03";
      }
      if (this.state.includes("MELAKA")) {
        this.stateCode = "04";
      }
      if (this.state.includes("NEGERI SEMBILAN")) {
        this.stateCode = "05";
      }
      if (this.state.includes("PAHANG")) {
        this.stateCode = "06";
      }
      if (this.state.includes("PINANG")) {
        this.stateCode = "07";
      }
      if (this.state.includes("PERAK")) {
        this.stateCode = "08";
      }
      if (this.state.includes("PERLIS")) {
        this.stateCode = "09";
      }
      if (this.state.includes("SELANGOR")) {
        this.stateCode = "10";
      }
      if (this.state.includes("TERENGGANU")) {
        this.stateCode = "11";
      }
      if (this.state.includes("SABAH")) {
        this.stateCode = "12";
      }
      if (this.state.includes("SARAWAK")) {
        this.stateCode = "13";
      }
      if (this.state.includes("KUALA LUMPUR") || this.state.includes("KL")) {
        this.stateCode = "14";
      }
      if (this.state.includes("LABUAN")) {
        this.stateCode = "15";
      }
      if (this.state.includes("PUTRAJAYA")) {
        this.stateCode = "16";
      }
      else if(this.stateCode == "") {
        this.invalidState = true;
      }
    }

    let errorCount = 0;
    if(this.address1.length == 0){
      errorCount += 1;
    }
    // if(this.address2.length == 0){
    //   errorCount += 1;
    // }
    if(this.postcode.length == 0){
      errorCount += 1;
    }
    // if(this.city.length == 0){
    //   errorCount += 1;
    // }
    if(this.country.length == 0){
      errorCount += 1;
    }
    if(this.state.length == 0){
      errorCount += 1;
    }
    if(this.email.length != 0 && appFunc.isEmail(this.email) == false)
    {
      this.invalidEmail = true
    }
    if(errorCount == 0 && this.invalidEmail == false && this.invalidState == false){
      this.UpdateProfilePage = false;
      this.SaveProfilePage = true;

        var addressArray = [this.address1, this.address2, this.address3, this.postcode, this.city, this.country];
        var fullAddressArr = addressArray.filter(x => x!="");
        this.fullAddress = fullAddressArr.join(', ');
  
      deleteKeyboard();
    }
    else if(errorCount != 0){
      this.emptyFields = true;
    }
  }

  UpdateProfileNo(){
    deleteKeyboard();
    if (appFunc.FromCheckBalance == true)
    {
      this.route.navigate(['checkBalance']);
    }
    else
    {
      this.route.navigate(['mainMenu']);
    }
  }

  SaveProfileYes(){
    if(appFunc.bypassAPI != true){
      this.isCallAPI = true;

      const personalInformationBody = {
        "cifNum": appFunc.currMemberDetail.cifNum,
        "electAddGrpSeq": appFunc.currMemberDetail.electAddGrpSeq,
        "cifCategory": appFunc.currMemberDetail.cifCategory,
        "accNum": appFunc.currMemberDetail.accNum,
        "accType": "S",
        "homePhone": this.homeNo,
        "officePhone": this.officeNo,
        "mobilePhone": this.phoneNo,
        "faxNum": '',
        "emailAdd":this.email,
        "webPage":'',
        "contactPersonName":'',
        "contactDeptName":'',
        "jobDesignCode":'',
        "prefComChannel":'',
        "sessionId": appFunc.sessionId
      }

      const addressBody = {
        "custNum": appFunc.currMemberDetail.cifNum,
        "electAddSeqNum": appFunc.currMemberDetail.addresses[1].addSeq,
        "addType": "1",
        "addLine1": this.address1,
        "addLine2": this.address2,
        "addLine3": this.address3,
        "addLine4": '',
        "addLine5": '',
        "cityStateZip": this.city,
        "postalCode": this.postcode,
        "stateCode": this.stateCode,
        "countryCode": "MAL",
        "remark": '',
        "enforcementCOde": '',
        "employersAddressee": '',
        "sessionId": appFunc.sessionId
      }

      this._aldanService.
        UpdateFullProfile(
          personalInformationBody,
          addressBody
        ).
        subscribe((result: any) =>{
        if(result[0].body.responseCode == "0" && result[1].body.responseCode== "0"){
        
          const body = {
            "regType": "M",
            "accNum": "",
            "accType": "",
            "searchType": "I",
            "idNum": currentMyKadDetails.ICNo,
            "idType": "IN",
            "reqTypeCode": "",
            "sessionId": appFunc.sessionId
          }

          this._aldanService.
            MemberProfileInfo(body).
            subscribe((result: any) => {
              this.isCallAPI = false;
              if(result.body.responseCode == "0"){
                appFunc.currMemberDetail = result.body.detail;
                this.SaveProfilePage = false;
                this.SaveSuccessPage = true;
              }
              else{
                this.SaveProfilePage = false;
                this.Failed = true;
                this.errorDesc = result.body.error[0].description;
              }
            },(err: HttpErrorResponse) => {
              appFunc.message = "HttpError";
              appFunc.code = "E" + err.status.toString() + ": ESB Error";
              this.route.navigate(['outofservice']);
            });
        }
        else{
          this.isCallAPI = false;
          this.SaveProfilePage = false;
          this.Failed = true;
          this.errorDesc = 'unsuccessfulUpdateInfo';
        }
      },(err: HttpErrorResponse) => {
        appFunc.message = "HttpError";
        appFunc.code = "E" + err.status.toString() + ": ESB Error";
        this.route.navigate(['outofservice']);
      });
    }
    else{
      this.SaveProfilePage = false;
      this.SaveSuccessPage = true;
    } 
  }

  SaveProfileNo(){
    this.SaveProfilePage = false;
    this.UpdateProfilePage = true;

    setTimeout(() => {
      loadKeyboard();
    }, 500);
  }

  SaveSuccessYes(){
    if (appFunc.FromCheckBalance == true)
    {
      this.route.navigate(['checkBalance']);
    }
    else
    {
      this.route.navigate(['mainMenu']);
    }
  }

  reuseMykadAddress(event: any){
    if(event.target.checked){
      this.address1 = currentMyKadDetails.Address1.toUpperCase();
      this.address2 = currentMyKadDetails.Address2.toUpperCase();
      this.address3 = currentMyKadDetails.Address3.toUpperCase();
      this.postcode = currentMyKadDetails.PostCode
      this.city = currentMyKadDetails.City.toUpperCase();
      this.state = currentMyKadDetails.State.toUpperCase();
      this.country = currentMyKadDetails.Country.toUpperCase();
    }
    else{
      this.address1 = appFunc.currMemberDetail.addresses[1].addLine1.toUpperCase();
      this.address2 = appFunc.currMemberDetail.addresses[1].addLine2.toUpperCase();
      this.address3 = appFunc.currMemberDetail.addresses[1].addLine3.toUpperCase();
      this.postcode = appFunc.currMemberDetail.addresses[1].postalCode;
      this.country = appFunc.currMemberDetail.addresses[1].countryDesc.toUpperCase();
      this.state = appFunc.currMemberDetail.addresses[1].stateDesc.toUpperCase();
      this.city = appFunc.currMemberDetail.addresses[1].cityStateZip.toUpperCase();
    }
  }

  failedYes(){
    if (appFunc.FromCheckBalance == true)
    {
      this.route.navigate(['checkBalance']);
    }
    else
    {
      this.route.navigate(['mainMenu']);
    }
  }
}