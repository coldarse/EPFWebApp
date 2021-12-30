import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SignalR } from 'ng2-signalr';
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

  insertCard = false;
  Language = false;
  Thumbprint = true;
  removeCard = false;
  page1 = false;
  page2 = false;
  page3 = true;
  page4 = false;

  arrayList: string[] = [];

  constructor(
    private route: Router,
    private translate: TranslateService,
    private signalR: SignalR,
  ) { }

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

  loadPage2(){
    this.page1 = false;
    this.page2 = true;
  }

  ngAfterViewInit(){
    try{
      loadKeyboard();
      //signalrConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Account Registration]" + ": " + "After form is loaded, initialized keyboard");
    }catch(e: any){
      //signalrConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Account Registration]" + ": " + "Error initializing keyboard." + e.toString());
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
          signalRConnection.connection.invoke('myKadRequest', this.Status).then((data: any) => {
            if (data.toUpperCase().includes("SCANTHUMB")){
              this.Status = data;
              if(this.DetectMyKad()){
                signalRConnection.connection.invoke('ScanThumbprint').then((data: any) => {
                  this.Status = data;
                  if (this.Status.toUpperCase().includes("MISMATCH")){
                    console.log(data);
                  }
                  else if(data.toUpperCase().includes("MATCH")){
                    console.log(data);
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
      });
    }
    catch (e: any){
      
    }
  }



}
