import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { appFunc } from '../_models/_appFunc';
import { signalRConnection } from '../_models/_signalRConnection';
import { formatDate } from '@angular/common';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { eWithdrawalDetails } from '../_models/_eWithdrawalDetails';

@Component({
  selector: 'app-thumbprint-confirmation',
  templateUrl: './thumbprint-confirmation.component.html',
  styleUrls: ['./thumbprint-confirmation.component.css']
})
export class ThumbprintConfirmationComponent implements OnInit {

  ThumbprintAgreeDisagree = false;
  Selections = false;
  ThumbprintVerification = false;
  Selected = true;
  openPopup = false;
  popup = false;
  popupAnsuran = true;
  popup50Tahun = false;
  popupMissing = false;
  popupPerakuan = false;
  popupError = false;
  isCallAPI = false;
  Failed = false;
  checkedAnsuran = false;
  checkedBina = false;
  checked50yo = false;
  checked55yo = false;
  checkedEducation = false;
  checked1mil = false;

  xagreedTnc = true;
  errorDesc = '';
  applReferenceNo = '';
  withdrawalApplList: any[] = [];
  eWithdrawalDetail = appFunc.eWithdrawalDetail;
  // withdrawalApplDetails: eWithdrawalDetails[];
  schemeDescription = '';
  expiryDate = '';
  accNum = '';
  name = '';
  totalRecurringAmt = '';
  paymentMode = '';
  monthlyInstalmentAmt = '';
  bankName = '';
  bankAccNo = '';
  paymentFrequency = '';
  recurringStartDate = '';
  recurringEndDate = '';
  isRecurring = true;

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
    this.name = appFunc.currMemberDetail.custName;
  }

  checkAnsuran() {
    this.isCallAPI = true;
    const eWithdrawalDetailsBody = {
      applReferenceNo: this.withdrawalApplList[0].applReferenceNo,
      sessionId: appFunc.sessionId
    }

    this._aldanService.eWithdrawalDetails(eWithdrawalDetailsBody).subscribe((result: any) => {
      this.isCallAPI = false;
      if (result.body.responseCode == "0") {
        this.eWithdrawalDetail = result.body.detail;
        if (this.eWithdrawalDetail.recurringStartDate == '0001-01-01') {
          this.isRecurring = false;
        }
        this.openPopup = true;
        this.popupAnsuran = true;
      }
      else {
        this.Failed = true;
        this.errorDesc = result.body.error[0].description;
      }
    }, (err: HttpErrorResponse) => {
      appFunc.message = "HttpError";
      appFunc.code = "ESB Error";
      this.route.navigate(['outofservice']);
    })
  }

  checkBina() {
    this.checkedBina = !this.checkedBina;
  }

  check50yo() {
    this.checked50yo = !this.checked50yo;
  }

  checkEducation() {
    this.checkedEducation = !this.checkedEducation;
  }

  check1mil() {
    this.checked1mil = !this.checked1mil;
  }

  check55yo() {
    this.checked55yo = !this.checked55yo;
  }

  ThumbprintAgreeDisagreeYes() {
    this.isCallAPI = true;

    const eWithdrawalBody = {
      accNum: "19140510",
      sessionId: appFunc.sessionId
    }

    this._aldanService.eWithdrawalApplication(eWithdrawalBody).subscribe((result: any) => {
      this.isCallAPI = false;
      if (result.body.responseCode == "0") {
        this.withdrawalApplList = result.body.detail.withdrawalApplList;
        this.expiryDate = formatDate(this.withdrawalApplList[0].expiry_date, 'dd MMM YYYY', 'en');
        this.ThumbprintAgreeDisagree = false;
        this.Selections = true;
      }
      else {
        this.Failed = true;
        this.errorDesc = result.body.error[0].description;
      }
    }, (err: HttpErrorResponse) => {
      appFunc.message = "HttpError";
      appFunc.code = "ESB Error";
      this.route.navigate(['outofservice']);
    })
  }

  ThumbprintAgreeDisagreeNo() {
    this.route.navigate(['mainMenu']);
  }

  SelectionsNo() {
    this.Selections = false;
    this.ThumbprintAgreeDisagree = true;
  }

  SelectionsYes() {
    let x = 0;
    if (this.checkedAnsuran == false) x++;
    if (this.checkedBina == false) x++;
    if (this.checked50yo == false) x++;
    if (this.checkedEducation == false) x++;
    if (this.checked1mil == false) x++;
    if (this.checked55yo == false) x++;

    if (x > 0) this.popup = true;
    else {
      this.Selections = false;
      this.ThumbprintVerification = true;
    }
  }

  ThumbprintVerificationNo() {
    this.ThumbprintVerification = false;
    this.Selections = true;
  }

  SelectedNo() {
    this.route.navigate(['mainMenu']);
  }

  SelectedYes() {
    this.route.navigate(['mainMenu']);
  }

  popupYes() {
    this.popup = false;
    this.openPopup = false;
    this.Selections = true;
    this.checkedAnsuran = !this.checkedAnsuran;
  }

  skip() {
    this.ThumbprintVerification = false;
    this.Selected = true;
  }

  clickTNC() {
    this.xagreedTnc = !this.xagreedTnc;
  }

  popupPerakuanYes() {

  }

  popupPerakuanNo() {

  }

  verifyThumbprint() {
    this.isCallAPI = true;

    const thumbprintBody = {
      cifNum: "",
      minutiae: "",
      sessionId: appFunc.sessionId
    }

    this._aldanService.thumbprintVerify(thumbprintBody).subscribe((result: any) => {
      this.isCallAPI = false;
      if (result.body.responseCode == "0") {

      }
      else {

      }
    });
  }

  updateStatus() {
    this.isCallAPI = true;

    const statusBody = {
      applReferenceNo: "001100037001049",
      accNum: "12630395",
      schemeCode: "MTHHLNINS",
      applStatus: "A",
      cijVerificationStatus: "N",
      cijVerificationDate: "2022-04-27 12:12:21.000",
      numOfPayment: "6",
      paymentFrequencyCode: "M",
      paymentAmt: "3258.00",
      finalPaymentDifferenceAmt: "0.00",
      firstPaymentDate: "2022-03-20",
      expiryDate: "2022-08-20",
      terminalID: "SST",
      userID: "SST",
      sessionId: appFunc.sessionId
    }

    this._aldanService.eWithdrawalStatus(statusBody).subscribe((result: any) => {
      this.isCallAPI = false;
      if(result.body.responseCode == "0")
      {

      }
      else
      {
        
      }
    });
  }
}
