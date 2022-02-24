import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AldanService } from '../shared/aldan.service';
import { selectLang } from '../_models/language';
import { businessTypes } from '../_models/modelClass';
import { appFunc } from '../_models/_appFunc';
import { currentMyKadDetails } from '../_models/_currentMyKadDetails';
import { signalRConnection } from '../_models/_signalRConnection';

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
  Failed = false;

  xagreedTnc = true;

  defaultDDL = "";
  selectedJobSector: any = undefined;
  currentLang = "bm"

  // jobSectors = [
  //   { name: "agriculture", id: 1, malay: "Pertanian", english: "Pertanian" },
  //   { name: "retired", id: 2, malay: "Pekerja berpencen", english: "Pekerja berpencen" },
  //   { name: "business", id: 3, malay: "Perniagaan", english: "Perniagaan" },
  //   { name: "aquaculture", id: 4, malay: "Akuakultur/Penangkapan ikan", english: "Akuakultur/Penangkapan ikan" },
  //   { name: "transport", id: 5, malay: "Transportasi", english: "Transportasi" },
  //   { name: "sales", id: 6, malay: "Agen jualan", english: "Agen jualan" },
  //   { name: "artist", id: 7, malay: "Seniman/Kreatif", english: "Seniman/Kreatif" },
  //   { name: "housewife", id: 8, malay: "Suri rumah", english: "Suri rumah" },
  //   { name: "prof", id: 9, malay: "Profesional", english: "Profesional" },
  //   { name: "service", id: 10, malay: "Perkhidmatan", english: "Perkhidmatan" },
  //   { name: "gig", id: 11, malay: "Pekerjaan gig", english: "Pekerjaan gig" },
  //   { name: "other", id: 12, malay: "Yang lain", english: "Yang lain" },
  // ]
  jobSectors: businessTypes[] = []

  constructor(
    private route: Router,
    private translate: TranslateService,
    private _aldanService: AldanService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');

    this.jobSectors = appFunc.businessTypes;

    this.currentLang = selectLang.selectedLang;
    if(selectLang.selectedLang == 'bm'){
      this.defaultDDL = "Sila pilih daripada pilihan berikut";
    }else{
      this.defaultDDL = "Sila pilih daripada pilihan berikut";
    }
  }

  selectJob(jobSector: any){
    this.defaultDDL = jobSector.description;//(this.currentLang == "bm" ? jobSector.malay : jobSector.english);
    this.selectedJobSector = jobSector;
  }

  clickTNC(){
    this.xagreedTnc = !this.xagreedTnc;
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
    if(this.selectedJobSector == undefined){

    }
    else{
      if(appFunc.bypassAPI != true){
        const iSaraanBody = {
          "idNum": currentMyKadDetails.ICNo,
          "idType": currentMyKadDetails.CategoryType,
          "businessTypeCode": this.selectedJobSector.code,
          "remark": "",
          "sourceRegistrationChannel": "SST",
          "applicationReceivedDate": formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          "sourceCreationID": "SST",
          "sourceTerminalID": "SST",
          "sourceBranchNo": "0"
        }

        this._aldanService.iSaraanRegistration(iSaraanBody).subscribe((result: any) => {
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
    
  }

  page2no(){
    this.RegSaraanShariah = true;
    this.RegSaraan = false;
    this.page2 = false;
    this.page1 = true;
  }

  page4yes(){

    if(appFunc.bypassAPI != true){
      const iShariahBody = {
        "custNum": appFunc.currMemberDetail.cifNum,//this.KWSPCustomerNo,
        "accNum": appFunc.currMemberDetail.accNum,//this.KWSPMemberNo,
        "accType": "S",
        "electChannel": "SAO",
        "electReceivedDate": formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        "electReceivedTime": formatDate(new Date(), 'h:MM:ss', 'en'),
        "electReceivedBranch": "1",
        "electDate": "2019-10-11",
        "electBranch": "1",
        "electStatus": "A",
        "reasonCode": "",
        "akadRefNum": "",
        "docRefNum": ""
      }

      this._aldanService.iShariahRegistration(iShariahBody).subscribe((result:any) => {
        if(result.responseCode == "0"){

          this.page4 = false;
          this.page5 = true;

        }
        else{
          this.Failed = true;
        }
      });
    }
    else{
      this.page4 = false;
      this.page5 = true;
    }
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

  failedYes(){
    this.route.navigate(['mainMenu']);
  }

}
