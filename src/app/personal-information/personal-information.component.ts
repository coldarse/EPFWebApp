import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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

  address1 = "NO 46";
  address2 = "JALAN BP 10/1";
  address3 = "BANDAR BUKIT PUCHONG 2";
  postcode = "47170";
  city = "PUCHONG";
  state = "SELANGOR DAHRUL EHSAN";
  country = "MALAYSIA";
  homeNo = "";
  officeNo = "";
  phoneNo = "";
  email = "wahyu@aldantechnology.com";

  spacer = " ";
  comma = ", ";

  emptyFields = false;

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService : AldanService
  ) { }

  ngOnInit(): void {
    this.translate.use(selectLang.selectedLang);

    // let hardcode = true;
    // if(hardcode){
    //   this.hardcodedIC();
    // }

    console.log(appFunc.currMemberDetail);

    this.address1 = appFunc.currMemberDetail.addresses[0].addLine1;
    this.address2 = appFunc.currMemberDetail.addresses[0].addLine2;
    this.address3 = appFunc.currMemberDetail.addresses[0].addLine3;
    this.postcode = appFunc.currMemberDetail.addresses[0].postalCode;
    this.city = appFunc.currMemberDetail.addresses[0].cityStateZip;
    this.state = appFunc.currMemberDetail.addresses[0].stateDesc;
    this.country = appFunc.currMemberDetail.addresses[0].countryDesc;

    this.homeNo = appFunc.currMemberDetail.homePhone;
    this.officeNo = appFunc.currMemberDetail.officePhone;
    this.phoneNo = appFunc.currMemberDetail.mobilePhone;
    this.email = appFunc.currMemberDetail.emailAdd;

    setTimeout(() => {
      loadKeyboard();
    }, 500);
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

  UpdateProfileYes(){

    this.emptyFields = false;

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

    let errorCount = 0;
    if(this.address1.length == 0){
      errorCount += 1;
    }
    if(this.address2.length == 0){
      errorCount += 1;
    }
    if(this.address3.length == 0){
      errorCount += 1;
    }
    if(this.postcode.length == 0){
      errorCount += 1;
    }
    if(this.city.length == 0){
      errorCount += 1;
    }
    if(this.country.length == 0){
      errorCount += 1;
    }
    if(this.state.length == 0){
      errorCount += 1;
    }
    // if(this.homeNo.length == 0){
    //   errorCount += 1;
    // }
    // if(this.officeNo.length == 0){
    //   errorCount += 1;
    // }
    // if(this.phoneNo.length == 0){
    //   errorCount += 1;
    // }
    // if(this.email.length == 0){
    //   errorCount += 1;
    // }

    if(errorCount == 0){
      this.UpdateProfilePage = false;
      this.SaveProfilePage = true;
  
      deleteKeyboard();
    }
    else{
      this.emptyFields = true;
    }
  }

  UpdateProfileNo(){
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
      const personalInformationBody = {
        "cifNum": appFunc.currMemberDetail.cifNum,
        "electAddGrpSeq": appFunc.currMemberDetail.electAddGrpSeq,
        "cifCategory": appFunc.currMemberDetail.cifCategory,
        "accNum": appFunc.currMemberDetail.accNum,
        "accType": "S",
        "homePhone": this.homeNo,
        "officePhone": this.officeNo,
        "mobilePhone": this.phoneNo,
        "faxNum": "",
        "emailAdd":this.email,
        "webPage":"",
        "contactPersonName":"",
        "contactDeptName":"",
        "jobDesignCode":"",
        "prefComChannel":"",
        "sessionId": appFunc.sessionId
      }

      const addressBody = {
        "custNum": appFunc.currMemberDetail.cifNum,
        "electAddSeqNum": appFunc.currMemberDetail.electAddGrpSeq,
        "addType": appFunc.currMemberDetail.addresses[1].addSeq,
        "addLine1": this.address1,
        "addLine2": this.address2,
        "addLine3": this.address3,
        "addLine4": "",
        "addLine5": "",
        "cityStateZip": "",
        "postalCode": this.postcode,
        "stateCode": "15",
        "countryCode": "MAL",
        "remark": "",
        "enforcementCOde": "",
        "employersAddressee": "",
        "sessionId": appFunc.sessionId
      }

      this._aldanService.UpdateFullProfile(personalInformationBody,addressBody).subscribe((result: any) =>{
        if(result[0].responseCode == "0" && result[1].responseCode== "0"){

          const body = {
            "regType": "M",
            "accNum": appFunc.currMemberDetail.accNum,
            "accType": "S",
            "searchType": "A",
            "idNum": currentMyKadDetails.ICNo,
            "idType": currentMyKadDetails.CategoryType,
            "reqTypeCode": "",
            "sessionId": appFunc.sessionId
          }
          this._aldanService.MemberProfileInfo(body).subscribe((result: any) => {
            if(result.responseCode == "0"){
    
              appFunc.currMemberDetail = result.detail;
              this.SaveProfilePage = false;
              this.SaveSuccessPage = true;
            }
            else{
              this.SaveProfilePage = false;
              this.Failed = true;
            }
          });
        }
        else{
          this.SaveProfilePage = false;
          this.Failed = true;
        }
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
    this.route.navigate(['mainMenu']);
  }

  reuseMykadAddress(event: any){
    if(event.target.checked){
      this.address1 = currentMyKadDetails.Address1
      this.address2 = currentMyKadDetails.Address2
      this.address3 = currentMyKadDetails.Address3
      this.postcode = currentMyKadDetails.PostCode
      this.city = currentMyKadDetails.City
      this.state = currentMyKadDetails.State
      this.country = currentMyKadDetails.Country
    }
  }

  failedYes(){
    this.route.navigate(['mainMenu']);
  }
}