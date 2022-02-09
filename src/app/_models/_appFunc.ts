
import { Injectable } from '@angular/core';
import { currentMemberDetails, currMemberDetails } from './_currentMemberDetails';

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
}