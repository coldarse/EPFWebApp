import { formatDate } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SignalR, SignalRConnection } from 'ng2-signalr';
import { AppConfiguration } from '../config/app-configuration';
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

  CheckKioskCredentials = true;
  KioskNotFound = false;
  SelectAdapter = false;
  AdminLogin = false;
  SuccessRegister = false;
  seconds = 5;
  dots = "."
  dotInterval : any;
  adapters: adapter[] = [];
  selectedAdapterValue = "";
  selectedAdapterValueEncrypted = "";
  isSelectedAdapter = false;
  isAdapterEmpty = false;

  UserName = "";
  Password = "";
  Secret = "";

  format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;


  constructor(
    // private spinner: NgxSpinnerService,
    private _signalR: SignalR,
    private _aldanService: AldanService,
    private route: Router,
    private appConfig: AppConfiguration,
  ) {
    this.UserName = appConfig.UserName.trim();
    this.Password = appConfig.Password.trim();
    this.Secret = appConfig.Client_Secret.trim();
    
    this.startConnection();
  }

  ngOnInit(): void {
    // this.spinner.show();
  }

  login(password: string){

    if(!this.format.test(password)){
      password = password.concat('=');
    }

    this._aldanService.getToken(signalRConnection.kioskCode, password)
    .subscribe((result: any) => {
      clearInterval(this.dotInterval);
      if(!isNaN(result)){ //Number
        // Say that Kiosk Is Not Found in KMS
        this.CheckKioskCredentials = false;
        this.KioskNotFound = true;
      }
      else{ //Not Number
        accessToken.token = result.access_token;
        accessToken.httpOptions = {
          headers: new HttpHeaders(
            {Authorization: 'Bearer ' + accessToken.token}
            ),
            observe: 'response' as 'body'
        };
        this._aldanService.verifyKiosk(signalRConnection.kioskCode)
        .toPromise().then((result: any) => {
          console.log(result)
          if(!isNaN(result.body)){
            appFunc.message = result.body.toString();
            this.route.navigate(['outofservice']);
          }
          else{ //Not Number
            signalRConnection.kioskInformation = result.body;
            // Not Registered
            if(signalRConnection.kioskInformation.macAddress == ""){
              // Ask to Register Kiosk
              this.CheckKioskCredentials = false;
              this.AdminLogin = true;
            }
            // Registered
            else{
              if(signalRConnection.kioskInformation.macAddress == signalRConnection.adapter[0].adapterName){
                this.route.navigate(['verifyMyKad']);
              }
              //Mac Address Doesn't Match
              else{
                console.log(result.body);
                appFunc.message = "Unauthorized";
                this.route.navigate(['outofservice']);
              }
            }
          }
        })
      }
    });
  }

  startConnection() : void {
    this.dotInterval = setInterval(() => {
      this.dots += "."
      if(this.dots == "........"){
        this.dots = "."
      }
    }, 400);

    if(signalRConnection.connection == undefined){
      this._signalR.connect().then((c) => {
        console.log("API King is now Connected on " + formatDate(new Date(), 'hh:mm:ss', 'en'));
        signalRConnection.connection = c;
  
        signalRConnection.connection.invoke('GetKioskCode').then((data: string) => {
          signalRConnection.kioskCode = data;
          signalRConnection.connection.invoke('isAdapterEmpty').then((data: boolean) => {
            this.isAdapterEmpty = data;
            signalRConnection.connection.invoke('GetAdapterName').then((data: any[]) => {
              signalRConnection.adapter = data;
              this.adapters = data;
              if(this.isAdapterEmpty){
                this.login(this.Secret)
              }
              else{
                this.login(signalRConnection.adapter[0].adapterNameEncrypted)
              }
            });
          });
          
        });
      }).catch((err: any) => {
        console.log(err.toString())
        // errorCodes.code = "0167";
        appFunc.message = "Unauthorized";
        this.route.navigate(['outofservice']);
      });
    }
    else{
      this.route.navigate(['verifyMyKad']);
    }

    
  }

  selectedAdapter(event: any){
    if(event.target.value != ""){
      this.selectedAdapterValueEncrypted = event.target.value;
      this.isSelectedAdapter = true;
    }
    else{
      this.isSelectedAdapter = false;
    }
  }

  SelectAdapterNext(){
    this.adapters.forEach((element: adapter) => {
      if(element.adapterNameEncrypted == this.selectedAdapterValueEncrypted) this.selectedAdapterValue = element.adapterName;
    })
    const kioskRegisterBody = {
      "MacAddress": this.selectedAdapterValue
    }
    this._aldanService.registerKiosk(signalRConnection.kioskInformation.id.toString(), kioskRegisterBody)
    .toPromise().then((result: any) => {
      if(result.body){
        signalRConnection.connection.invoke('UpdateAdapter', this.selectedAdapterValue).then((data: boolean) => {
          if(data){

            if(!this.format.test(this.selectedAdapterValueEncrypted)){
              this.selectedAdapterValueEncrypted = this.selectedAdapterValueEncrypted.concat('=');
            }

            const changepasswordBody = {
              "currentPassword": this.Secret,
              "newPassword": this.selectedAdapterValueEncrypted
            }
            this._aldanService.changePassword(changepasswordBody)
            .subscribe((response: any) => {
              if(response.status.toString() == "204"){
                this.SelectAdapter = false;
                this.SuccessRegister = true;
  
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
            appFunc.message = "Failed Update Adapter";
            this.route.navigate(['outofservice']);
          }
        });
      }
      else{
        appFunc.message = "Failed Register Kiosk";
        this.route.navigate(['outofservice']);
      }
    })
  }

  AdminLoginClick(){
    if(this.username?.nativeElement.value == this.UserName && this.password?.nativeElement.value == this.Password){
      this.AdminLogin = false;
      this.SelectAdapter = true;
    }
  }

}
