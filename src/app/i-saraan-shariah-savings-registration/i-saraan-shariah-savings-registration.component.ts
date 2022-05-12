import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { businessTypes } from '../_models/modelClass';
import { appFunc } from '../_models/_appFunc';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { signalRConnection } from '../_models/_signalRConnection';

@Component({
  selector: 'app-i-saraan-shariah-savings-registration',
  templateUrl: './i-saraan-shariah-savings-registration.component.html',
  styleUrls: ['./i-saraan-shariah-savings-registration.component.css'],
})
export class ISaraanShariahSavingsRegistrationComponent implements OnInit {

  @ViewChild('contract') contractHTML : ElementRef | undefined;
  
  RegSaraanShariah = true;
  RegShariah = false;
  RegSaraan = false;
  SelectIShariahISaraan = true;
  ISaraan = false;
  ISaraanSuccess = false;
  IShariah = false;
  IShariahSuccess = false;
  Failed = false;
  isSuri = false;
  iSaraanEnabled = false;
  iShariahEnabled = false;
  xagreedTnc = true;
  isCallAPI = false;

  Contract = '';
  errorDesc = '';
  defaultDDL = 'default';

  selectedJobSector: any;

  jobSectors: businessTypes[] = [];

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) {}

  ngOnInit(): void {
    this.translate.use(selectLang.selectedLang);
    this.jobSectors = appFunc.businessTypes;

    for (var val of appFunc.modules){
      if(val.moduleID == 5){
        if(val.enabled == true){
          if(appFunc.isInBetween(new Date("0001-01-01T" + val.operationStart + ":00"), new Date("0001-01-01T" + val.operationEnd + ":00"), new Date("0001-01-01T" + appFunc.getCurrentTime()))){
            this.iSaraanEnabled = true;
          }
        }
      }
      else if(val.moduleID == 6){
        if(val.enabled == true){
          if(appFunc.isInBetween(new Date("0001-01-01T" + val.operationStart + ":00"), new Date("0001-01-01T" + val.operationEnd + ":00"), new Date("0001-01-01T" + appFunc.getCurrentTime()))){
            this.iShariahEnabled = true;
          }
        }
      }
    }

    if(appFunc.currMemberDetail.indicator4 == "Y")
    {
      this.iSaraanEnabled = false;
    }
    else
    {
      this.iSaraanEnabled = true;
    }

    if(appFunc.currMemberDetail.effectiveDate != "")
    {
      this.iShariahEnabled = false;
    }
    else
    {
      this.iShariahEnabled = true;
    }
  
  }

  selectJob(jobSector: any) {
    this.defaultDDL = jobSector.code;
    this.selectedJobSector = jobSector;
  }

  clickTNC() {
    this.xagreedTnc = !this.xagreedTnc;
  }

  clickSaraan() {
    this.RegSaraanShariah = false;
    this.RegSaraan = true;
    this.SelectIShariahISaraan = false;
    this.ISaraan = true;
  }

  clickShariah() {
    if (appFunc.bypassAPI != true) {
      this.isCallAPI = true;
      this._aldanService
        .GetContract(
          selectLang.selectedLang, 
          appFunc.sessionId
        )
        .subscribe((result: any) => {
          this.isCallAPI = false;
          if (result.body.content != '') {
            this.xagreedTnc = true;
            this.Contract = result.body.content;
            this.RegSaraanShariah = false;
            this.RegShariah = true; 
            this.SelectIShariahISaraan = false;
            this.IShariah = true;
            setTimeout(() => {
              this.contractHTML?.nativeElement.insertAdjacentHTML('afterbegin', this.Contract);
            }, 200)
          } else {
            this.RegSaraanShariah = false;
            this.Failed = true;
            this.errorDesc = 'unsuccesfulSimpananShariah';
          }
        },(err: HttpErrorResponse) => {
          appFunc.message = "HttpError";
          this.route.navigate(['outofservice']);
        });
    }
  }

  SelectSaraanShariahNo() {
    this.route.navigate(['mainMenu']);
  }

  ISaraanYes() {
    if (this.selectedJobSector != undefined) {
      this.isCallAPI = true;
      const iSaraanBody = {
        idNum: currentMyKadDetails.ICNo,
        idType: currentMyKadDetails.CategoryType,
        businessTypeCode: this.selectedJobSector.code,
        remark: '',
        sourceRegistrationChannel: 'IWS',
        applicationReceivedDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        sourceCreationID: 'SFIWS',
        sourceTerminalID: signalRConnection.kioskCode.substring(0,10),
        sourceBranchNo: '0',
        sessionId: appFunc.sessionId
      };

      this._aldanService
        .iSaraanRegistration(iSaraanBody)
        .subscribe((result: any) => {
          this.isCallAPI = false;
          if (result.body.responseCode == '0') {
            this.ISaraan = false;
            this.ISaraanSuccess = true;
            if(result.body.detail.businessTypeCode == "S910"){
              this.isSuri = true;
            }
          } else {
            if(result.body.error[0].code == 'MBM5223'){
              this.errorDesc = 'unsuccessfuliSaraanMoreThan60';
            }
            else{
              this.errorDesc = 'unsuccessfuliSaraan';
            }
            this.ISaraan = false;
            this.Failed = true;
          }
        },(err: HttpErrorResponse) => {
          appFunc.message = "HttpError";
          this.route.navigate(['outofservice']);
        });
    }
  }

  ISaraanNo() {
    this.RegSaraanShariah = true;
    this.RegSaraan = false;
    this.ISaraan = false;
    this.SelectIShariahISaraan = true;
  }

  IShariahYes() {
    this.isCallAPI = true;
    const iShariahBody = {
      custNum: appFunc.currMemberDetail.cifNum, 
      accNum: appFunc.currMemberDetail.accNum, 
      accType: 'S',
      electChannel: 'SST',
      electReceivedDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      electReceivedTime: formatDate(new Date(), 'hh.mm.ss', 'en'),
      electReceivedBranch: '1',
      electDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      electBranch: '1',
      electStatus: 'A',
      reasonCode: '',
      akadRefNum: '',
      docRefNum: '',
      sessionId: appFunc.sessionId
    };

    this._aldanService
      .iShariahRegistration(iShariahBody)
      .subscribe((result: any) => {
          this.isCallAPI = false;
          if (result.body.responseCode == '0') {
            this.IShariah = false;
            this.IShariahSuccess = true;
          } else {
            this.IShariah = false;
            this.Failed = true;
            this.errorDesc = 'unsuccesfulSimpananShariah';
          }
      },(err: HttpErrorResponse) => {
        appFunc.message = "HttpError";
        this.route.navigate(['outofservice']);
      });
  }

  IShariahNo() {
    this.RegSaraanShariah = true;
    this.RegShariah = false;
    this.IShariah = false;
    this.SelectIShariahISaraan = true;
  }

  ISaraanSuccessYes() {
    this.route.navigate(['mainMenu']);
  }

  IShariahSuccessYes() {
    this.route.navigate(['mainMenu']);
  }

  failedYes() {
    this.route.navigate(['mainMenu']);
  }
}

