import { formatDate } from '@angular/common';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SignalR, SignalRConnection } from 'ng2-signalr';
import { AppConfiguration } from '../config/app-configuration';
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

  @ViewChild('username') username: ElementRef | undefined;
  @ViewChild('password') password: ElementRef | undefined;

  CheckKioskCredentials = true;
  KioskNotFound = false;
  SelectAdapter = false;
  AdminLogin = false;
  SuccessRegister = false;
  isSelectedAdapter = false;
  isAdapterEmpty = false;
  dotInterval: any;
  adapters: adapter[] = [];
  selectedAdapterValue = '';
  selectedAdapterValueEncrypted = '';
  UserName = '';
  Password = '';
  Secret = '';
  seconds = 5;
  dots = '.'
  format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;


  constructor(
    private _signalR: SignalR,
    private _aldanService: AldanService,
    private route: Router,
    private appConfig: AppConfiguration,
  ) {
    this.UserName = 'admin';
    this.Password = 'abcd1234';
    this.Secret = '1q2w3E*';
    this.startConnection();
  }

  ngOnInit(): void {
  }

  login(password: string) {

    if (!this.format.test(password)) {
      password = password.concat('=');
    }

    this._aldanService.
      getToken(signalRConnection.kioskCode, password).
      subscribe((result: any) => {
        appFunc.isFromStartupGetToken = false;
        clearInterval(this.dotInterval);
        if (!isNaN(result)) { //Number
          // Say that Kiosk Is Not Found in KMS
          this.CheckKioskCredentials = false;
          this.KioskNotFound = true;
        }
        //Not Number
        accessToken.token = result.access_token;
        accessToken.httpOptions = {
          headers: new HttpHeaders(
            { Authorization: 'Bearer ' + accessToken.token }
          ),
          observe: 'response' as 'body'
        };
        this._aldanService
          .verifyKiosk(signalRConnection.kioskCode)
          .toPromise().then((result: any) => {
            if (!isNaN(result.body)) {
              appFunc.message = result.body.toString();
              appFunc.code = "SSDM Error";
              this.route.navigate(['outofservice']);
            }
            else { //Not Number
              signalRConnection.kioskInformation = result.body;
              // Not Registered
              if (signalRConnection.kioskInformation.macAddress == '') {
                // Ask to Register Kiosk
                this.CheckKioskCredentials = false;
                this.AdminLogin = true;
              }
              // Registered
              else {
                if (signalRConnection.kioskInformation.macAddress == signalRConnection.adapter[0].adapterName) {
                  let count = 0;
                  //Get Business Types for iSaraan
                  this._aldanService.GetBusinessTypes().subscribe((res: any) => {
                    appFunc.businessTypes = res.body.map((bt: any) => new businessTypes(bt));
                    count += 1;
                  }, (err: HttpErrorResponse) => {
                    appFunc.message = 'HttpError';
                    appFunc.isFromStartupGetToken = true;
                    appFunc.code = "SSDM Error. Failed to get Business Types from KMS.";
                    this.route.navigate(['outofservice']);
                  });
                  //Get Module Operations
                  this._aldanService.GetServiceOperation(signalRConnection.kioskCode).subscribe((res: any) => {
                    appFunc.modules = res.body.map((em: any) => new eModules(em));
                    count += 1;
                  }, (err: HttpErrorResponse) => {
                    appFunc.message = 'HttpError';
                    appFunc.isFromStartupGetToken = true;
                    appFunc.code = "SSDM Error. Failed to get Service Operation.";
                    this.route.navigate(['outofservice']);
                  });
                  //Get Client Settings for Kiosk Functionality
                  this._aldanService.GetClientSettings().subscribe((res: any) => {
                    appFunc.thumbprintRetry = Number(res[0].body.value);
                    appFunc.iAkaunActivationPerDay = Number(res[1].body.value);
                    appFunc.minCharForPassword = Number(res[2].body.value);
                    appFunc.updateTACPerMonth = Number(res[3].body.value);
                    appFunc.NumberOfYearsViewStatement = Number(res[4].body.value);
                    let range = res[5].body.value.split(',');
                    appFunc.AgeRangeLow = Number(range[0]);
                    appFunc.AgeRangeHigh = Number(range[1]);
                    count += 1;
                  }, (err: HttpErrorResponse) => {
                    appFunc.message = 'HttpError';
                    appFunc.isFromStartupGetToken = true;
                    appFunc.code = "SSDM Error. Failed to retrieve Client Settings from KMS.";
                    this.route.navigate(['outofservice']);
                  });
                  //Get iAkaun Activation TNC BM
                  this._aldanService.GetTnC(
                    'bm'
                  )
                  .subscribe((result: any) => {
                    count += 1;
                    if (result.body.content != '') {
                      appFunc.iAkaunActTNCBM = result.body;
                    }
                  },(err: HttpErrorResponse) => {
                    appFunc.message = "HttpError";
                    appFunc.isFromStartupGetToken = true;
                    appFunc.code = "ESB Error, Failed to get iAkaun Activation TnC.";
                    this.route.navigate(['outofservice']);
                  });
                  //Get iAkaun Activation TNC EN
                  this._aldanService.GetTnC(
                    'en'
                  )
                  .subscribe((result: any) => {
                    count += 1;
                    if (result.body.content != '') {
                      appFunc.iAkaunActTNCEN = result.body;
                    }
                  },(err: HttpErrorResponse) => {
                    appFunc.message = "HttpError";
                    appFunc.code = "ESB Error, Failed to get iAkaun Activation TnC.";
                    this.route.navigate(['outofservice']);
                  });
                  //Get iShariah Contract BM
                  this._aldanService.GetContract(
                    'bm'
                  )
                  .subscribe((result: any) => {
                    count += 1;
                    if (result.body.content != '') {
                      appFunc.iShariahTNCBM = result.body;
                    }
                  }, (err: HttpErrorResponse) => {
                    appFunc.message = "HttpError";
                    appFunc.code = "ESB Error, Failed to get iShariah Contract.";
                    this.route.navigate(['outofservice']);
                  });
                  //Get iShariah Contract
                  this._aldanService.GetContract(
                    'en'
                  )
                  .subscribe((result: any) => {
                    count += 1;
                    if (result.body.content != '') {
                      appFunc.iShariahTNCEN = result.body;
                    }
                  }, (err: HttpErrorResponse) => {
                    appFunc.message = "HttpError";
                    appFunc.code = "ESB Error, Failed to get iShariah Contract.";
                    this.route.navigate(['outofservice']);
                  });

                  let checkCount = setInterval(() => {
                    if(count == 7){
                      clearInterval(checkCount);
                      this.route.navigate(['verifyMyKad']);
                    }
                  }, 1000);
                  
                }
                //Mac Address Doesn't Match
                else {
                  appFunc.message = 'Unauthorized';
                  appFunc.code = "This Kiosk is registered under a different Serial. Please contact Support.";
                  this.route.navigate(['outofservice']);
                }
              }
            }
          });
      },(err: HttpErrorResponse) => {
        appFunc.message = 'Unauthorized';
        appFunc.code = "Kiosk Failed to get token from SSDM. Please contact Support";
        this.route.navigate(['outofservice']);
      });
  }

  startConnection(): void {
    this.dotInterval = setInterval(() => {
      this.dots += '.';
      if (this.dots == '........') {
        this.dots = '.';
      }
    }, 400);

    if (signalRConnection.connection == undefined) {
      this._signalR.connect().then((c) => {
        console.log('API King is now Connected on ' + formatDate(new Date(), 'hh:mm:ss', 'en'));
        signalRConnection.connection = c;

        signalRConnection.connection.invoke('GetKioskCode').then((data: string) => {
          signalRConnection.kioskCode = data;
        });
        signalRConnection.connection.invoke('isAdapterEmpty').then((data: boolean) => {
          this.isAdapterEmpty = data;
        });
        signalRConnection.connection.invoke('GetAdapterName').then((data: any[]) => {
          signalRConnection.adapter = data;
          this.adapters = data;
          if (this.isAdapterEmpty) {
            this.login(this.Secret)
          }
          else {
            this.login(signalRConnection.adapter[0].adapterNameEncrypted)
          }
        });
      }).catch((err: any) => {
        appFunc.message = 'Unauthorized';
        appFunc.code = "SignalR Server has not started. Please contact Support.";
        this.route.navigate(['outofservice']);
      });
    }
    else {
      this.route.navigate(['verifyMyKad']);
    }
  }

  selectedAdapter(event: any) {
    if (event.target.value != '') {
      this.selectedAdapterValueEncrypted = event.target.value;
      this.isSelectedAdapter = true;
    }
    else {
      this.isSelectedAdapter = false;
    }
  }

  SelectAdapterNext() {
    this.adapters.forEach((element: adapter) => {
      if (element.adapterNameEncrypted == this.selectedAdapterValueEncrypted) this.selectedAdapterValue = element.adapterName;
    });

    const kioskRegisterBody = {
      'MacAddress': this.selectedAdapterValue
    }

    this._aldanService
      .registerKiosk(
        signalRConnection.kioskInformation.id.toString(), 
        kioskRegisterBody
      )
      .toPromise().then((result: any) => {
        if (result.body) {
          signalRConnection.connection.invoke('UpdateAdapter', this.selectedAdapterValue).then((data: boolean) => {
            if (data) {
              if (!this.format.test(this.selectedAdapterValueEncrypted)) {
                this.selectedAdapterValueEncrypted = this.selectedAdapterValueEncrypted.concat('=');
              }
              const changepasswordBody = {
                'currentPassword': this.Secret,
                'newPassword': this.selectedAdapterValueEncrypted
              }
              this._aldanService
                .changePassword(changepasswordBody)
                .subscribe((response: any) => {
                  if (response.status.toString() == '204') {
                    this.SelectAdapter = false;
                    this.SuccessRegister = true;

                    let secondInterval = setInterval(() => {
                      this.seconds -= 1;
                      if (this.seconds == 0) {
                        clearInterval(secondInterval);
                        this.route.navigate(['verifyMyKad']);
                      }
                    }, 1000);
                  }
                  else {
                    appFunc.message = 'Failed Change Password for Kiosk.';
                    this.route.navigate(['outofservice']);
                  }
                });
            }
            else {
              appFunc.message = 'Failed Update Adapter.';
              this.route.navigate(['outofservice']);
            }
          });
        }
        else {
          appFunc.message = 'Failed Register Kiosk';
          this.route.navigate(['outofservice']);
        }
      })
  }

  AdminLoginClick() {
    if (this.username?.nativeElement.value == this.UserName && this.password?.nativeElement.value == this.Password) {
      this.AdminLogin = false;
      this.SelectAdapter = true;
    }
  }

}
