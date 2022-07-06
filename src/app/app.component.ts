import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appFunc } from './_models/_appFunc';
import { signalRConnection } from './_models/_signalRConnection';
import { AldanService } from './shared/aldan.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'EPFWebApp';

  constructor(
    private route: Router,
    private _aldanService: AldanService
  ){}

  readMyKadInterval: any;

  ngOnInit() {
    this.readMyKadInterval = setInterval(() => {
      if (
        this.route.url === '/outofservice' ||
        this.route.url === '/startup'      ||
        this.route.url === '/verifyMyKad'  
      ){
        //no need detect mykad
      }
      else{
        appFunc.DetectMyKad();
        if (!signalRConnection.isCardInserted){
          this._aldanService.EndSession(appFunc.sessionId, {KioskId: signalRConnection.kioskCode}).subscribe((result: any) => {});
          appFunc.Reset();
          this.route.navigate(['/startup']);
        }
      }
    }, 1000);
  }
}
