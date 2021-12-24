import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-i-akaun-registration',
  templateUrl: './i-akaun-registration.component.html',
  styleUrls: ['./i-akaun-registration.component.css']
})
export class IAkaunRegistrationComponent implements OnInit {
  page1 = true;

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
  }

}
