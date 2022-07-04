import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { appFunc } from '../_models/_appFunc';
import { signalRConnection } from '../_models/_signalRConnection';

@Component({
  selector: 'app-out-of-service',
  templateUrl: './out-of-service.component.html',
  styleUrls: ['./out-of-service.component.css']
})
export class OutOfServiceComponent implements OnInit {

  XXX1 = "";
  XXX2 = "";
  EM1 = "";

  readerIntervalId: any;

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
    ) { }

  ngOnInit(): void {

    this.translate.use(selectLang.selectedLang);
    this.XXX1 = appFunc.code;
    this.EM1 = appFunc.message;

    if(!appFunc.isFromStartupGetToken){
      this.readerIntervalId = setInterval(() => {
        appFunc.DetectMyKad();
        if(!signalRConnection.isCardInserted) {
          this._aldanService.EndSession(appFunc.sessionId, {KioskId: signalRConnection.kioskCode}).subscribe((result: any) => {});
          appFunc.Reset();
          this.route.navigate(['/startup']);
        }
      }, 1000);
    }
    else if(appFunc.isFromOperationHour){
      let moduleIntervelId = setInterval(() => {
        const count = appFunc.checkModuleAvailability(appFunc.modules);
        if (count != 0){
          appFunc.isFromStartupGetToken = false;
          appFunc.isFromOperationHour = false;
          this.route.navigate(['/startup']);
        }
      }, 1000);
    }
    else{
      setTimeout(() => {
        this._aldanService.EndSession(appFunc.sessionId, {KioskId: signalRConnection.kioskCode}).subscribe((result: any) => {});
        appFunc.Reset();
        signalRConnection.connection = undefined;
        this.route.navigate(['/startup']);
      }, 300000)
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.readerIntervalId);
  }

}
