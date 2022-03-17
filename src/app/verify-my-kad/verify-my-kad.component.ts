import { formatDate } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SignalR } from 'ng2-signalr';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { accessToken } from '../_models/token';
import { signalRConnection } from '../_models/_signalRConnection';
import { AppConfiguration } from '../config/app-configuration';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { MyKadDetails } from '../_models/_myKadData';
import { currMemberDetails } from '../_models/_currentMemberDetails';
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

  Status = "MyKad";
  
  insertCard = true;
  Language = false;
  Thumbprint = false;
  removeCard = false;
  InsertMyKad = true;
  SelectLanguage = false;
  ReadThumbprint = false;
  RemoveMyKad = false;

  insertedMyKad = false;

  arrayList: string[] = [];

  readerIntervalId: any;
  moduleIntervelId: any;


  constructor(
    private route: Router,
    private translate: TranslateService,
    private _signalR: SignalR,
    private _aldanService: AldanService,
    private appConfig: AppConfiguration
  ) { 
  }

  

  ngOnInit(): void {

    this.translate.use('bm');

    this._aldanService.GetBusinessTypes().subscribe((res: any) => {
      appFunc.businessTypes = res.map((bt: any) => new businessTypes(bt));
    });
    this._aldanService.GetServiceOperation(signalRConnection.kioskCode).subscribe((res: any) => {
      appFunc.modules = res.map((em: any) => new eModules(em));

      if(appFunc.modules.length != 0){
        let areDisabled = appFunc.checkNoOfDisabledModules(appFunc.modules);
        if(areDisabled == appFunc.modules.length){
          // errorCodes.code = "0168";
          appFunc.message = "Under Maintenance";
          this.route.navigate(['outofservice']);
        }

        setTimeout(() => {
          this.moduleIntervelId = setInterval(() => {
            let count = appFunc.checkModuleAvailability(appFunc.modules);
            if(count == 0){
              // errorCodes.code = "0168";
              appFunc.message = "Under Maintenance";
              this.route.navigate(['outofservice']);
            }
          }, 1000);
        } , 60000);
      }
      else{
        appFunc.message = "Under Maintenance";
        this.route.navigate(['outofservice']);
      }
      


    });

    this.readerIntervalId = setInterval(() => {
      appFunc.DetectMyKad();
      if(signalRConnection.isCardInserted) {
        if(this.insertedMyKad == false){
          this.insertedMyKad = true;
          this.readMyKad();
        }
      }
      else{
        if(this.insertedMyKad == true){
          clearInterval(this.readerIntervalId);
          this.route.navigate(['']);
        }
      }
    }, 1000);

  }

  verifyThumbprint(data:any) : any{
    signalRConnection.connection.invoke('VerifyThumbprint').then((isVerifySuccess: boolean) => {
      if(isVerifySuccess){
        this.bindMyKadData(data);
      }
    });
  }

  readMyKad(){
    signalRConnection.connection.invoke('ReadMyKad').then((data: any) => {
      this.verifyThumbprint(data)
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

    // signalRConnection.connection.invoke('myKadRequest', this.Status).then((data: any) => {
    //   if (data.toUpperCase().includes("SCANTHUMB")){
    //     this.Status = data;
    //     if(appFunc.DetectMyKad()){
    //       signalRConnection.connection.invoke('myKadRequest', this.Status).then((data: any) => {
    //         this.Status = data;
    //         if (this.Status.toUpperCase().includes("MISMATCH")){
    //           console.log(data);
    //         }
    //         else if(data.toUpperCase().includes("MATCH")){
    //           this.myKadData = Object.assign(new MyKadDetails(), JSON.parse(data));
    //           this.bindMyKadData();
    //         }
    //         else if(data.toUpperCase().includes("TIMEOUT")){
    //           console.log(data);
    //         }
    //         else{
    //           appFunc.message = data;
    //           this.route.navigate(['outofservice']);
    //         }
    //       }); 
    //     }
    //   }
    //   else{
    //     if (data.toLowerCase().includes("invalid")){
    //       //retry
    //       // if(this.tryCountCard == 0){
    //       //   this.loadingVisible = false;
    //       //   this.insertMykadVisible = true;
    //       //   this.InvalidCardVisibleFinal = true;
    //       // }
    //       // else{
    //       //   this.loadingVisible = false;
    //       //   this.insertMykadVisible = true;
    //       //   this.InvalidCardVisible = true;
    //       // }
    //       appFunc.message = data;
    //       this.route.navigate(['outofservice']);
    //       console.log(data);
    //     }else{
    //       appFunc.message = data;
    //       this.route.navigate(['outofservice']);
    //     }
    //   }    
    // });
  }

  selectEN(){
    selectLang.selectedLang = 'en';
    this.translate.use(selectLang.selectedLang);

    this.Language = false;
    this.SelectLanguage = false;
    this.Thumbprint = true;
    this.ReadThumbprint = true;

    this.readMyKad();
    // signalRConnection.connection.invoke('myKadRequest', this.Status).then((data: any) => {
    //   if (data.toUpperCase().includes("SCANTHUMB")){
    //     this.Status = data;
    //     if(appFunc.DetectMyKad()){
    //       signalRConnection.connection.invoke('myKadRequest', this.Status).then((data: any) => {
    //         this.Status = data;
    //         if (this.Status.toUpperCase().includes("MISMATCH")){
    //         }
    //         else if(data.toUpperCase().includes("MATCH")){
    //           this.myKadData = Object.assign(new MyKadDetails(), JSON.parse(data));
    //           this.bindMyKadData();
    //         }
    //         else if(data.toUpperCase().includes("TIMEOUT")){
    //         }
    //         else{
    //           appFunc.message = data;
    //           this.route.navigate(['outofservice']);
    //         }
    //       }); 
    //     }
    //   }
    //   else{
    //     if (data.toLowerCase().includes("invalid")){
    //       //retry
    //       // if(this.tryCountCard == 0){
    //       //   this.loadingVisible = false;
    //       //   this.insertMykadVisible = true;
    //       //   this.InvalidCardVisibleFinal = true;
    //       // }
    //       // else{
    //       //   this.loadingVisible = false;
    //       //   this.insertMykadVisible = true;
    //       //   this.InvalidCardVisible = true;
    //       // }
    //       appFunc.message = data;
    //       this.route.navigate(['outofservice']);
    //       console.log(data);
    //     }else{
    //       appFunc.message = data;
    //       this.route.navigate(['outofservice']);
    //     }
    //   }    
    // });
  }

  ngOnDestroy(): void {
    clearInterval(this.readerIntervalId);
    clearInterval(this.moduleIntervelId);
  }

  bindMyKadData(data:any): void{
    try {
      let age = appFunc.calculateAge(new Date(data['DOB']));

      if (age > 18){
        currentMyKadDetails.Name = data['Name'];
        currentMyKadDetails.ICNo = data['ICNo'].toString().replace("*", "");
        currentMyKadDetails.OldICNo = data['OldICNo'];
        currentMyKadDetails.DOB = data['DOB'];
        currentMyKadDetails.DOBString = data['DOBString'];
        currentMyKadDetails.POB =  data['POB'];
        currentMyKadDetails.Gender = data['Gender'];
        currentMyKadDetails.Citizenship = data['Citizenship'];
        currentMyKadDetails.IssueDate = data['IssueDate'];
        currentMyKadDetails.Race = data['Race'];
        currentMyKadDetails.Religion = data['Religion'];
        currentMyKadDetails.Address1 = data['Address1'];
        currentMyKadDetails.Address2 = data['Address2'];
        currentMyKadDetails.Address3 = data['Address3'];
        currentMyKadDetails.PostCode = data['PostCode'];
        currentMyKadDetails.City = data['City'];
        currentMyKadDetails.State = data['State'];
        currentMyKadDetails.Country = data['Country'];
        currentMyKadDetails.Address = data['Address'];
        currentMyKadDetails.Address1 = data['Address1'];
        currentMyKadDetails.Address2 = data['Address2'];
        currentMyKadDetails.Address3 = data['Address3'];
        currentMyKadDetails.RJ = data['RJ'];
        currentMyKadDetails.KT = data['KT'];
        currentMyKadDetails.GreenCardNationality = data['GreenCardNationality'];
        currentMyKadDetails.GreenCardExpiryDate = data['GreenCardExpiryDate'];
        currentMyKadDetails.CardVersion = data['CardVersion'];
        currentMyKadDetails.OtherID = data['OtherID'];
        currentMyKadDetails.CategoryType = data['CategoryType'];

        this.getAccountInquiry();
      }
      else{
        // errorCodes.code = "0166";
        appFunc.message = "Binding MyKad Error";
        // Error
        this.route.navigate(['outofservice']);
      }
      
    }
    catch(e: any) {
      // errorCodes.code = "0166";
      appFunc.message = e.toString();
      // Error
      this.route.navigate(['outofservice']);
    }
  }

  getAccountInquiry(): void{
    try{

      const body = {
        "regType": "M",
        "accNum": "",
        "accType": "",
        "searchType": "I",
        "idNum": currentMyKadDetails.ICNo,
        "idType": currentMyKadDetails.CategoryType,
        "reqTypeCode": ""   
      }
      this._aldanService.MemberCIFDetailsCheck(body).subscribe((result: any) => {
        if(result.responseCode == "0"){

          const memberProfileBody = {
            "regType": "M",
            "accNum": result.detail.accNum,
            "accType": "S",
            "searchType": "A",
            "idNum": currentMyKadDetails.ICNo,
            "idType": currentMyKadDetails.CategoryType,
            "reqTypeCode": ""
          }
          this._aldanService.MemberProfileInfo(memberProfileBody).subscribe((result1: any) => {
            if(result.responseCode == "0"){
              appFunc.currMemberDetail = result1.detail.map((cmd: any) => new currMemberDetails(cmd));
              this.route.navigate(['mainMenu']);
            }
            else{
              // Error  
              appFunc.message = result.error[0].description;
              this.route.navigate(['outofservice']);
            }
          });
        }
        else{
          if(result.error[0].code == "MBM2001"){
            this.route.navigate(['registerMember']);
          }
          else{
            // Error
            appFunc.message = result.error[0].description;
            this.route.navigate(['outofservice']);
          }
        }
      });
    }
    catch(e: any){
      // Error
      appFunc.message = e.toString();
      this.route.navigate(['outofservice']);
      //signalRConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Verify MyKad]" + ": " + `Redirect to Out Of Service Screen due to ${e}.`);
    }
  }

  // verify() : void {
  //   try {
  //     // First Invoke
  //     signalRConnection.connection.invoke('myKadRequest', this.Status).then((data: any) => {
  //       this.Status = data;
  //       // Not ScanThumb
  //       if(data.toLowerCase().includes("error")){
  //         console.log(data);
  //       }
  //       if(appFunc.DetectMyKad()){
  //         this.insertCard = false;
  //         this.InsertMyKad = false;
  //         this.Language = true;
  //         this.SelectLanguage = true;
  //       }
  //     });
  //   }
  //   catch (e: any){
  //     // Error
  //     appFunc.message = e.toString();
  //     this.route.navigate(['outofservice']);
  //   }
  // }

  cancelMyKadVerification(){
    clearInterval(this.readerIntervalId);
    this.route.navigate(['']);
  }


  

}
