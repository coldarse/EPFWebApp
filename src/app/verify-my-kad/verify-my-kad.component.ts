import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SignalR } from 'ng2-signalr';
import { selectLang } from '../_models/language';
import { signalRConnection } from '../_models/_signalRConnection';


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

  insertCard = true;
  Language = false;
  Thumbprint = false;
  removeCard = false;
  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;

  arrayList: string[] = [];

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _signalR: SignalR,
  ) { 
    this.startConnection();
  }

  startConnection() : void {
    this._signalR.connect().then((c) => {
      console.log("API King is now Connected on " + formatDate(new Date(), 'HH:MM:ss', 'en'));
      signalRConnection.connection = c;
      // signalRConnection.connection.invoke('GetKioskCode').then((data: string) => {
      //   signalRConnection.kioskCode = data;
      // });
      // signalRConnection.connection.invoke('GetKioskID').then((data: string) => {
      //   signalRConnection.kioskID = data;
      // });
      // signalRConnection.connection.invoke('isHardcodedIC').then((data: boolean) => {
      //   signalRConnection.isHardcodedIC = data;
      // });
      // signalRConnection.connection.invoke('KioskType').then((data: string) => {
      //   signalRConnection.kioskType = data;
      // });
      // signalRConnection.connection.invoke('BranchName').then((data: string) => {
      //   signalRConnection.branchName = data;
      // });
      // signalRConnection.connection.invoke('CheckPrinterStatus').then((data: boolean) => {
      //   if(data == false){
      //     signalRConnection.kioskType = 'Mobile';
      //   }
      // });
      // signalRConnection.connection.invoke('GetLoginToken').then((data: string) => {
      //   accessToken.token = data;
      //   accessToken.httpOptions = {
      //     headers: new HttpHeaders({
      //       Authorization: 'Bearer ' + accessToken.token
      //     })
      //   };
      //   this.serviceService.genTrxNo(signalRConnection.kioskCode, "AK").subscribe((res: any) => {
      //     signalRConnection.trxno = res.result.toString();
      //   }, error => {
      //     errorCodes.code = error.status;
      //     errorCodes.message = "Harap Maaf, Kiosk tidak berfungsi buat sementara waktu" + '\n' + "Sorry, Kiosk is temporarily out of service";
      //     this.route.navigate(['outofservice']);
      //   });
      //   this.serviceService.getScreenSaver(signalRConnection.kioskCode).subscribe((res : any) => {
      //     appFunc.screenSaver = res.result[0].agentDownloadPath;
      //     appFunc.screenSaverList = res.result[0].fileList;
      //   });
      //   this.serviceService.getKioskModules(signalRConnection.kioskCode).subscribe((res: any) => {
      //     var areDisabled = 0
      //     this.loadingDisable = false;
      //     appFunc.modules = res.result.map((em: any) => new eModules(em));

          
      //     for (var val of appFunc.modules){
      //       if(val.enable == false){
      //         areDisabled += 1;
      //       }
      //     }

      //     console.log(signalRConnection.kioskCode);

      //     if(areDisabled == appFunc.modules.length){
      //       errorCodes.code = "0168";
      //       errorCodes.message = "Under Maintenance";
      //       this.route.navigate(['outofservice']);
      //     }

      //     setTimeout(() => {
      //       this.id = setInterval(() => {
      //         let count = 0;
      //         for (var val of appFunc.modules){
      //           if(val.moduleID == 3){//Update CIF
      //             if(val.enable == true){
      //               if(this.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
      //                 count += 1;
      //               }
      //             }
      //           }
      //           else if(val.moduleID == 6){//Balance Inquiry
      //             if(val.enable == true){
      //               if(this.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
      //                 count += 1;
      //               }
      //             }
      //           }
      //           else if(val.moduleID == 5){//Financial
      //             if(val.enable == true){
      //               if(this.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
      //                 count += 1;
      //               }
      //             }
      //           }
      //           else if(val.moduleID == 2){//Bijak Registration
      //             if(val.enable == true){
      //               if(this.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
      //                 count += 1;
      //               }
      //             }
      //           }
      //           else if(val.moduleID == 4){//Portal Registration
      //             if(val.enable == true){
      //               if(this.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
      //                 count += 1;
      //               }
      //             }
      //           }
      //         }
        
      //         if(count == 0){
      //           errorCodes.code = "0168";
      //           errorCodes.message = "Under Maintenance";
      //           this.route.navigate(['outofservice']);
      //         }
      //       }, 1000);
      //     } , 60000);
      //   }, error => {
      //     errorCodes.code = error.status;
      //     errorCodes.message = "Harap Maaf, Kiosk tidak berfungsi buat sementara waktu" + '\n' + "Sorry, Kiosk is temporarily out of service";
      //     this.route.navigate(['outofservice']);
      //   });
      // });
      
      
    }).catch((err: any) => {
      // errorCodes.code = "0167";
      // errorCodes.message = "Unauthorized";
      // this.route.navigate(['outofservice']);
    });
  }

  ngOnInit(): void {

    this.translate.use('bm');

    this.intervalID = setInterval(() => {
      this.DetectMyKad();
      if (signalRConnection.cardDetect == true) {
        clearInterval(this.intervalID);
        this.verify();
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
              console.log(data);
              this.route.navigate(['mainMenu']);
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
              console.log(data);
            }
            else if(data.toUpperCase().includes("MATCH")){
              console.log(data);
              this.route.navigate(['mainMenu']);
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

  ngAfterViewInit(){
    try{
      loadKeyboard();
      //signalRConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Account Registration]" + ": " + "After form is loaded, initialized keyboard");
    }catch(e: any){
      //signalRConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Account Registration]" + ": " + "Error initializing keyboard." + e.toString());
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



}
