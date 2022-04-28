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
  emptyFields = false;
  isCallAPI = false;
  Failed = false;

  totalSavings = 0;
  grandTotal = 0;
  transactionAmtForAcc1 = 0;
  selectedYear = 0;
  
  sDetails: any[] = [];
  cDetails: any[] = [];
  arrYears: any[] = [];

  totalSavingsForEmail = "0.00";
  transaction = "";
  errorDesc = "";
  errorCode = "";
  email = "";
  
  dataForEmail: any;

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) {}

  ngOnInit(): void {

    this.translate.use(selectLang.selectedLang);
    this.email = appFunc.currMemberDetail.emailAdd;

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

    const d = new Date();
    let stmtYear = d.getFullYear();
    const summaryBody = {
      "accNum": appFunc.currMemberDetail.accNum,
      "accType": 'S',
      "stmtYear": stmtYear.toString(),
      "sessionId": appFunc.sessionId
    };

    //Call Memeber Summary Statement API
    this._aldanService
      .MemberSummaryStatement(summaryBody)
      .subscribe((result: any) => {
        if (result.body.responseCode == '0') {
          this.totalSavingsForEmail = result.body.detail.totalSavings;
          this.sDetails = result.body.detail.summaryStatement;
          this.sDetails.forEach((details: any) => {
            this.grandTotal += Number(details.subAccBalance);
            this.totalSavings = this.grandTotal;
          });
        }
        else{
          this.SummaryStatementPage = false;
          this.errorCode = result.body.error[0].code;
          if(this.errorCode == 'MBM2015') this.errorDesc = 'noOpeningBalance';
          else this.errorDesc = 'cannotRetrieveAccountBalance';
          this.Failed = true;
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
    let tempDetail = this.dataForEmail.detail;

    Object.assign(this.dataForEmail, {
      "totalSavings": this.totalSavingsForEmail,
      "summaryStatement": this.sDetails,
      "memberInfo": tempDetail
    });
    this.dataForEmail.detail = undefined;

    this._aldanService.
      EmailForMemberStatement(
        appFunc.currMemberDetail.emailAdd, 
        appFunc.sessionId, 
        this.dataForEmail)
        .subscribe((res: any) => {
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
    let RegDate = appFunc.currMemberDetail.epfRegDate;
    let RegYear = Number(RegDate.substring(0, 4));
    let CurrYears = new Date().getFullYear();
    let TotalYears = CurrYears - RegYear;

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
    this._aldanService.
    MemberStatement(mainBody).
    subscribe((result: any) => {
      if (result.body.responseCode == '0') {
        this.isCallAPI = false;
        this.dataForEmail = result.body;
        this.cDetails = result.body.detail.mainStatement;
        this.cDetails.forEach((details: any) => {
          details.transaction = 'Caruman-IWS';
          let strin = details.transactionDate;
          let splitted = strin.split("/", 3);
          let newDateString = splitted[2] + "-" + splitted[1] + "-" + splitted[0];  
          let formattedDate = formatDate(new Date(newDateString), 'dd/MM/YYYY', 'en');
          let formattedMonth = formatDate(new Date(newDateString), 'MMM-YY', 'en');
          details.transactionDate = formattedDate;
          details.contributionMth = formattedMonth;
          this.transactionAmtForAcc1 += Number(details.transactionAmtForAcc1);
          this.SelectYearPage = false;
          this.StatementPage = true;
        });
      }
      else{
        this.isCallAPI = false;
        this.SummaryStatementPage = false;
        this.errorDesc = 'cannotRetrieveAccountBalance';
        this.Failed = true;
      }
    },(err: HttpErrorResponse) => {
      appFunc.message = "HttpError";
      this.route.navigate(['outofservice']);
    });
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


