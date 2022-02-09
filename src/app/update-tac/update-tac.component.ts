import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { appFunc } from '../_models/_appFunc';
import { signalRConnection } from '../_models/_signalRConnection';

@Component({
  selector: 'app-update-tac',
  templateUrl: './update-tac.component.html',
  styleUrls: ['./update-tac.component.css']
})
export class UpdateTACComponent implements OnInit {

  page1 = true;
  page2 = false;
  page3 = false;
  Failed = false;
  phoneNo = "";

  phoneError = false;


  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');
  }

  page1yes(){
    this.phoneError = false;
    if(this.phoneNo.length < 10){
      this.phoneError = true;
    }
    else{
      this.page1 = false;
      this.page2 = true;
    }
  }

  page1no(){
    this.route.navigate(['mainMenu']);
  }

  page2yes(){
    if(appFunc.bypassAPI != true){
      const updateTACBody = {
        "custNum": appFunc.currMemberDetail.cifNum,
        "tacMobilePhoneCode": "TA",
        "tacMobilePhone": this.phoneNo,
        "amendmentChannel": "SAO",
        "status": "P",
        "checkForDuplicate": "N",
        "generateRequestNum": "N",
        "requestNum": ""
      }

      this._aldanService.UpdateTAC(updateTACBody).subscribe((result: any) => {
        if(result.responseCode == "0"){
          this.page2 = false;
          this.page3 = true;
        }
        else{
          this.Failed = true;
        }
      });
    }
    else{
      this.page2 = false;
      this.page3 = true;
    }
  }

  page2no(){
    this.page2 = false;
    this.page1 = true;
  }

  page3yes(){
    this.route.navigate(['mainMenu']);
  }

  click1(){
    if(this.phoneNo.length < 10) this.phoneNo += "1";
  }

  click2(){
    if(this.phoneNo.length < 10) this.phoneNo += "2";
  }

  click3(){
    if(this.phoneNo.length < 10) this.phoneNo += "3";
  }

  click4(){
    if(this.phoneNo.length < 10) this.phoneNo += "4";
  }

  click5(){
    if(this.phoneNo.length < 10) this.phoneNo += "5";
  }

  click6(){
    if(this.phoneNo.length < 10) this.phoneNo += "6";
  }

  click7(){
    if(this.phoneNo.length < 10) this.phoneNo += "7";
  }

  click8(){
    if(this.phoneNo.length < 10) this.phoneNo += "8";
  }

  click9(){
    if(this.phoneNo.length < 10) this.phoneNo += "9";
  }

  click0(){
    if(this.phoneNo.length < 10) this.phoneNo += "0";
  }

  clickDel(){
    this.phoneNo = this.phoneNo.substring(0, this.phoneNo.length - 1);
  }

  failedYes(){
    this.route.navigate(['mainMenu']);
  }

}
