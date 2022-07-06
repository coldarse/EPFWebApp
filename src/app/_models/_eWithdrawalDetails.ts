export class eWithdrawalDetails {
     accNum : string;
     applReferenceNo : string;
     schemeCode : string;
     schemeDescription : string;
     paymentMode : string;
     bankAccNo : string;
     bankName : string;
     dividenYear : string;
     recurringStartDate : string;
     recurringEndDate : string;
     applStatus : string;
     paymentFrequency : string;
     monthlyInstalmentAmt : string;
     lastMonthDifferenceAmt : string;
     totalRecurringAmt : string;
     paymentFrequencyCode : string;

    constructor(eWDetails: any){
        this.accNum = eWDetails.accNum;
        this.applReferenceNo = eWDetails.applReferenceNo;
        this.schemeCode = eWDetails.schemeCode;
        this.schemeDescription = eWDetails.schemeDescription;
        this.paymentMode = eWDetails.paymentMode;
        this.bankAccNo = eWDetails.bankAccNo;
        this.bankName = eWDetails.bankName;
        this.dividenYear = eWDetails.dividenYear;
        this.recurringStartDate = eWDetails.recurringStartDate;
        this.recurringEndDate = eWDetails.recurringEndDate;
        this.applStatus = eWDetails.applStatus;
        this.paymentFrequency = eWDetails.paymentFrequency;
        this.monthlyInstalmentAmt = eWDetails.monthlyInstalmentAmt;
        this.lastMonthDifferenceAmt = eWDetails.lastMonthDifferenceAmt;
        this.totalRecurringAmt = eWDetails.totalRecurringAmt;
        this.paymentFrequencyCode = eWDetails.paymentFrequencyCode;
    }
}