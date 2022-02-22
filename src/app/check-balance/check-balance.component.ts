import { CurrencyPipe, DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { appFunc } from '../_models/_appFunc';
import { currMemberDetails } from '../_models/_currentMemberDetails';

@Component({
  selector: 'app-check-balance',
  templateUrl: './check-balance.component.html',
  styleUrls: ['./check-balance.component.css'],
})
export class CheckBalanceComponent implements OnInit {
  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;
  page5 = false;
  page6 = false;

  totalSavings = 520000.3;
  grandTotal = 0;
  transactionAmtForAcc1 = 0;
  selectedYear = 0;
  transaction = '';

  // currentContributions = 17280.0;

  sDetails: any[] = [];
  cDetails: any[] = [];
  arrYears: any[] = [];

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) {}

  ngOnInit(): void {
    this.translate.use('bm');
    // this.ShowTable();

    const summaryBody = {
      // "accNum": appFunc.currMemberDetail.accNum,
      accNum: '17438856',
      accType: 'S',
      // "stmtYear": new Date().getFullYear
      stmtYear: '2021',
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
      });
  }

  page1yes() {
    this.page1 = false;
    this.page2 = true;
    this.CalculateYears();
  }

  page1no() {
    this.route.navigate(['mainMenu']);
  }

  select2018() {
    this.page2 = false;
    this.page3 = true;
  }
  select2019() {
    this.page2 = false;
    this.page3 = true;
  }
  select2020() {
    this.page2 = false;
    this.page3 = true;
  }
  select2021() {
    this.page2 = false;
    this.page3 = true;
  }

  selectYear(year: number) {
    this.selectedYear = year;
    this.page2 = false;
    this.page3 = true;
    this.DisplaySelectedYearStatement(year);
  }

  page3no() {
    this.page3 = false;
    this.page2 = true;
  }

  page3yes() {
    this.page3 = false;
    this.page4 = true;
  }

  page4no() {
    this.page4 = false;
    this.page3 = true;
  }

  page4yes() {
    this.page4 = false;
    this.page5 = true;
  }

  page5yes() {
    this.route.navigate(['mainMenu']);
  }

  page6yes() {
    this.route.navigate(['mainMenu']);
  }

  CalculateYears(): number[] {
    // var RegDate = appFunc.currMemberDetail.epfRegDate
    var RegDate = '2021-07-01';
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
      accNum: '17438856',
      accType: 'S',
      // "stmtYear": new Date().getFullYear
      stmtYear: this.selectedYear.toString(),
    };

    this._aldanService.MemberStatement(mainBody).subscribe((result: any) => {
      if (result.responseCode == '0') {
        this.cDetails = result.detail.mainStatement;
        this.cDetails.forEach((details: any) => {
          // this.transactionAmtForAcc1 += details.totalAmount;
          details.transaction = 'Caruman-IWS';
          this.transactionAmtForAcc1 = details.transactionAmtForAcc1;
        });
      }
    });

  
  }
}
function FormatTransactionDate() {
  throw new Error('Function not implemented.');
}

