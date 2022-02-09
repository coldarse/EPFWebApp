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
import { writeJSON, writeJSONSync, Options, JSONObject } from "write-json-safe";
import { AppConfiguration } from '../config/app-configuration';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { MyKadDetails } from '../_models/_myKadData';
import { removeSummaryDuplicates } from '@angular/compiler';
import * as signalR from '@aspnet/signalr';
import { currMemberDetails } from '../_models/_currentMemberDetails';
import { appFunc } from '../_models/_appFunc';


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
  intervalID: any;
  myKadData: any;
  insertCard = true;
  Language = false;
  Thumbprint = false;
  removeCard = false;
  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;

  insertedMyKad = false;

  arrayList: string[] = [];

  hubConnection: signalR.HubConnection | undefined;

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _signalR: SignalR,
    private _aldanService: AldanService,
    private appConfig: AppConfiguration
  ) { 
    this.startConnection();
  }

  

  // startConnection = () => {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //   .withUrl('https://localhost:44373/signalrkms', {
  //       skipNegotiation: true,
  //       transport: signalR.HttpTransportType.WebSockets
  //   })
  //   .build();

  //   this.hubConnection
  //   .start()
  //   .then(() => {
  //       console.log('Hub Connection Started!');
  //   })
  //   .catch(err => console.log('Error while starting connection: ' + err))
  //   signalRConnection.connection = this.hubConnection;
  //   this.askServer();
  // }

  // askServer() {
  //     signalRConnection.connection.invoke("askServer", "hey")
  //     .catch((err: any) => console.error(err));
  // }

  // askServerListener() {
  //   signalRConnection.connection.on("askServerResponse", (someText: any) => {
  //       console.log(someText);
  //   })
  // }

  startConnection() : void {
    this._signalR.connect().then((c) => {
      console.log("API King is now Connected on " + formatDate(new Date(), 'HH:MM:ss', 'en'));
      signalRConnection.connection = c;
      accessToken.httpOptions = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + accessToken.token
        })
      };
      // this._aldanService.getTranslations().subscribe((res: any) => {
      //   console.log(res);
      // });
      // this._aldanService.GetOperationTime('Kiosk001').subscribe((res: any) => {
      //   console.log(res);
      // });
      // this._aldanService.GetServiceOperation('Kiosk001').subscribe((res: any) => {
      //   console.log(res);
      // });
    }).catch((err: any) => {
      // errorCodes.code = "0167";
      // errorCodes.message = "Unauthorized";
      // this.route.navigate(['outofservice']);
    });
  }

  getServiceOperation(){
    this._aldanService.GetOperationTime('Kiosk001').subscribe((res: any) => {
      console.log(res);
    });
  }

  getOperationTime(){
    this._aldanService.GetServiceOperation('Kiosk001').subscribe((res: any) => {
      console.log(res);
    });
  }

  ngOnInit(): void {

    this.translate.use('bm');

    // setTimeout(() => {
    //   this.askServerListener();
    //   this.askServer();
    // }, 2000);

    this.intervalID = setInterval(() => {
      this.DetectMyKad();
      if(signalRConnection.cardDetect == true) {
        if(this.insertedMyKad == false){
          this.insertedMyKad = true;
          this.verify();
        }
      }
      else{
        if(this.insertedMyKad == true){
          clearInterval(this.intervalID);
          this.route.navigate(['']);
        }
      }

    }, 1000);

  }

  selectBM(){
    selectLang.selectedLang = 'bm';
    this.translate.use(selectLang.selectedLang);

    this.Language = false;
    this.page2 = false;
    this.Thumbprint = true;
    this.page3 = true;

    

    signalRConnection.connection.invoke('myKadRequest', this.Status).then((data: any) => {
      if (data.toUpperCase().includes("SCANTHUMB")){
        this.Status = data;
        if(this.DetectMyKad()){
          signalRConnection.connection.invoke('myKadRequest', this.Status).then((data: any) => {
            this.Status = data;
            if (this.Status.toUpperCase().includes("MISMATCH")){
              console.log(data);
            }
            else if(data.toUpperCase().includes("MATCH")){
              this.myKadData = Object.assign(new MyKadDetails(), JSON.parse(data));
              this.bindMyKadData();
            }
            else if(data.toUpperCase().includes("TIMEOUT")){
              console.log(data);
            }
            else{
              console.log(data);
            }
          }); 
        }
      }
      else{
        if (data.toLowerCase().includes("invalid")){
          //retry
          // if(this.tryCountCard == 0){
          //   this.loadingVisible = false;
          //   this.insertMykadVisible = true;
          //   this.InvalidCardVisibleFinal = true;
          // }
          // else{
          //   this.loadingVisible = false;
          //   this.insertMykadVisible = true;
          //   this.InvalidCardVisible = true;
          // }
          console.log(data);
        }else{
          console.log(data);
        }
      }    
    });
  }

  selectEN(){
    selectLang.selectedLang = 'en';
    this.translate.use(selectLang.selectedLang);

    this.Language = false;
    this.page2 = false;
    this.Thumbprint = true;
    this.page3 = true;

    signalRConnection.connection.invoke('myKadRequest', this.Status).then((data: any) => {
      if (data.toUpperCase().includes("SCANTHUMB")){
        this.Status = data;
        if(this.DetectMyKad()){
          signalRConnection.connection.invoke('myKadRequest', this.Status).then((data: any) => {
            this.Status = data;
            if (this.Status.toUpperCase().includes("MISMATCH")){
            }
            else if(data.toUpperCase().includes("MATCH")){
              this.myKadData = Object.assign(new MyKadDetails(), JSON.parse(data));
              this.bindMyKadData();
            }
            else if(data.toUpperCase().includes("TIMEOUT")){
            }
            else{
              this.route.navigate(['']);
            }
          }); 
        }
      }
      else{
        if (data.toLowerCase().includes("invalid")){
          //retry
          // if(this.tryCountCard == 0){
          //   this.loadingVisible = false;
          //   this.insertMykadVisible = true;
          //   this.InvalidCardVisibleFinal = true;
          // }
          // else{
          //   this.loadingVisible = false;
          //   this.insertMykadVisible = true;
          //   this.InvalidCardVisible = true;
          // }
          console.log(data);
        }else{
          console.log(data);
        }
      }    
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalID);
  }

  ngAfterViewInit(){
    try{
      //signalRConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Account Registration]" + ": " + "After form is loaded, initialized keyboard");
    }catch(e: any){
      //signalRConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Account Registration]" + ": " + "Error initializing keyboard." + e.toString());
    }
  }

  calculateAge(birthdate: Date) {
    let age = 0;
    var timeDiff = Math.abs(Date.now() - new Date(birthdate).getTime());
    age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    return age;
  }

  bindMyKadData(): void{
    try {

      let age = this.calculateAge(new Date(this.myKadData['DOB']));

      if (age > 18){
        currentMyKadDetails.Name = this.myKadData['Name'];
        currentMyKadDetails.ICNo = this.myKadData['ICNo'].toString().replace("*", "");
        currentMyKadDetails.OldICNo = this.myKadData['OldICNo'];
        currentMyKadDetails.DOB = this.myKadData['DOB'];
        currentMyKadDetails.POB =  this.myKadData['POB'];
        currentMyKadDetails.Gender = this.myKadData['Gender'];
        currentMyKadDetails.Citizenship = this.myKadData['Citizenship'];
        currentMyKadDetails.IssueDate = this.myKadData['IssueDate'];
        currentMyKadDetails.Race = this.myKadData['Race'];
        currentMyKadDetails.Religion = this.myKadData['Religion'];
        currentMyKadDetails.Address1 = this.myKadData['Address1'];
        currentMyKadDetails.Address2 = this.myKadData['Address2'];
        currentMyKadDetails.Address3 = this.myKadData['Address3'];
        currentMyKadDetails.PostCode = this.myKadData['PostCode'];
        currentMyKadDetails.City = this.myKadData['City'];
        currentMyKadDetails.State = this.myKadData['State'];
        currentMyKadDetails.Country = this.myKadData['Country'];
        currentMyKadDetails.Address = this.myKadData['Address'];
        currentMyKadDetails.Address1 = this.myKadData['Address1'];
        currentMyKadDetails.Address2 = this.myKadData['Address2'];
        currentMyKadDetails.Address3 = this.myKadData['Address3'];
        currentMyKadDetails.RJ = this.myKadData['RJ'];
        currentMyKadDetails.KT = this.myKadData['KT'];
        currentMyKadDetails.GreenCardNationality = this.myKadData['GreenCardNationality'];
        currentMyKadDetails.GreenCardExpiryDate = this.myKadData['GreenCardExpiryDate'];
        currentMyKadDetails.CardVersion = this.myKadData['CardVersion'];
        currentMyKadDetails.OtherID = this.myKadData['OtherID'];
        currentMyKadDetails.CategoryType = this.myKadData['CategoryType'];

        this.getAccountInquiry();
      }
      else{

      }
      
    }
    catch(e: any) {
      // errorCodes.code = "0166";
      // errorCodes.message = e;
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
              this.route.navigate(['']);
            }
          });
        }
        else{
          if(result.error[0].code == "MBM2001"){
            this.route.navigate(['registerMember']);
          }
          else{
            this.route.navigate(['']);
          }
        }
      });
    }
    catch(e: any){
      this.route.navigate(['']);
      //signalRConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Verify MyKad]" + ": " + `Redirect to Out Of Service Screen due to ${e}.`);
    }
  }


  DetectMyKad(): boolean {
    return signalRConnection.connection.invoke('IsCardDetected').then((data: boolean) => {
      signalRConnection.cardDetect = data;
    });
  }

  verify() : void {
    try {
      // First Invoke
      signalRConnection.connection.invoke('myKadRequest', this.Status).then((data: any) => {
        this.Status = data;
        // Not ScanThumb
        if(data.toLowerCase().includes("error")){
          console.log(data);
        }
        if(this.DetectMyKad()){
          this.insertCard = false;
          this.page1 = false;
          this.Language = true;
          this.page2 = true;
        }
      });
    }
    catch (e: any){
      
    }
  }

  cancelMyKadVerification(){
    clearInterval(this.intervalID);
    this.route.navigate(['']);
  }


  

}
