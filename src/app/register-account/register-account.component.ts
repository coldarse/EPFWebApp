import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css']
})
export class RegisterAccountComponent implements OnInit {


  constructor(  
    private route: Router,
    private translate: TranslateService) { 
  
  }

  ngOnInit(): void {
    this.translate.use('en');
  }
}
