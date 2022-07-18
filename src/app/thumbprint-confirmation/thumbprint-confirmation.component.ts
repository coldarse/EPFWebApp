import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { appFunc } from '../_models/_appFunc';
import { signalRConnection } from '../_models/_signalRConnection';
import { formatDate } from '@angular/common';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { eWithdrawalDetails, eWithdrawalLists, withdrawalApplLists} from '../_models/_eWithdrawalDetails';
import { currentMemberDetails, currMemberDetails } from '../_models/_currentMemberDetails';

@Component({
  selector: 'app-thumbprint-confirmation',
  templateUrl: './thumbprint-confirmation.component.html',
  styleUrls: ['./thumbprint-confirmation.component.css']
})
export class ThumbprintConfirmationComponent implements OnInit {

  ThumbprintAgreeDisagree = true;
  Selections = false;
  ThumbprintVerification = false;
  Selected = false;
  openPopup = false;
  popup = false;
  popupWithdrawal = false;
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
  isVerified = false
  xagreedPerakuan = true;
  xcheckedWithdrawal = true;
  errorDesc = '';
  applReferenceNo = '';
  withdrawalApplList: any[] = [];
  missingApplList: any[] = [];
  xagreedVerify = true;
  eWithdrawalDetail = appFunc.eWithdrawalDetail;
  expiryAgreement = '';
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
  myKadData: any;
  minutiae = '';
  BeforeRead = true;
  AfterRead = false;
  isDisabled = true;
  checkThumbprintMinutiaeIntervalId: any;
  RetryCountInstance = 3;
  xlastTry = true;
  thumbprintError = true;
  failedthrice = false;
  popupUnsettled = false;
  RemoveMyKad = false;
  NoticeCount = 1;

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
    this.name = appFunc.currMemberDetail.custName;
    this.withdrawalApplList = appFunc.withdrawalApplList;
  }

  openWithdrawalDetails(SelectedWithdrawal: any) {
    const eWithdrawalDetailsBody = {
      applReferenceNo: SelectedWithdrawal.applReferenceNo,
      sessionId: appFunc.sessionId
    }

    if (SelectedWithdrawal.isChecked == false) {
      if (SelectedWithdrawal.applReferenceNo != this.eWithdrawalDetail.applReferenceNo) {
        this._aldanService.eWithdrawalDetails(eWithdrawalDetailsBody).subscribe((result: any) => {
          if (result.body.responseCode == "0") {
            this.eWithdrawalDetail = result.body.detail;
            this.expiryAgreement = formatDate(SelectedWithdrawal.expiry_date, 'dd/MM/YYYY', 'en');
            if (this.eWithdrawalDetail.recurringStartDate == '0001-01-01') {
              this.isRecurring = false;
            }
            this.openPopup = true;
            this.popupWithdrawal = true;
            SelectedWithdrawal.isChecked = true;
          }
          else {
            this.Failed = true;
            this.errorDesc = result.body.error[0].description;
          }
        }, (err: HttpErrorResponse) => {
          appFunc.message = "HttpError";
          appFunc.code = "E" + err.status.toString() + ": ESB Error";
          this.route.navigate(['outofservice']);
        })
      }
      else {
        this.openPopup = true;
        this.popupWithdrawal = true;
        SelectedWithdrawal.isChecked = true;
      }
    }
    else {
      SelectedWithdrawal.isChecked = false;
    }
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

    if(this.withdrawalApplList.length == 0)
    {
      this._aldanService.eWithdrawalApplication(eWithdrawalBody).subscribe((result: any) => {
        this.isCallAPI = false;
        if (result.body.responseCode == "0") {
          this.withdrawalApplList = result.body.detail.withdrawalApplList;
          this.withdrawalApplList.forEach((element: any) => {
            Object.assign(element, {
              expiryDate: formatDate(element.expiry_date, 'dd MMM YYYY', 'en'),
              isChecked: false
            });
          });
          // const applReferenceNo = this.withdrawalApplList.map((obj) => obj.applReferenceNo)
          // this.expiryDate = formatDate(this.withdrawalApplList[0].expiry_date, 'dd MMM YYYY', 'en');
          this.ThumbprintAgreeDisagree = false;
          this.Selections = true;
        }
        else {
          this.Failed = true;
          this.errorDesc = result.body.error[0].description;
        }
      }, (err: HttpErrorResponse) => {
        appFunc.message = "HttpError";
        appFunc.code = "E" + err.status.toString() + ": ESB Error";
        this.route.navigate(['outofservice']);
      })
    }
    else
    {
      this.isCallAPI = false;
      this.ThumbprintAgreeDisagree = false;
      this.Selections = true;
    }
  }

  ThumbprintAgreeDisagreeNo() {
    this.route.navigate(['mainMenu']);
  }

  SelectionsNo() {
    // this.Selections = false;
    // this.ThumbprintAgreeDisagree = true;
    this.route.navigate(['mainMenu']);
  }

  SelectionsYes() {
    let count = 0;
    this.withdrawalApplList.forEach(element => {
      if (element.isChecked == false) {
        count += 1;
      }
    });

    if (count > 0) {
      if(this.NoticeCount == 0)
      {
        this.openPopup = true;
        this.popupPerakuan = true;
      }
      this.openPopup = true;
      this.popupMissing = true;
    }
    else {
      this.openPopup = true;
      this.popupPerakuan = true;
    }
    // let x = 0;

    // if(this.xcheckedWithdrawal == true) x++
    // if(this.checked == false) x++;
    // if (this.checkedAnsuran == false) x++;
    // if (this.checkedBina == false) x++;
    // if (this.checked50yo == false) x++;
    // if (this.checkedEducation == false) x++;
    // if (this.checked1mil == false) x++;
    // if (this.checked55yo == false) x++;

    // if (x > 0) this.popup = true;
    // else {
    //   this.Selections = false;
    //   this.ThumbprintVerification = true;
    // }

  }

  cancelMyKadVerification() {
    signalRConnection.connection.invoke('CancelThumbprint').then((data: boolean) => { });
    this.ThumbprintVerification = false;
    this.Selections = true;
  }

  SelectedNo() {
    appFunc.endSession = true;
    this.route.navigate(['verifyMyKad']);
  }

  SelectedYes() {
    this.route.navigate(['mainMenu']);
  }

  FailYes(){
    this.route.navigate(['mainMenu']);
  }

  popupWithdrawalYes() {
    this.popupWithdrawal = false;
    this.openPopup = false;
    this.Selections = true;
    this.xagreedVerify = false;
    // this.checkedAnsuran = !this.checkedAnsuran;
  }

  popupMissingYes() {
    this.popupPerakuan = true;
    this.popupMissing = false;
    this.NoticeCount -= 1
  }

  popupYes() {

  }

  skip() {
    this.ThumbprintVerification = false;
    this.Selected = true;
  }

  clickTNC() {
    this.xagreedPerakuan = !this.xagreedPerakuan;
  }

  popupPerakuanYes() {
    this.openPopup = false;
    this.popupPerakuan = false;
    this.Selections = false
    this.ThumbprintVerification = true;
    this.readMinutiae();
  }

  popupPerakuanNo() {
    this.openPopup = false;
    this.popupPerakuan = false;
    this.Selections = true;
  }

  readMinutiae() {
    // this.checkThumbprintMinutiaeIntervalId = setInterval(() => {
    signalRConnection.connection.invoke('ReadMinutiae').then((data: any) => {
      this.minutiae = data;
      if (this.minutiae != "") {
        this.BeforeRead = false;
        this.AfterRead = true;
        this.verifyMinutiae();
        clearInterval(this.checkThumbprintMinutiaeIntervalId);
      }
      else {
        this.RetryCountInstance -= 1;
        if (this.RetryCountInstance == 0) 
        {
          this.xlastTry = false;
          this.failedthrice= true;
        }
        // this.BeforeRead = true;
        // this.AfterRead = false;
        this.openPopup = true;
        this.popupError = true;
        clearInterval(this.checkThumbprintMinutiaeIntervalId);
      }
    });
    // }, 1000);
  }

  verifyMinutiae() {
    const thumbprintBody = {
      cifNum: "27001018179",//appFunc.currMemberDetail.cifNum,
      minutiae: "AAAAAAAAAAAAAAAAAAAAAC8Agn5jWv8FmFQAAAEAAAT//////////////wD//////////////////////////zywOmo8pESTPLhGZzwwTHc8pFKpPLBUfjyoWZI4LF2YAKhiogCwZ48AKGmZAMRzawA0fXoAyH5lACSItwDIiW8AtIqDACyLhgAci7IApJKUAOCUUQC8m34A2J1JAJyjmwDop2IAYKdnAAynsgCwqIMApKmTAPStUQDwrW8AlK2eAKyukwAMuHQAeLxsABi8fAAIvWwAKL2JAITApwAEwVUAnMGaAJzDngCIxHQALMaDAKjGhwD0xrcBpMeTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",//this.minutiae,
      sessionId: appFunc.sessionId
    }

    this._aldanService.thumbprintVerify(thumbprintBody).subscribe((result: any) => {
      if (result.body.responseCode == "0") {
        this.withdrawalApplList.forEach((element: any) => {
          if (element.isChecked == true) {
            this.updateStatus(this.eWithdrawalDetail);
          }
        });
      }
      else {
        this.ThumbprintVerification = false;
        this.openPopup = true;
        this.popupError = true;
      }
    }
      , (err: HttpErrorResponse) => {
        appFunc.message = "HttpError";
        appFunc.code = "E" + err.status.toString() + ": ESB Error";
        this.route.navigate(['outofservice']);
      });
  }

  updateStatus(selectedDetails: any) {
    const statusBody = {
      applReferenceNo: selectedDetails.applReferenceNo,
      accNum: selectedDetails.accNum,
      schemeCode: selectedDetails.schemeCode,
      applStatus: selectedDetails.applStatus,
      cijVerificationStatus: "Y",
      cijVerificationDate: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS', 'en'),
      numOfPayment: selectedDetails.paymentFrequency,
      paymentFrequencyCode: selectedDetails.paymentFrequencyCode,
      paymentAmt: selectedDetails.totalRecurringAmt,
      finalPaymentDifferenceAmt: selectedDetails.lastMonthDifferenceAmt,
      firstPaymentDate: selectedDetails.recurringStartDate,
      expiryDate: selectedDetails.recurringEndDate,
      terminalID: "SST",
      userID: "SST",
      sessionId: appFunc.sessionId
    }

    this._aldanService.eWithdrawalStatus(statusBody).subscribe((result: any) => {
      if (result.body.responseCode == "0") {
        this.ThumbprintVerification = false;
        this.Selected = true;
      }
      else {
        this.ThumbprintVerification = false;
        this.openPopup = true;
        this.popupError = true;
      }
    }, (err: HttpErrorResponse) => {
      appFunc.message = "HttpError";
      appFunc.code = "E" + err.status.toString() + ": ESB Error";
      this.route.navigate(['outofservice']);
    });
  }

  TryAgain() {
    this.openPopup = false;
    this.popupError = false;
    this.readMinutiae();
  }
}
