import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SignalR } from 'ng2-signalr';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { signalRConnection } from '../_models/_signalRConnection';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  x: Number = 0;

  


  constructor(
    private _signalR: SignalR,
    private route: Router,
    private translate: TranslateService,
  ) {
    this.startConnection();
  }

  ngOnInit(): void {
  }

  

  startConnection() : void {
    this._signalR.connect().then((c) => {
      signalRConnection.connection = c;
      console.log("SignalR Connection is now established! " + formatDate(new Date(), 'HH:MM:ss', 'en'));
      this.route.navigate(['newComponent']);
    }).catch((err: any) => {
      //Catch Error
    });
  }

}
