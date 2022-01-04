import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare const loadKeyboard: any;

@Component({
  selector: 'app-i-akaun-registration',
  templateUrl: './i-akaun-registration.component.html',
  styleUrls: ['./i-akaun-registration.component.css']
})
export class IAkaunRegistrationComponent implements OnInit {
  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;
  page5 = false;
  page6 = false;
  page7 = false;
  page8 = false;

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

  page1yes(){
    this.page1 = false;
    this.page2 = true;
  }

  page1no(){
    this.route.navigate(['mainMenu']);
  }

  page2yes(){
    this.page2 = false;
    this.page3 = true;
  }

  page2no(){
    this.page2 = false;
    this.page1 = true;
  }

  page3yes(){
    this.page3 = false;
    this.page4 = true;
  }

  page3no(){
    this.page3 = false;
    this.page2 = true;
  }

  page4yes(){
    this.page4 = false;
    this.page5 = true;
  }

  page4no(){
    this.route.navigate(['mainMenu']);
  }

  page5yes(){
    this.page5 = false;
    this.page6 = true;
  }

  page5no(){
    this.page5 = false;
    this.page4 = true;
  }

  page6yes(){
    this.page6 = false;
    this.page7 = true;
  }

  page6no(){
    this.page6 = false;
    this.page5 = true;
  }

  page7yes(){
    this.page7 = false;
    this.page8 = true;
  }

  page7no(){
    this.page7 = false;
    this.page6 = true;
  }

  page8yes(){
    this.route.navigate(['iSaraanShariahSavingsRegistration']);
  }

  page8no(){
    this.route.navigate(['mainMenu']);
  }

}
