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

  emptyFields = false;

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) {}

  ngOnInit(): void {

    this.translate.use(selectLang.selectedLang);
    if (appFunc.FromCheckBalance == true) {
      this.ConfirmEmailPage = true
      this.SummaryStatementPage = true;
      this.SelectYearPage = false;
      this.StatementPage = false;
      this.UpdateEmailPage =false;
      this.EmailSuccessPage = false;
      this.EmailFailPage = false;
      
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
        if (result.responseCode == '0') {
          this.sDetails = result.detail.summaryStatement;

          this.sDetails.forEach((details: any) => {
            this.grandTotal += Number(details.subAccBalance);
            this.totalSavings = this.grandTotal;
          });
        }
        else{
          // Error
          this.SummaryStatementPage = false;
          this.errorDesc = result.error[0].description;
          this.Failed = true;
        }
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
    this.ConfirmEmailPage = false;
    this.EmailSuccessPage = true;
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
    this.SelectYearPage = false;
    this.StatementPage = true;
    this.DisplaySelectedYearStatement(year);
  }

  CalculateYears(): number[] {
    // var RegDate = appFunc.currMemberDetail.epfRegDate
    var RegDate = appFunc.currMemberDetail.epfRegDate;
    var RegYear = Number(RegDate.substring(0, 4));
    var CurrYears = new Date().getFullYear();
    var TotalYears = CurrYears - RegYear;

    if (TotalYears > 4)
      for (let i = 0; i < 4; i++) {
        CurrYears -= 1;
        this.arrYears[i] = CurrYears;
      }
    else if (TotalYears < 4)
      for (let i = 0; i < TotalYears; i++) {
        CurrYears -= 1;
        this.arrYears[i] = CurrYears;
      }
    return this.arrYears;
  }

  DisplaySelectedYearStatement(year: number) {
    const mainBody = {
      // "accNum": appFunc.currMemberDetail.accNum,
      // "stmtYear": new Date().getFullYear
      "accNum": appFunc.currMemberDetail.accNum,
      "accType": 'S',
      "stmtYear": year.toString(),
      "sessionId": appFunc.sessionId
    };

    this._aldanService.MemberStatement(mainBody).subscribe((result: any) => {
      if (result.responseCode == '0') {
        this.cDetails = result.detail.mainStatement;
        this.cDetails.forEach((details: any) => {
          // this.transactionAmtForAcc1 += details.totalAmount;
          details.transaction = 'Caruman-IWS';
          const datepipe: DatePipe = new DatePipe('en-US')
          let formattedDate = datepipe.transform(details.transactionDate, 'dd/MM/YYYY')
          let formattedMonth = datepipe.transform(details.transactionDate, 'MMM-YY')
          details.transactionDate = formattedDate;
          details.contributionMth = formattedMonth;
          this.transactionAmtForAcc1 += details.transactionAmtForAcc1;
        });
      }
      else{
        // Error
        this.SummaryStatementPage = false;
        this.errorDesc = result.error[0].description;
        this.Failed = true;
      }
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
    this.route.navigate(['mainMenu'])
  }
}


