
import { Injectable } from '@angular/core';
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
    static bypassAPI = true;
    static modules: eModules[];
    static businessTypes: businessTypes[];

    static code: string;
    static message: string;

    // Check if current time is between Start and End time.
    // Returns true or false.
    static isInBetween(startDateTime: Date, stopDateTime: Date, current: Date): Boolean {
        if (current.getTime() >= startDateTime.getTime() && current.getTime() <= stopDateTime.getTime()){
            return true;
        }
        return false;
    }

    // Loop through all modules to they are available.
    // Returns 0 if no modules are enabled.
    static checkModuleAvailability(modules: eModules[]) : Number{
        let count = 0;
        for (var val of modules){
            if(val.enabled == true){
                if(appFunc.isInBetween(new Date(val.operationStart), new Date(val.operationEnd), new Date())){
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
            signalRConnection.cardDetect = data;
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