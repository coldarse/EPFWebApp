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
  page1 = false;
  page2 = false;
  page3 = false;
  page4 = false;
  page5 = true;

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
  }

}
