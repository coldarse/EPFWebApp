import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { appFunc } from '../_models/_appFunc';
import { signalRConnection } from '../_models/_signalRConnection';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent implements OnInit {

  Selections = false;
  withdrawal55yo = true;

  checked55yo = false;

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
  }

  SelectionsNo(){
    this.route.navigate(['mainMenu']);
  }

  SelectionsYes(){
    let x = 0;
    if(this.checked55yo == false) x++;

    if(x > 0) this.Selections= true;
    else {
      this.Selections = false;
      this.withdrawal55yo = true;
    }
  }

  check55yo(){
    this.checked55yo = !this.checked55yo;
  }

}
