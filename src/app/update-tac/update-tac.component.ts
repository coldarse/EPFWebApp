import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-update-tac',
  templateUrl: './update-tac.component.html',
  styleUrls: ['./update-tac.component.css']
})
export class UpdateTACComponent implements OnInit {

  page1 = true;
  page2 = false;
  page3 = false;

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

  page2yes(){
    this.page2 = false;
    this.page3 = true;
  }

  page2no(){
    this.page2 = false;
    this.page1 = true;
  }

  page3yes(){
    this.route.navigate(['mainMenu']);
  }

}
