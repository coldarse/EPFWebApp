import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-i-saraan-shariah-savings-registration',
  templateUrl: './i-saraan-shariah-savings-registration.component.html',
  styleUrls: ['./i-saraan-shariah-savings-registration.component.css']
})
export class ISaraanShariahSavingsRegistrationComponent implements OnInit {

  RegSaraanShariah = true;
  RegShariah = false;
  RegSaraan = false;
  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;
  page5 = false;

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
  }

  clickSaraan(){
    this.RegSaraanShariah = false;
    this.RegSaraan = true;
    this.page1 = false;
    this.page2 = true;
  }

  clickShariah(){
    this.RegSaraanShariah = false;
    this.RegShariah = true;
    this.page1 = false;
    this.page4 = true;
  }

  page2yes(){
    this.page2 = false;
    this.page3 = true;
  }

  page2no(){
    this.RegSaraanShariah = true;
    this.RegSaraan = false;
    this.page2 = false;
    this.page1 = true;
  }

  page4yes(){
    this.page4 = false;
    this.page5 = true;
  }

  page4no(){
    this.RegSaraanShariah = true;
    this.RegShariah = false;
    this.page4 = false;
    this.page1 = true;
  }

  page3yes(){
    this.route.navigate(['mainMenu']);
  }

  page5yes(){
    this.route.navigate(['mainMenu']);
  }

}
