
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { businessTypes, eModules } from './modelClass';
import { currentMemberDetails, currMemberDetails } from './_currentMemberDetails';
import { signalRConnection } from './_signalRConnection';

@Injectable({
    providedIn: 'root',
})

export class appFunc {
    static MemberDetail: currentMemberDetails;
    static currMemberDetail: currMemberDetails;
    static isVerifyMyKad = false;
    static screenSaver: string;
    static screenSaverList: string[];
    static isEmptySSList = false
    static bypassAPI = false;
    static modules: eModules[];
    static businessTypes: businessTypes[];
    static sessionId: number;

    static code: string;
    static message: string;
    static FromCheckBalance = false;
    static endSession = false;

    static thumbprintRetry: number;
    static iAkaunActivationPerDay: number;
    static minCharForPassword: number;
    static updateTACPerMonth: number;
    static NumberOfYearsViewStatement: number;

    
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
}