import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignalR } from 'ng2-signalr';
import { signalRConnection } from '../_models/_signalRConnection';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  constructor(
    private _signalR: SignalR,
    private route: Router,
  ) {
    this.startConnection();
  }

  ngOnInit(): void {
  }

  startConnection() : void {
    this._signalR.connect().then((c) => {
      signalRConnection.connection = c;
      console.log("SignalR Connection is now established! " + formatDate(new Date(), 'HH:MM:ss', 'en'));
      this.route.navigate(['verifyMyKad']);
    }).catch((err: any) => {
      //Catch Error
    });
  }

}
