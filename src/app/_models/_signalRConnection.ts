import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class signalRConnection {
    static connection: any;
    static cardDetect: boolean;
    static logsaves: string[];
    static kioskCode: string;
    static kioskID: string;
    static trxno : string;
    static isHardcodedIC : boolean;
    static kioskType: string;
    static branchName: string;
}
