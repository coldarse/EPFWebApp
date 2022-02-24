import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor() { }

  ngOnInit(): void {
    this.XXX1 = appFunc.code;
    this.XXX2 = appFunc.code;

    this.EM1 = appFunc.message;
  }

}
