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
import { BoundDirectivePropertyAst } from '@angular/compiler';

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
  transactionAmtForAcc1 = 0;
  selectedYear = 0;
  
  arrYears: any[] = [];
  sDetails: any[] = [];
  cDetails: any[] = [];

  transaction = "";
  errorDesc = "";
  errorCode = "";
  email = "";
  moreRecordIndicator = "";
  paginationKey = "";
  CurrentYear = appFunc.CurrYears;
  
  

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
    else
    {
      this.isCallAPI = true;
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
          this.isCallAPI = false;
          if (result.body.responseCode == '0') {
            appFunc.summaryDetails = result.body.detail;
            appFunc.sDetails = result.body.detail.summaryStatement;
            let tempDetails = appFunc.sDetails;
            tempDetails.forEach((element: any) => {
              this.sDetails.push({
                subAccSeqNum: element.subAccSeqNum,
                openingBalance: element.openingBalance,
                subAccCreditTotal: element.subAccCreditTotal,
                subAccDebitTotal: element.subAccDebitTotal,
                subAccDividend: element.subAccDividend,
                subAccBalance: element.subAccBalance,
                subAccSeqNumDesc: this.getSeqDesc(element.subAccSeqNum, result.body.detail.accEmasFlag)
              })
            });
            this.totalSavings = result.body.detail.totalSavings;
          }
          else{
            this.SummaryStatementPage = false;
            this.errorCode = result.body.error[0].code;
            if(this.errorCode == 'MBM2015') this.errorDesc = 'noOpeningBalance';
            //else if(this.errorCode = "MBM2001") this.errorDesc = 'noRecordsFound'
            else this.errorDesc = 'cannotRetrieveAccountBalance';
            this.Failed = true;
          }
        },(err: HttpErrorResponse) => {
          appFunc.message = "HttpError";
          this.route.navigate(['outofservice']);
        });
    }
  }

  getSeqDesc(seqNum: string, accEmasFlag: string): string{
    let seqNumDesc = '';
    switch (seqNum)
    {
      case '1':
        seqNumDesc = 'Akaun 1';
        break;
      case '2':
        seqNumDesc = 'Akaun 2';
        break;
      case '6':
        seqNumDesc = 'Akaun Pemindahan Tuntutan Harta Perkahwinan';
        break;
      case '5':
        seqNumDesc = 'Akaun Pengeluaran Bayaran Berkala';
        break;
      case '9':
        seqNumDesc = 'Akaun Pengeluaran Umur 55 Tahun - Kombinasi';
        break;
      case '4':
        seqNumDesc = 'Akaun Pengeluaran Bayaran Bulanan';
        break;
      case '12':
        seqNumDesc = 'Akaun Pengeluaran Ansuran Bulanan Pinjaman Perumahan';
        break;
      case '11':
        seqNumDesc = 'Akaun Pengeluaran Perumahan Fleksibel';
        break;
      case '13':
        seqNumDesc = 'Akaun 55';
        break;
      case '14':
        seqNumDesc = 'Akaun Syer Kerajaan';
        break;
      case '0':
        seqNumDesc = 'Akaun Emas';
        break;
    }
    return seqNumDesc;
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
    this.CalculateYears();
  }

  StatementYes() {
    this.StatementPage = false;
    this.ConfirmEmailPage = true;
  }

  ConfirmEmailNo() {
    this.ConfirmEmailPage = false;
    this.StatementPage = true;
    this.cDetails = appFunc.cDetails;
    this.transactionAmtForAcc1 = appFunc.transactionAmtForAcc1;
  }

  ConfirmEmailYes() {
    this.isCallAPI = true;
    let details = appFunc.dataForEmail.detail.mainStatement;
    appFunc.dataForEmail.detail.mainStatement = this.cDetails;
    let tempDetail = appFunc.dataForEmail.detail;

    Object.assign(appFunc.dataForEmail, {
      "totalSavings": appFunc.totalSavingsForEmail,
      "summaryStatement": appFunc.sDetails,
      "memberInfo": tempDetail,
      "accEmasFlag": appFunc.summaryDetails.accEmasFlag,
      "dividendAcc55": appFunc.summaryDetails.dividendAcc55 == "" ? "0.00" : appFunc.summaryDetails.dividendAcc55,
      "dividendAcc55Line": appFunc.summaryDetails.dividendAcc55Line,
      "monthlyHseLoanIndicator": appFunc.summaryDetails.monthlyHseLoanIndicator,
      "monthlyHseLoanDividend": appFunc.summaryDetails.monthlyHseLoanDividend == "" ? "0.00" : appFunc.summaryDetails.monthlyHseLoanDividend, 
      "dividendRateForTheYear": appFunc.summaryDetails.dividendRateForTheYear == "" ? "0.000000000" : appFunc.summaryDetails.dividendRateForTheYear,
      "withdrawalStatement": appFunc.wDetails,
      "detailStatement": appFunc.oDetails,
      "oldStatement": details,
      "contributionTotal":appFunc.transactionAmtForAcc1.toString(),
      "openingBalanceTotal": appFunc.openingBalanceTotal,
      "dividendTotal" : appFunc.dividendTotal,
    });
    appFunc.dataForEmail.detail = undefined;
    appFunc.dataForEmail.memberInfo.mainStatement = appFunc.cDetails;

    this._aldanService.
      EmailForMemberStatement(
        appFunc.currMemberDetail.emailAdd, 
        selectLang.selectedLang,
        appFunc.sessionId, 
        appFunc.dataForEmail)
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
    appFunc.cDetails = [];
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

    if(this.sDetails.length == 0){
      CurrYears -= 1;
    }

    if (TotalYears >= appFunc.NumberOfYearsViewStatement)
      for (let i = 0; i < appFunc.NumberOfYearsViewStatement; i++) {
        this.arrYears[i] = CurrYears;
        CurrYears -= 1;
      }
    else if (TotalYears < appFunc.NumberOfYearsViewStatement)
      for (let i = 0; i < TotalYears; i++) {
        this.arrYears[i] = CurrYears;
        CurrYears -= 1;
      }

    return this.arrYears;
  }

  DisplaySelectedYearStatement(year: number) {
    appFunc.wDetails = [];
    appFunc.oDetails = [];
    this.cDetails = [];
    this.moreRecordIndicator = '';
    this.paginationKey = '';
    this.isCallAPI = true;
    const mainBody = {
      "accNum": appFunc.currMemberDetail.accNum,
      "accType": 'S',
      "stmtYear": year.toString(),
      "sessionId": appFunc.sessionId
    };
    // const detailBodyForContribution = {
    //   "accNum": appFunc.currMemberDetail.accNum,
    //   "accType": 'S',
    //   "stmtYear": year.toString(),
    //   "categoryCode": "C",
    //   "paginationKey": "",
    //   "moreRecordIndicator": "N",
    //   "sessionId": appFunc.sessionId
    // };
    // const detailBodyForWithdrawal = {
    //   "accNum": appFunc.currMemberDetail.accNum,
    //   "accType": 'S',
    //   "stmtYear": year.toString(),
    //   "categoryCode": "W",
    //   "paginationKey": "",
    //   "moreRecordIndicator": "N",
    //   "sessionId": appFunc.sessionId
    // };
    // const detailBodyForOthers = {
    //   "accNum": appFunc.currMemberDetail.accNum,
    //   "accType": 'S',
    //   "stmtYear": year.toString(),
    //   "categoryCode": "O",
    //   "paginationKey": "",
    //   "moreRecordIndicator": "N",
    //   "sessionId": appFunc.sessionId
    // };
    const summaryBody = {
      "accNum": appFunc.currMemberDetail.accNum,
      "accType": 'S',
      "stmtYear": year.toString(),
      "sessionId": appFunc.sessionId
    };
    // Get Selected Year Summary Statement
    this._aldanService
      .MemberSummaryStatement(summaryBody)
      .subscribe((result: any) => {
        if (result.body.responseCode == '0') {
          appFunc.totalSavingsForEmail = result.body.detail.totalSavings;
          appFunc.openingBalanceTotal = result.body.detail.openingBalanceTotal;
          appFunc.dividendTotal = result.body.detail.dividendTotal;
          appFunc.sDetails = result.body.detail.summaryStatement;
          appFunc.summaryDetails = result.body.detail;
          this.totalSavings = result.body.detail.totalSavings;
        }
      },(err: HttpErrorResponse) => {
        appFunc.message = "HttpError";
        this.route.navigate(['outofservice']);
    });

    // Get Member Statement
    this._aldanService.
    MemberStatement(mainBody).
    subscribe((result: any) => {
      if (result.body.responseCode == '0') {
        appFunc.dataForEmail = result.body;
      }
    },(err: HttpErrorResponse) => {
      appFunc.message = "HttpError";
      this.route.navigate(['outofservice']);
    });
  
    // // Get Withdrawal for Selected Year
    // this._aldanService.
    // MemberDetailStatement(detailBodyForWithdrawal).
    // subscribe((result: any) => {
    //   if(result.body.responseCode == "0"){
    //     appFunc.wDetails = result.body.detail.detailStatement;
    //     this.moreRecordIndicator = result.body.moreRecordIndicator;
    //     this.paginationKey = result.body.paginationKey;
    //     if(this.moreRecordIndicator == 'Y'){
    //       this.LoopMoreRecord(year, 'W')
    //     }
    //   }
    // },(err: HttpErrorResponse) => {
    //   appFunc.message = "HttpError";
    //   this.route.navigate(['outofservice']);
    // });
    // // Get Others for Selected Year
    // this._aldanService.
    // MemberDetailStatement(detailBodyForOthers).
    // subscribe((result: any) => {
    //   if(result.body.responseCode == "0"){
    //     appFunc.oDetails = result.body.detail.detailStatement;
    //     this.moreRecordIndicator = result.body.moreRecordIndicator;
    //     this.paginationKey = result.body.paginationKey;
    //     if(this.moreRecordIndicator == 'Y'){
    //       this.LoopMoreRecord(year, 'O')
    //     }
    //   }
    // },(err: HttpErrorResponse) => {
    //   appFunc.message = "HttpError";
    //   this.route.navigate(['outofservice']);
    // });
    
    // // Get Contribution for Selected Year
    // this._aldanService.
    // MemberDetailStatement(detailBodyForContribution).
    // subscribe((result: any) => {
    //   if(result.body.responseCode == "0"){
    //     this.cDetails = result.body.detail.detailStatement;
    //     this.moreRecordIndicator = result.body.moreRecordIndicator;
    //     this.paginationKey = result.body.paginationKey;
    //     appFunc.transactionAmtForAcc1 = Number(result.body.detail.contribTotal);
    //     this.transactionAmtForAcc1 = appFunc.transactionAmtForAcc1;
    //     if(this.moreRecordIndicator == 'Y'){
    //       this.LoopMoreRecord(year, 'C')
    //     }
    //     else{
    //       this.isCallAPI = false;
    //       appFunc.transactionAmtForAcc1 = Number(result.body.detail.contribTotal);
    //       this.transactionAmtForAcc1 = appFunc.transactionAmtForAcc1;
    //       if(selectLang.selectedLang == 'bm'){
    //         this.cDetails.forEach((contribution: any) => {
    //           Object.assign(contribution, {
    //             "contribMonthForDisplay": appFunc.translateMonthToBM(formatDate((contribution.contribMonth), 'MMM-yy', 'en'))
    //           });
    //         });
    //       }
    //       else{
    //         this.cDetails.forEach((contribution: any) => {
    //           Object.assign(contribution, {
    //             "contribMonthForDisplay": formatDate((contribution.contribMonth), 'MMM-yy', 'en')
    //           });
    //         });
    //       }
    //       appFunc.cDetails = this.cDetails;
    //       this.SelectYearPage = false;
    //       this.StatementPage = true;
    //     }
    //   }
    //   else{
    //     this.isCallAPI = false;
    //     appFunc.transactionAmtForAcc1 = Number('0.00');
    //     appFunc.cDetails = [];
    //     this.SelectYearPage = false;
    //     this.StatementPage = true;
    //   }
    // },(err: HttpErrorResponse) => {
    //   appFunc.message = "HttpError";
    //   this.route.navigate(['outofservice']);
    // });
    const allCategoryBody = {
      "accNum": appFunc.currMemberDetail.accNum,
      "accType": 'S',
      "stmtYear": year.toString(),
      "categoryCode": "",
      "paginationKey":"",
      "moreRecordIndicator":"",
      "sessionId": appFunc.sessionId

    };
    //Get All Category Detail Statement
    this._aldanService.
    MemberGetAllCategoryDetailStatement(allCategoryBody).
    subscribe((result: any) => {
      if (result.body.contributionDS.responseCode == '0')  {
        this.isCallAPI = false;
        this.cDetails =  result.body.contributionDS.detail.detailStatement;
        appFunc.transactionAmtForAcc1 = Number(result.body.contributionDS.detail.contribTotal);
        appFunc.oDetails =  result.body.othersDS.detail.detailStatement;
        appFunc.wDetails =  result.body.withdrawalDS.detail.detailStatement;
        this.cDetails.forEach((element: any) => {
          if(selectLang.selectedLang == 'bm'){
            Object.assign(element, {
              "contribMonthForDisplay": appFunc.translateMonthToBM(formatDate((element.contribMonth), 'MMM-yy', 'en'))
            });
          }
          else{
            Object.assign(element, {
              "contribMonthForDisplay": formatDate((element.contribMonth), 'MMM-yy', 'en')
            });
          }
        });
        appFunc.cDetails = this.cDetails;
        this.SelectYearPage = false;
        this.StatementPage = true;
      }
      else{
        this.isCallAPI = false;
        appFunc.transactionAmtForAcc1 = Number('0.00');
        appFunc.cDetails = [];
        this.SelectYearPage = false;
        this.StatementPage = true;
      }
    },(err: HttpErrorResponse) => {
      appFunc.message = "HttpError";
      this.route.navigate(['outofservice']);
    });

    
  }

  failedYes(){
    if(this.errorCode == 'MBM2015' || this.errorCode == 'MBM2001'){
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
    if(this.errorCode == 'MBM2015' || this.errorCode == 'MBM2001'){
      this.route.navigate(['mainMenu']);
    }
    else{
      this.SelectYearPage = false;
      this.SummaryStatementPage = true;
    }
  }

  // LoopMoreRecord(year: number, categoryCode: string){
  //   const detailBodyForAllCategory = {
  //     "accNum": appFunc.currMemberDetail.accNum,
  //     "accType": 'S',
  //     "stmtYear": year.toString(),
  //     "categoryCode": categoryCode,
  //     "paginationKey": this.paginationKey,
  //     "moreRecordIndicator": this.moreRecordIndicator,
  //     "sessionId": appFunc.sessionId
  //   };

  //   this._aldanService.
  //   MemberDetailStatement(detailBodyForAllCategory).
  //   subscribe((result: any) => {
  //     if(result.body.responseCode == "0"){
  //       if(categoryCode == 'C')
  //       {
  //         result.body.detail.detailStatement.forEach((element: any) => {
  //           if(selectLang.selectedLang == 'bm'){
  //             Object.assign(element, {
  //               "contribMonthForDisplay": appFunc.translateMonthToBM(formatDate((element.contribMonth), 'MMM-yy', 'en'))
  //             });
  //           }
  //           else{
  //             Object.assign(element, {
  //               "contribMonthForDisplay": formatDate((element.contribMonth), 'MMM-yy', 'en')
  //             });
  //           }
  //           this.cDetails.push(element)
  //         });
  //       }
  //       else if(categoryCode == 'W')
  //       {
  //         result.body.detail.detailStatement.forEach((element: any) => {
  //           appFunc.wDetails.push(element)
  //         });
  //       }
  //       else if(categoryCode == 'O')
  //       {
  //         result.body.detail.detailStatement.forEach((element: any) => {
  //           appFunc.oDetails.push(element)
  //         });
  //       }
  //       this.moreRecordIndicator = result.body.moreRecordIndicator;
  //       this.paginationKey = result.body.paginationKey;

  //       if(this.moreRecordIndicator != 'Y'){
  //         this.isCallAPI = false;
  //         appFunc.cDetails = this.cDetails;
  //         this.SelectYearPage = false;
  //         this.StatementPage = true;
  //       }
  //       else{
  //         this.LoopMoreRecord(year, categoryCode)
  //       }
  //     }
  //     else{
  //       this.isCallAPI = false;
  //       if(selectLang.selectedLang == 'bm'){
  //         this.cDetails.forEach((contribution: any) => {
  //           Object.assign(contribution, {
  //             "contribMonthForDisplay": appFunc.translateMonthToBM(formatDate((contribution.contribMonth), 'MMM-yy', 'en'))
  //           });
  //         });
  //       }
  //       else{
  //         this.cDetails.forEach((contribution: any) => {
  //           Object.assign(contribution, {
  //             "contribMonthForDisplay": formatDate((contribution.contribMonth), 'MMM-yy', 'en')
  //           });
  //         });
  //       }
  //       appFunc.cDetails = this.cDetails;
  //       this.SelectYearPage = false;
  //       this.StatementPage = true;
  //     }
  //   });
  // }
}


