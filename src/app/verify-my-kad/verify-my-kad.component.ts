import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { accessToken } from '../_models/token';
import { signalRConnection } from '../_models/_signalRConnection';
import { AppConfiguration } from '../config/app-configuration';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { appFunc } from '../_models/_appFunc';
import { businessTypes, eModules } from '../_models/modelClass';


declare const loadKeyboard: any;
declare const deleteKeyboard: any;
declare const closeKeyboard: any;

@Component({
  selector: 'app-verify-my-kad',
  templateUrl: './verify-my-kad.component.html',
  styleUrls: ['./verify-my-kad.component.css']
})
export class VerifyMyKadComponent implements OnInit {

  insertCard = true;
  Language = false;
  Thumbprint = false;
  removeCard = false;
  InsertMyKad = true;
  SelectLanguage = false;
  ReadThumbprint = false;
  RemoveMyKad = false;
  BeforeRead = true;
  AfterRead = false;
  insertedMyKad = false;
  ErrorPop = false;
  xlastTry = true;
  isOutOfService = false;

  arrayList: string[] = [];

  readerIntervalId: any;
  moduleIntervelId: any;
  checkThumbprintStatusIntervalId: any;
  myKadData: any;

  RetryCountInstance = 0;
  format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  thumbprintError = true;
  
  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService,
    private appConfig: AppConfiguration
  ) {
  }

  ngOnInit(): void {
    this.RetryCountInstance = 3;
    this.translate.use('bm');
    if (appFunc.endSession){
      this.translate.use(selectLang.selectedLang);
      this.insertCard = false;
      this.InsertMyKad = false;
      this.removeCard = true;
      this.RemoveMyKad = true;
      this.insertedMyKad = true;
      if(!appFunc.isInfoPopUp){
        this._aldanService.EndSession(appFunc.sessionId, {KioskId: signalRConnection.kioskCode}).subscribe((result: any) => {
        });
      }
      else{
        appFunc.isInfoPopUp = false;
      }
      
    }
    else{
      if (accessToken.httpOptions != undefined){
        this._aldanService.GetBusinessTypes().subscribe((res: any) => {
          appFunc.businessTypes = res.body.map((bt: any) => new businessTypes(bt));
        }, (err: HttpErrorResponse) => {
          appFunc.message = 'HttpError';
          this.route.navigate(['outofservice']);
        });

        this._aldanService.GetClientSettings().subscribe((res: any) => {
          
          appFunc.thumbprintRetry = Number(res[0].body.value);
          appFunc.iAkaunActivationPerDay = Number(res[1].body.value);
          appFunc.minCharForPassword = Number(res[2].body.value);
          appFunc.updateTACPerMonth = Number(res[3].body.value);
          appFunc.NumberOfYearsViewStatement = Number(res[4].body.value);
          let range = res[5].body.value.split(',');
          appFunc.AgeRangeLow = Number(range[0]);
          appFunc.AgeRangeHigh = Number(range[1]);
          this.RetryCountInstance = appFunc.thumbprintRetry;

        }, (err: HttpErrorResponse) => {
          appFunc.message = 'HttpError';
          this.route.navigate(['outofservice']);
        });

        this._aldanService.GetServiceOperation(signalRConnection.kioskCode).subscribe((res: any) => {
          appFunc.modules = res.body.map((em: any) => new eModules(em));

          if (appFunc.modules.length != 0){
            const areDisabled = appFunc.checkNoOfDisabledModules(appFunc.modules);
            if (areDisabled == appFunc.modules.length){
              appFunc.message = 'Under Maintenance';
              this.isOutOfService = true;
              this.route.navigate(['outofservice']);
            }

            setTimeout(() => {
              this.moduleIntervelId = setInterval(() => {
                const count = appFunc.checkModuleAvailability(appFunc.modules);
                if (count == 0){
                  appFunc.message = 'Under Maintenance';
                  this.isOutOfService = true;
                  this.route.navigate(['outofservice']);
                }
              }, 1000);
            } , 60000);

          }
          else{
            appFunc.message = 'Under Maintenance';
            this.route.navigate(['outofservice']);
          }
        }, (err: HttpErrorResponse) => {
          appFunc.message = 'HttpError';
          this.route.navigate(['outofservice']);
        });
      }
    }

    
    this.readerIntervalId = setInterval(() => {
      appFunc.DetectMyKad();
      if (signalRConnection.isCardInserted) {
        if (this.insertedMyKad == false){
          if (!appFunc.endSession){
            this.ErrorPop = true;
            this.thumbprintError = false;
            this.insertedMyKad = true;
          }
        }
      }
      else{
        if (this.insertedMyKad == true){
          appFunc.endSession = false;
          this.insertedMyKad = false;
          if(!this.isOutOfService) this.useMainPage();
        }
      }
    }, 1000);
  }

  disagreeProceed(){
    this.ErrorPop = false;
    this.thumbprintError = true;
    appFunc.isInfoPopUp = true;

    appFunc.endSession = true;
    this.ngOnDestroy();
    this.ngOnInit();
  }

  agreeProceed(){
    this.ErrorPop = false;
    this.thumbprintError = true;

    appFunc.Reset();
    this.insertCard = false;
    this.InsertMyKad = false;
    this.Language = true;
    this.SelectLanguage = true;
    let password = signalRConnection.adapter[0].adapterNameEncrypted;

    if (!this.format.test(password)) {
      password = password.concat('=');
    }

    this._aldanService.
    getToken(signalRConnection.kioskCode, password).
    subscribe((result: any) => {
      //Not Number
      accessToken.token = result.access_token;
      accessToken.httpOptions = {
        headers: new HttpHeaders(
          { Authorization: 'Bearer ' + accessToken.token }
        ),
        observe: 'response' as 'body'
      };
    },(err: HttpErrorResponse) => {
      appFunc.message = 'HttpError';
      this.route.navigate(['outofservice']);
    });
  }


  useMainPage(){
    this.route.navigate(['startup']);
  }

  verifyThumbprint(){
    if (this.RetryCountInstance != 0){
      signalRConnection.connection.invoke('VerifyThumbprint').then((isVerifySuccess: any) => {});
      this.checkThumbprintStatus();
    }
  }

  readMyKad(){
    signalRConnection.connection.invoke('ReadMyKad').then((data: any) => {
      this.myKadData = data;
      this.verifyThumbprint();
    });
  }

  selectBM(){
    selectLang.selectedLang = 'bm';
    this.translate.use(selectLang.selectedLang);

    this.Language = false;
    this.SelectLanguage = false;
    this.Thumbprint = true;
    this.ReadThumbprint = true;
    this.readMyKad();
  }

  selectEN(){
    selectLang.selectedLang = 'en';
    this.translate.use(selectLang.selectedLang);

    this.Language = false;
    this.SelectLanguage = false;
    this.Thumbprint = true;
    this.ReadThumbprint = true;
    this.readMyKad();
  }

  ngOnDestroy(): void {
    clearInterval(this.readerIntervalId);
    clearInterval(this.moduleIntervelId);
  }

  bindMyKadData(data: any): void{
    const age = appFunc.calculateAge(new Date(data.DOB));

    if (age >= appFunc.AgeRangeLow && age <= appFunc.AgeRangeHigh){
      currentMyKadDetails.Name = data.GMPCName;
      currentMyKadDetails.ICNo = data.ICNo.toString().replace('*', '');
      currentMyKadDetails.OldICNo = data.OldICNo;
      currentMyKadDetails.DOB = data.DOB;
      currentMyKadDetails.DOBString = data.DOBString;
      currentMyKadDetails.POB =  data.POB;
      currentMyKadDetails.Gender = data.Gender;
      currentMyKadDetails.Citizenship = data.Citizenship;
      currentMyKadDetails.IssueDate = data.IssueDate;
      currentMyKadDetails.Race = data.Race;
      currentMyKadDetails.Religion = data.Religion;
      currentMyKadDetails.Address1 = data.Address1;
      currentMyKadDetails.Address2 = data.Address2;
      currentMyKadDetails.Address3 = data.Address3;
      currentMyKadDetails.PostCode = data.PostCode;
      currentMyKadDetails.City = data.City;
      currentMyKadDetails.State = data.State;
      currentMyKadDetails.Country = data.Country;
      currentMyKadDetails.Address = data.Address;
      currentMyKadDetails.Address1 = data.Address1;
      currentMyKadDetails.Address2 = data.Address2;
      currentMyKadDetails.Address3 = data.Address3;
      currentMyKadDetails.RJ = data.RJ;
      currentMyKadDetails.KT = data.KT;
      currentMyKadDetails.GreenCardNationality = data.GreenCardNationality;
      currentMyKadDetails.GreenCardExpiryDate = data.GreenCardExpiryDate;
      currentMyKadDetails.CardVersion = data.CardVersion;
      currentMyKadDetails.OtherID = data.OtherID;
      currentMyKadDetails.CategoryType = data.CategoryType;
      currentMyKadDetails.EncryptedICNumber = data.EncryptedICNumber;

      const sessionBody = {
        kioskId: signalRConnection.kioskCode,
        client: currentMyKadDetails.Name,
        identification: currentMyKadDetails.ICNo
      }

      this._aldanService.CreateSession(sessionBody).subscribe((result: any) => {
        if (result.body.id != undefined){
          appFunc.sessionId = result.body.id;
          this.getAccountInquiry();
        }
        else{
          appFunc.message = result.body.error.message;
          this.route.navigate(['outofservice']);
        }
      }, (err: HttpErrorResponse) => {
        appFunc.message = 'HttpError';
        this.route.navigate(['outofservice']);
      });
    }
    else{
      appFunc.message = 'notInAgeRange';
      this.route.navigate(['outofservice']);
    }
  }

  getAccountInquiry(): void{
    let catType = '';

    switch (currentMyKadDetails.CategoryType){
      case 'W':
        catType = 'IN'
        currentMyKadDetails.CategoryType = catType;
        break;
    }

    const body = {
      regType: 'M',
      accNum: '',
      accType: '',
      searchType: 'I',
      idNum: currentMyKadDetails.EncryptedICNumber,
      idType: catType,
      reqTypeCode: '',
      sessionId: appFunc.sessionId
    }
    this._aldanService.
    MemberCIFDetailsCheck(body).
    subscribe((result: any) => {
      if (result.body.responseCode == '0'){
        const memberProfileBody = {
          regType: 'M',
          accNum: '',
          accType: '',
          searchType: 'I',
          idNum: currentMyKadDetails.ICNo,
          idType: catType,
          reqTypeCode: '',
          sessionId: appFunc.sessionId
        }
        this._aldanService.
          MemberProfileInfo(memberProfileBody).
          subscribe((result1: any) => {
            if (result1.body.responseCode == '0'){
              appFunc.currMemberDetail = result1.body.detail;
              if(appFunc.currMemberDetail.iAkaunStatus == "N" || appFunc.currMemberDetail.iAkaunStatus == "E" || appFunc.currMemberDetail.iAkaunStatus == ""){
                this.route.navigate(['iAkaunRegistration']);
              }
              else if(appFunc.currMemberDetail.iAkaunStatus == "A" && appFunc.currMemberDetail.tacMobilePhone.length == 0){
                this.route.navigate(['updateTAC']);
              }
              else{
                this.route.navigate(['mainMenu']);
              }
            }
            else{
              // Error
              appFunc.message = result1.body.error[0].description;
              this.route.navigate(['outofservice']);
            }
          }, (err: HttpErrorResponse) => {
            appFunc.message = 'HttpError';
            this.route.navigate(['outofservice']);
          });
      }
      else{
        if (result.body.error.length == 0){
          appFunc.message = 'Error Connecting to Server';
          this.route.navigate(['outofservice']);
        }
        if (result.body.error[0].code == 'MBM2001'){
          this.route.navigate(['registerMember']);
        }
        else{
          appFunc.message = result.body.error[0].description;
          this.route.navigate(['outofservice']);
        }
      }
    }, (err: HttpErrorResponse) => {
      appFunc.message = 'HttpError';
      this.route.navigate(['outofservice']);
    });
  }


  checkThumbprintStatus(){
    this.checkThumbprintStatusIntervalId = setInterval(() => {
      signalRConnection.connection.invoke('CheckThumbprintStatus').then((data: number) => {
        if(data == 2){
          this.BeforeRead = false;
          this.AfterRead = true;
          this.bindMyKadData(this.myKadData);
          clearInterval(this.checkThumbprintStatusIntervalId);
        }else if(data == 1){
          this.RetryCountInstance -= 1;
          if (this.RetryCountInstance == 0) this.xlastTry = false;
          this.BeforeRead = true;
          this.AfterRead = false;
          this.ErrorPop = true;
          clearInterval(this.checkThumbprintStatusIntervalId);
        }
      });
    }, 1000);
  }

  cancelMyKadVerification(){
    signalRConnection.connection.invoke('CancelThumbprint').then((data: boolean) => {});
    clearInterval(this.readerIntervalId);
    clearInterval(this.checkThumbprintStatusIntervalId);
    this.route.navigate(['startup']);
  }

  TryAgain(){
    this.ErrorPop = false;
    this.verifyThumbprint();
  }


}
