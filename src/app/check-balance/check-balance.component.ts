import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { appFunc } from '../_models/_appFunc';

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

  totalSavings = 520000.30;
  grandTotal = 0;
  contributionsTotal = 0;

  currentContributions = 17280.00;

  sDetails: any[] = [];
  cDetails: any[] = [];

  constructor(
    private route: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use('bm');

    //Call API

    //Assign into arrays

    this.sDetails.push(
      {
        accountType: "Akaun Emas",
        openingBalance: 224931.29,
        in: 1953.33,
        out: 0.00,
        yearlyDividend: 0.00,
        totalAmount: 226884.23
      }
    );
    this.sDetails.push(
      {
        accountType: "Akaun 2",
        openingBalance: 224931.29,
        in: 1953.33,
        out: 0.00,
        yearlyDividend: 0.00,
        totalAmount: 226884.23
      }
    );
    this.sDetails.push(
      {
        accountType: "Akaun 1",
        openingBalance: 224931.29,
        in: 1953.33,
        out: 0.00,
        yearlyDividend: 0.00,
        totalAmount: 226884.23
      }
    );
    this.sDetails.push(
      {
        accountType: "Akaun Emas",
        openingBalance: 224931.29,
        in: 1953.33,
        out: 0.00,
        yearlyDividend: 0.00,
        totalAmount: 226884.23
      }
    );
    this.sDetails.push(
      {
        accountType: "Akaun Emas",
        openingBalance: 224931.29,
        in: 1953.33,
        out: 0.00,
        yearlyDividend: 0.00,
        totalAmount: 226884.23
      }
    );
    this.sDetails.push(
      {
        accountType: "Akaun Pengeluaran Bayaran Bulanan",
        openingBalance: 224931.29,
        in: 1953.33,
        out: 0.00,
        yearlyDividend: 0.00,
        totalAmount: 226884.23
      }
    );





    this.cDetails.push(
      {
        month: "Jan-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );

    this.cDetails.push(
      {
        month: "Feb-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );

    this.cDetails.push(
      {
        month: "Mar-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );

    this.cDetails.push(
      {
        month: "Apr-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );

    this.cDetails.push(
      {
        month: "Mei-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );

    this.cDetails.push(
      {
        month: "Jun-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );


    this.cDetails.push(
      {
        month: "Jul-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );

    this.cDetails.push(
      {
        month: "Ogs-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );

    this.cDetails.push(
      {
        month: "Sep-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );

    this.cDetails.push(
      {
        month: "Oct-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );

    this.cDetails.push(
      {
        month: "Nov-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );

    this.cDetails.push(
      {
        month: "Dec-21",
        transaction: "Caruman-IWS",
        date: "14/01/2021",
        employerContributions: 1040.00,
        memberContributions: 880.00,
        totalAmount: 1920.00
      }
    );

    this.sDetails.forEach((details: any) => {
      this.grandTotal += details.totalAmount;
    });

    this.cDetails.forEach((details: any) => {
      this.contributionsTotal += details.totalAmount;
    });
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
