import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-check-balance',
  templateUrl: './check-balance.component.html',
  styleUrls: ['./check-balance.component.css']
})
export class CheckBalanceComponent implements OnInit {

  page1 = true;
  page2 = false;
  page3 = false;
  page4 = false;
  page5 = false;
  page6 = false;

  totalSavings = "520000.30";

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
  }

  page1yes(){
    this.page1 = false;
    this.page2 = true;
  }

  page1no(){
    this.route.navigate(['mainMenu']);
  }

  select2018(){
    this.page2 = false;
    this.page3 = true;
  }
  select2019(){
    this.page2 = false;
    this.page3 = true;
  }
  select2020(){
    this.page2 = false;
    this.page3 = true;
  }
  select2021(){
    this.page2 = false;
    this.page3 = true;
  }

  page3no(){
    this.page3 = false;
    this.page2 = true;
  }

  page3yes(){
    this.page3 = false;
    this.page4 = true;
  }

  page4no(){
    this.page4 = false;
    this.page3 = true;
  }

  page4yes(){
    this.page4 = false;
    this.page5 = true;
  }

  page5yes(){
    this.route.navigate(['mainMenu']);
  }

  page6yes(){
    this.route.navigate(['mainMenu']);
  }

}
