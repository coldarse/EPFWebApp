import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-update-tac',
  templateUrl: './update-tac.component.html',
  styleUrls: ['./update-tac.component.css']
})
export class UpdateTACComponent implements OnInit {

  page1 = false;
  page2 = false;
  page3 = true;

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
  }

}
