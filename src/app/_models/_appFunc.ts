
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { businessTypes, eModules } from './modelClass';
import { currentMemberDetails, currMemberDetails } from './_currentMemberDetails';
import { eWithdrawalDetails, eWithdrawalLists, withdrawalApplLists } from './_eWithdrawalDetails';
import { signalRConnection } from './_signalRConnection';

@Injectable({
    providedIn: 'root',
})

export class appFunc {
    static MemberDetail: currentMemberDetails;
    static currMemberDetail: currMemberDetails;
    static eWithdrawalDetail: eWithdrawalDetails;
    static eWithdrawalList: eWithdrawalLists;
    static withdrawalApplList: withdrawalApplLists[];
    static isVerifyMyKad = false;
    static screenSaver: string;
    static screenSaverList: string[];
    static isEmptySSList = false
    static bypassAPI = false;
    static modules: eModules[];
    static businessTypes: businessTypes[];
    static sessionId: number;
    static stateCode: string;

    static code: string;
    static message: string;
    static FromCheckBalance = false;
    static endSession = false;

    static thumbprintRetry: number = 3;
    static iAkaunActivationPerDay: number;
    static minCharForPassword: number;
    static updateTACPerMonth: number;
    static NumberOfYearsViewStatement: number;
    static AgeRangeLow: number;
    static AgeRangeHigh: number;

    static isFromStartupGetToken = true;
    static isFromOperationHour = false;
    static dataForEmail: any;
    static totalSavingsForEmail: any;
    static openingBalanceTotal: any;
    static dividendTotal: any;
    static sDetails: any[];
    static cDetails: any[];
    static wDetails: any[];
    static oDetails: any[];
    static summaryDetails: any;
    static transactionAmtForAcc1: any;
    static CurrYears = new Date().getFullYear();
    static COWDetails: any;
    static CDetails: any;
    static allCategoryBody: any;
    static selectedYear: number;

    static isInfoPopUp = false;

    static resubmission = 'N';
    static resubmissionNo = '';

    static iAkaunActTNCBM: any;
    static iAkaunActTNCEN: any;
    static iShariahTNCBM: any;
    static iShariahTNCEN: any;

    static operationHour: any;
    


    static Reset(){
        this.MemberDetail = {} as currentMemberDetails;
        this.currMemberDetail = {} as currMemberDetails;
        this.eWithdrawalDetail = {} as eWithdrawalDetails;
        this.withdrawalApplList = [];
        this.isVerifyMyKad = false;
        this.sessionId = 0;
        this.stateCode = "";
        this.dataForEmail = undefined;
        this.totalSavingsForEmail = undefined;
        this.openingBalanceTotal = undefined;
        this.dividendTotal = undefined;
        this.sDetails = [];
        this.cDetails = [];
        this.wDetails = [];
        this.oDetails = [];
        this.summaryDetails = undefined;
        this.transactionAmtForAcc1 = undefined;
        this.resubmission = 'N';
        this.resubmissionNo = '';
    }

    
    // Check if current time is between Start and End time.
    // Returns true or false.
    static isInBetween(startDateTime: Date, stopDateTime: Date, current: Date): Boolean {
        if (current.getTime() >= startDateTime.getTime() && current.getTime() <= stopDateTime.getTime()){
            return true;
        }
        return false;
    }

    static convertTo2Length(value: number){
        let valueinString = value.toString();
        if(valueinString.length != 2){
            valueinString = "0" + valueinString;
        }
        return valueinString;
    }

    static getCurrentTime() {
        var today = new Date();
        let hours = this.convertTo2Length(today.getHours());
        let mins = this.convertTo2Length(today.getMinutes());
        let secs = this.convertTo2Length(today.getSeconds());

        var time = hours + ":" + mins + ":" + secs;
        return time;
    }

    static checkIfWithinOperationHours(): boolean{
        if(this.isInBetween(new Date("0001-01-01T" + appFunc.operationHour[0].operationStart + ":00"), new Date("0001-01-01T" + appFunc.operationHour[0].operationEnd + ":00"), new Date("0001-01-01T" + this.getCurrentTime()))){
            //Is within Operation Hour
            return true;
        }
        else{
            return false;
        }
    }

    // Loop through all modules to they are available.
    // Returns 0 if no modules are enabled.
    static checkModuleAvailability(modules: eModules[]) : Number{
        let count = 0;
        for (var val of modules){
            if(val.enabled == true){
                if(this.isInBetween(new Date("0001-01-01T" + val.operationStart + ":00"), new Date("0001-01-01T" + val.operationEnd + ":00"), new Date("0001-01-01T" + this.getCurrentTime()))){
                    count += 1;
                }
            }
        }
        return count;
    }

    // Loop through all modules to check number of disabled modules.
    // Returns x number of disabled modules.
    static checkNoOfDisabledModules(modules: eModules[]) : Number{
        let count = 0;
        for (var val of modules){
            if(val.enabled == false){
                count += 1;
            }
        }
        return count;
    }

    // Check if MyKad is detected.
    // Return true or false.
    static DetectMyKad() : Boolean{
        return signalRConnection.connection.invoke('IsCardDetected').then((data: boolean) => {
            signalRConnection.isCardInserted = data;
        });
    }

    // Calculates the age based on the given Birth Date.
    // Returns age.
    static calculateAge(birthdate: Date) : Number{
        let age = 0;
        var timeDiff = Math.abs(Date.now() - new Date(birthdate).getTime());
        age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
        return age;
    }

    static isEmail(search:string) : boolean{
        const regexp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regexp.test(search);
    }

    // Translates month to malay month.
    // Returns translated month.
    static translateMonthToBM(month: string) : string{
        if(month.includes("Mar")){
            return month.replace("Mar", "Mac");
        }
        else if(month.includes("May")){
            return month.replace("May", "Mei");
        }
        else if(month.includes("Aug")){
            return month.replace("Aug", "Ogs");
        }
        else if(month.includes("Oct")){
            return month.replace("Oct", "Okt");
        }
        else if(month.includes("Dec")){
            return month.replace("Dec", "Dis");
        }
        else{
            return month;
        }
    }
}