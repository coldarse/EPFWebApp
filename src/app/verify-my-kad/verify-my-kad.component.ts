import { HttpErrorResponse } from '@angular/common/http';
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

  Status = 'MyKad';

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

  arrayList: string[] = [];

  readerIntervalId: any;
  moduleIntervelId: any;

  checkThumbprintStatusIntervalId: any;

  myKadData: any;
  RetryCountInstance = 0;
  ErrorPop = false;
  xlastTry = true;

  isOutOfService = false;



  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService,
    private appConfig: AppConfiguration
  ) {
  }



  ngOnInit(): void {

    this.RetryCountInstance = this.appConfig.RetryCounts;
    this.translate.use('bm');
    if (appFunc.endSession){
      this.translate.use(selectLang.selectedLang);
      this.insertCard = false;
      this.InsertMyKad = false;
      this.removeCard = true;
      this.RemoveMyKad = true;
      this.insertedMyKad = true;
      this._aldanService.EndSession(appFunc.sessionId, {KioskId: signalRConnection.kioskCode}).subscribe((result: any) => {
      });
    }
    else{
      if (accessToken.httpOptions != undefined){
        this._aldanService.GetBusinessTypes().subscribe((res: any) => {
          appFunc.businessTypes = res.body.map((bt: any) => new businessTypes(bt));
        }, (err: HttpErrorResponse) => {
          appFunc.message = 'HttpError';
          this.route.navigate(['outofservice']);
        });
        this._aldanService.GetServiceOperation(signalRConnection.kioskCode).subscribe((res: any) => {
          appFunc.modules = res.body.map((em: any) => new eModules(em));

          if (appFunc.modules.length != 0){
            const areDisabled = appFunc.checkNoOfDisabledModules(appFunc.modules);
            if (areDisabled == appFunc.modules.length){
              // errorCodes.code = "0168";
              appFunc.message = 'Under Maintenance';
              this.isOutOfService = true;
              this.route.navigate(['outofservice']);
            }

            setTimeout(() => {
              this.moduleIntervelId = setInterval(() => {
                const count = appFunc.checkModuleAvailability(appFunc.modules);
                if (count == 0){
                  // errorCodes.code = "0168";
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
            this.insertedMyKad = true;
            this.insertCard = false;
            this.InsertMyKad = false;
            this.Language = true;
            this.SelectLanguage = true;
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

  useMainPage(){
    this.route.navigate(['startup']);
  }

  verifyThumbprint(){
    if (this.RetryCountInstance != 0){
      signalRConnection.connection.invoke('VerifyThumbprint').then((isVerifySuccess: any) => {
        // if (isVerifySuccess){
        //   this.BeforeRead = false;
        //   this.AfterRead = true;
        //   this.bindMyKadData(this.myKadData);
        // }
        // else{
        //   this.RetryCountInstance -= 1;
        //   if (this.RetryCountInstance == 0) this.xlastTry = false;
        //   this.BeforeRead = true;
        //   this.AfterRead = false;
        //   this.ErrorPop = true;
        // }
      });
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
    try {
      const age = appFunc.calculateAge(new Date(data.DOB));

      if (age > 18){
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
        // errorCodes.code = "0166";
        appFunc.message = 'Binding MyKad Error';
        // Error
        this.route.navigate(['outofservice']);
      }

    }
    catch (e: any) {
      // errorCodes.code = "0166";
      appFunc.message = e.toString();
      // Error
      this.route.navigate(['outofservice']);
    }
  }

  getAccountInquiry(): void{
    try{

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
        idNum: currentMyKadDetails.ICNo,
        idType: catType,
        reqTypeCode: '',
        sessionId: appFunc.sessionId
      }
      this._aldanService.MemberCIFDetailsCheck(body).subscribe((result: any) => {
        if (result.status == 200){
          if (result.body.responseCode == '0'){
            const memberProfileBody = {
              regType: 'M',
              accNum: result.body.detail.accNum,
              accType: 'S',
              searchType: 'A',
              idNum: currentMyKadDetails.ICNo,
              idType: catType,
              reqTypeCode: '',
              sessionId: appFunc.sessionId
            }
            this._aldanService.MemberProfileInfo(memberProfileBody).subscribe((result1: any) => {
              if (result.status == 200){
                if (result1.body.responseCode == '0'){
                  appFunc.currMemberDetail = result1.body.detail;
                  this.route.navigate(['mainMenu']);
                }
                else{
                  // Error
                  appFunc.message = result1.body.error[0].description;
                  this.route.navigate(['outofservice']);
                }
              }
              else{
                appFunc.message = result.message;
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
              // Error
              appFunc.message = result.body.error[0].description;
              this.route.navigate(['outofservice']);
            }
          }
        }
        else{
          appFunc.message = result.message;
          this.route.navigate(['outofservice']);
        }
      }, (err: HttpErrorResponse) => {
        appFunc.message = 'HttpError';
        this.route.navigate(['outofservice']);
      });
    }
    catch (e: any){
      // Error
      appFunc.message = e.toString();
      this.route.navigate(['outofservice']);
    }
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
    signalRConnection.connection.invoke('CancelThumbprint').then((data: boolean) => {
    });
    clearInterval(this.readerIntervalId);
    clearInterval(this.checkThumbprintStatusIntervalId);
    this.route.navigate(['startup']);
  }

  TryAgain(){
    this.ErrorPop = false;
    this.verifyThumbprint();
  }


}
