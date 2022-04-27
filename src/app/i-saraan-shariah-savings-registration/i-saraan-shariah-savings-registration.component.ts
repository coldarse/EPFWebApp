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
  Contract = "";
  errorDesc = "";

  defaultDDL = 'default';
  selectedJobSector: any = undefined;

  isCallAPI = false;

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
  
  }

  selectJob(jobSector: any) {
    this.defaultDDL = jobSector.code; //(this.currentLang == "bm" ? jobSector.malay : jobSector.english);
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
        .GetContract(selectLang.selectedLang, appFunc.sessionId)
        .subscribe((result: any) => {
          if(result.status == 200){
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
  }

  SelectSaraanShariahNo() {
    this.route.navigate(['mainMenu']);
  }

  ISaraanYes() {
    if (this.selectedJobSector == undefined) {
    } else {
      if (appFunc.bypassAPI != true) {
        this.isCallAPI = true;
        const iSaraanBody = {
          idNum: currentMyKadDetails.ICNo,
          idType: currentMyKadDetails.CategoryType,
          businessTypeCode: this.selectedJobSector.code,
          remark: '',
          sourceRegistrationChannel: 'IWS',
          applicationReceivedDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          sourceCreationID: 'SFIWS',
          sourceTerminalID: signalRConnection.kioskCode,
          sourceBranchNo: '0',
          sessionId: appFunc.sessionId
        };

        this._aldanService
          .iSaraanRegistration(iSaraanBody)
          .subscribe((result: any) => {
            if(result.status == 200){
              this.isCallAPI = false;
              if (result.body.responseCode == '0') {
                this.ISaraan = false;
                this.ISaraanSuccess = true;
                if(result.body.detail.businessTypeCode == "S910"){
                  this.isSuri = true;
                }
              } else {
                this.ISaraan = false;
                this.Failed = true;
                this.errorDesc = 'unsuccessfuliSaraan';
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
      } else {
        this.ISaraan = false;
        this.ISaraanSuccess = true;
      }
    }
  }

  ISaraanNo() {
    this.RegSaraanShariah = true;
    this.RegSaraan = false;
    this.ISaraan = false;
    this.SelectIShariahISaraan = true;
  }

  IShariahYes() {
    if (appFunc.bypassAPI != true) {
      this.isCallAPI = true;
      const iShariahBody = {
        custNum: appFunc.currMemberDetail.cifNum, //this.KWSPCustomerNo,
        accNum: appFunc.currMemberDetail.accNum, //this.KWSPMemberNo,
        accType: 'S',
        electChannel: 'SST',
        electReceivedDate: '2019-10-11',//formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        electReceivedTime: formatDate(new Date(), 'hh.mm.ss', 'en'),
        electReceivedBranch: '1',
        electDate: '2019-10-11',
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
          if(result.status == 200){
            this.isCallAPI = false;
            if (result.body.responseCode == '0') {
              this.IShariah = false;
              this.IShariahSuccess = true;
            } else {
              this.IShariah = false;
              this.Failed = true;
              this.errorDesc = result.body.error[0].description;
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
    } else {
      this.IShariah = false;
      this.IShariahSuccess = true;
    }
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
