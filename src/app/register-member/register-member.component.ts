import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


declare const loadKeyboard: any;
declare const deleteKeyboard: any;
declare const closeKeyboard: any;

@Component({
  selector: 'app-register-member',
  templateUrl: './register-member.component.html',
  styleUrls: ['./register-member.component.css']
})
export class RegisterMemberComponent implements OnInit {

  RegKWSP = true;
  RegShariah = false;
  RegSaraan = false;
  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;
  page5 = false;
  page6 = false;
  page7 = false;
  page8 = false;
  page9 = false;
  page10 = false;
  page11 = false;

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
  }

  ngAfterViewInit(){
    loadKeyboard();
  }

  loadPage2(){
    this.page1 = false;
    this.page2 = true;

  }

}