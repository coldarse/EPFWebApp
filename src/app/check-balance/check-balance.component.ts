import { CurrencyPipe, DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { appFunc } from '../_models/_appFunc';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { currMemberDetails } from '../_models/_currentMemberDetails';
import { currentMemberAddress, currMemberAddress } from '../_models/_currentMemberDetails';
import { Subscription } from 'rxjs/internal/Subscription';
import { selectLang } from '../_models/language';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-check-balance',
  templateUrl: './check-balance.component.html',
  styleUrls: ['./check-balance.component.css'],
})
export class CheckBalanceComponent implements OnInit {
  SummaryStatementPage = true;
  SelectYearPage = false;
  StatementPage = false;
  ConfirmEmailPage = false;
  UpdateEmailPage =false;
  EmailSuccessPage = false;
  EmailFailPage = false;

  totalSavings = 0;
  grandTotal = 0;
  transactionAmtForAcc1 = 0;
  selectedYear = 0;
  transaction = '';

  sDetails: any[] = [];
  cDetails: any[] = [];
  arrYears: any[] = [];

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
  Failed = false;
  errorDesc = "";
  errorCode = "";

  emptyFields = false;

  isCallAPI = false;
  dataForEmail: any;

  totalSavingsForEmail = "0.00";

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) {}

  ngOnInit(): void {

    this.email = appFunc.currMemberDetail.emailAdd;

    this.translate.use(selectLang.selectedLang);
    if (appFunc.FromCheckBalance == true) {
      appFunc.FromCheckBalance = false;
      this.ConfirmEmailPage = true
      this.SummaryStatementPage = false;
      this.SelectYearPage = false;
      this.StatementPage = false;
      this.UpdateEmailPage =false;
      this.EmailSuccessPage = false;
      this.EmailFailPage = false;
      this.Failed = false;
    }
    // this.ShowTable();

    const d = new Date();
    let stmtYear = d.getFullYear();
    const summaryBody = {
      "accNum": appFunc.currMemberDetail.accNum,
      "accType": 'S',
      "stmtYear": stmtYear.toString(),
      "sessionId": appFunc.sessionId
    };
    //call API
    this._aldanService
      .MemberSummaryStatement(summaryBody)
      .subscribe((result: any) => {
        if(result.status == 200){
          if (result.body.responseCode == '0') {
            this.sDetails = result.body.detail.summaryStatement;

            this.totalSavingsForEmail = result.body.detail.totalSavings;
  
            this.sDetails.forEach((details: any) => {
              this.grandTotal += Number(details.subAccBalance);
              this.totalSavings = this.grandTotal;
            });
          }
          else{
            this.SummaryStatementPage = false;
            this.errorCode = result.body.error[0].code;
            if(this.errorCode == 'MBM2015'){
              this.errorDesc = 'noOpeningBalance';
            }
            else{
              this.errorDesc = 'cannotRetrieveAccountBalance'
            }
            //this.errorDesc = result.body.error[0].description;
            this.Failed = true;
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

  SummaryStatementYes() {
    this.SummaryStatementPage = false;
    this.SelectYearPage = true;
    this.CalculateYears();
  }

  SummaryStatementNo() {
    this.route.navigate(['mainMenu']);
  }

  StatementNo() {
    this.transactionAmtForAcc1 = 0;
    this.StatementPage = false;
    this.SelectYearPage = true;
  }

  StatementYes() {
    this.StatementPage = false;
    this.ConfirmEmailPage = true;
  }

  ConfirmEmailNo() {
    this.ConfirmEmailPage = false;
    this.StatementPage = true;
  }

  ConfirmEmailYes() {
    this.isCallAPI = true;
    
    Object.assign(this.dataForEmail, {
      "totalSavings": this.totalSavingsForEmail,
      "summaryStatement": this.sDetails
    });

    this._aldanService.EmailForMemberStatement(appFunc.currMemberDetail.emailAdd, appFunc.sessionId, this.dataForEmail).subscribe((res: any) => {
      if(res.body.attachmentPath != ""){
        this.ConfirmEmailPage = false;
        this.EmailSuccessPage = true;
        this.isCallAPI = false;
      }
      else{
        this.isCallAPI = false;
        this.SummaryStatementPage = false;
        this.errorDesc = res.body.error[0].description;
        this.Failed = true;
      }
    },(err: HttpErrorResponse) => {
      appFunc.message = "HttpError";
      this.route.navigate(['outofservice']);
    });
    
  }

  NavProfile() {
    appFunc.FromCheckBalance = true;
    this.route.navigate(['personalInformation']);
  }

  EmailSuccessYes() {
    this.route.navigate(['mainMenu']);
  }

  EmailFailYes() {
    this.route.navigate(['mainMenu']);
  }

  selectYear(year: number) {
    this.selectedYear = year;
    this.DisplaySelectedYearStatement(year);
  }

  CalculateYears(): number[] {
    var RegDate = appFunc.currMemberDetail.epfRegDate;
    var RegYear = Number(RegDate.substring(0, 4));
    var CurrYears = new Date().getFullYear();
    var TotalYears = CurrYears - RegYear;

    if (TotalYears >= appFunc.NumberOfYearsViewStatement)
      for (let i = 0; i < appFunc.NumberOfYearsViewStatement; i++) {
        CurrYears -= 1;
        this.arrYears[i] = CurrYears;
      }
    else if (TotalYears < appFunc.NumberOfYearsViewStatement)
      for (let i = 0; i < TotalYears; i++) {
        CurrYears -= 1;
        this.arrYears[i] = CurrYears;
      }
    return this.arrYears;
  }

  DisplaySelectedYearStatement(year: number) {
    this.isCallAPI = true;
    const mainBody = {
      "accNum": appFunc.currMemberDetail.accNum,
      "accType": 'S',
      "stmtYear": year.toString(),
      "sessionId": appFunc.sessionId
    };
    this._aldanService.MemberStatement(mainBody).subscribe((result: any) => {
      if(result.status == 200){
        if (result.body.responseCode == '0') {
          this.isCallAPI = false;
          this.dataForEmail = result.body;
          this.cDetails = result.body.detail.mainStatement;
          this.cDetails.forEach((details: any) => {
            details.transaction = 'Caruman-IWS';
            const datepipe: DatePipe = new DatePipe('en-US')
            let formattedDate = datepipe.transform(details.transactionDate, 'dd/MM/YYYY')
            let formattedMonth = datepipe.transform(details.transactionDate, 'MMM-YY')
            details.transactionDate = formattedDate;
            details.contributionMth = formattedMonth;
            this.transactionAmtForAcc1 += Number(details.transactionAmtForAcc1);
            this.SelectYearPage = false;
            this.StatementPage = true;
          });
        }
        else{
          // Error
          this.isCallAPI = false;
          this.SummaryStatementPage = false;
          this.errorDesc = 'cannotRetrieveAccountBalance';
          this.Failed = true;
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
    if(this.errorCode == 'MBM2015'){
      this.CalculateYears();
      if(this.arrYears.length == 0){
        this.route.navigate(['mainMenu']);
      }
      else{
        this.Failed = false;
        this.SelectYearPage = true;
      }
    }
    else{
      this.route.navigate(['mainMenu']);
    }
  }

  BackFromSelectYearPage(){
    this.isCallAPI = false;
    if(this.errorCode == 'MBM2015'){
      this.route.navigate(['mainMenu']);
    }
    else{
      this.SelectYearPage = false;
      this.SummaryStatementPage = true;
    }
  }
}


