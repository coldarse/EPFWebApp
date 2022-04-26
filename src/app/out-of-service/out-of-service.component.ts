import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    private translate: TranslateService
    ) { }

  ngOnInit(): void {
    this.translate.use(selectLang.selectedLang);
    this.XXX1 = appFunc.code;
    this.XXX2 = appFunc.code;

    this.EM1 = appFunc.message;
    this.readerIntervalId = setInterval(() => {
      appFunc.DetectMyKad();
      if(!signalRConnection.isCardInserted) {
        this.route.navigate(['verifyMyKad']);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.readerIntervalId);
  }

}
