import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { adapter, kioskInformation } from './modelClass';

@Injectable({
    providedIn: 'root',
})

export class signalRConnection {
    static connection: any;
    static cardDetect: boolean;
    static logsaves: string[];
    static kioskCode: string;
    static adapter: adapter[];
    static kioskID: string;
    static trxno : string;
    static isHardcodedIC : boolean;
    static kioskType: string;
    static branchName: string;
    static kioskInformation: kioskInformation;
}
