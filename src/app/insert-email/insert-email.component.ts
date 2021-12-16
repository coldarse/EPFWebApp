import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-insert-email',
  templateUrl: './insert-email.component.html',
  styleUrls: ['./insert-email.component.css']
})
export class InsertEmailComponent implements OnInit {

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
  }

}
