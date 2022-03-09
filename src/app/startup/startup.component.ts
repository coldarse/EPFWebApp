import { formatDate } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SignalR, SignalRConnection } from 'ng2-signalr';
// import { NgxSpinnerService } from "ngx-spinner";
import { AldanService } from '../shared/aldan.service';
import { adapter, businessTypes, eModules } from '../_models/modelClass';
import { accessToken } from '../_models/token';
import { appFunc } from '../_models/_appFunc';
import { signalRConnection } from '../_models/_signalRConnection';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.css']
})
export class StartupComponent implements OnInit {

  @ViewChild('username') username : ElementRef | undefined;
  @ViewChild('password') password : ElementRef | undefined;

  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;
  page5 = false;
  seconds = 5;
  dots = "."
  adapters: adapter[] = [];
  selectedAdapterValue = "";
  isSelectedAdapter = false;

  constructor(
    // private spinner: NgxSpinnerService,
    private _signalR: SignalR,
    private _aldanService: AldanService,
    private route: Router,
  ) {
    this.startConnection();
  }

  ngOnInit(): void {
    // this.spinner.show();
  }

  startConnection() : void {
    let dotInterval = setInterval(() => {
      this.dots += "."
      if(this.dots == "........"){
        this.dots = "."
      }
    }, 400)
    this._signalR.connect().then((c) => {
      console.log("API King is now Connected on " + formatDate(new Date(), 'HH:MM:ss', 'en'));
      signalRConnection.connection = c;

      signalRConnection.connection.invoke('GetKioskCode').then((data: string) => {
        signalRConnection.kioskCode = data;
        signalRConnection.connection.invoke('GetAdapterName').then((data: any[]) => {
          signalRConnection.adapter = data;
          this.adapters = data;
          this._aldanService.getToken(signalRConnection.kioskCode, signalRConnection.adapter[0].adapterNameEncrypted)
          .subscribe((result: any) => {
            clearInterval(dotInterval);
            if(!isNaN(result)){ //Number
              // Say that Kiosk Is Not Found in KMS
              this.page1 = false;
              this.page2 = true;
            }
            else{ //Not Number
              accessToken.token = result.access_token;
              accessToken.httpOptions = {
                headers: new HttpHeaders({
                  Authorization: 'Bearer ' + accessToken.token
                })
              };
              this._aldanService.verifyKiosk(signalRConnection.kioskCode)
              .toPromise().then((resultKiosk: any) => {
                if(!isNaN(resultKiosk)){ //Number
                  console.log(resultKiosk);
                  appFunc.message = resultKiosk.toString();
                  this.route.navigate(['outofservice']);
                }
                else{ //Not Number
                  signalRConnection.kioskInformation = resultKiosk;
                  // Not Registered
                  if(signalRConnection.kioskInformation.macAddress == ""){
                    // Ask to Register Kiosk
                    this.page1 = false;
                    this.page4 = true;
                  }
                  // Registered
                  else{
                    if(signalRConnection.kioskInformation.macAddress == signalRConnection.adapter[0].adapterName){
                      this.route.navigate(['verifyMyKad']);
                    }
                    //Mac Address Doesn't Match
                    else{
                      console.log(resultKiosk);
                      appFunc.message = "Unauthorized";
                      this.route.navigate(['outofservice']);
                    }
                  }
                }
              })
            }
          });
        });
      });
      

      

      // signalRConnection.connection.invoke('GetKioskID').then((data: string) => {
      //   signalRConnection.kioskID = data;
      // });
      // signalRConnection.connection.invoke('isHardcodedIC').then((data: boolean) => {
      //   signalRConnection.isHardcodedIC = data;
      // });
      
    }).catch((err: any) => {
      console.log(err.toString())
      // errorCodes.code = "0167";
      appFunc.message = "Unauthorized";
      this.route.navigate(['outofservice']);
    });
  }

  selectedAdapter(event: any){
    if(event.target.value != ""){
      this.selectedAdapterValue = event.target.value;
      this.isSelectedAdapter = true;
    }
    else{
      this.isSelectedAdapter = false;
    }
  }

  page3Click(){
    signalRConnection.connection.invoke('GetSelectedDiskDriveSerial', this.selectedAdapterValue).then((data: string) => {
      const kioskRegisterBody = {
        "MacAddress": data
      }
      this._aldanService.registerKiosk(signalRConnection.kioskID, kioskRegisterBody)
      .toPromise().then((result: any) => {
        if(result){
          const changepasswordBody = {
            "currentPassword": '1q2w3E*',
            "newPassword": this.selectedAdapterValue
          }
          this._aldanService.changePassword(changepasswordBody)
          .toPromise().then((result: any) => {
            if(result.toString() == "204"){
              this.page3 = false;
              this.page5 = true;

              let secondInterval = setInterval(() => {
                this.seconds -= 1;
                if(this.seconds == 0){
                  clearInterval(secondInterval);
                  this.route.navigate(['verifyMyKad']);
                }
              }, 1000);
            }
            else{
              appFunc.message = "Failed Change Password for Kiosk";
              this.route.navigate(['outofservice']);
            }
          });
        }
        else{
          appFunc.message = "Failed Register Kiosk";
          this.route.navigate(['outofservice']);
        }
      })
    });
  }

  page4Click(){
    if(this.username?.nativeElement.value == "admin" && this.password?.nativeElement.value == "abcd1234"){
      this.page4 = false;
      this.page3 = true;
    }
  }

}
