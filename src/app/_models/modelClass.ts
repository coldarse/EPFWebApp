import { NumberValueAccessor } from "@angular/forms";
import { VirtualTimeScheduler } from "rxjs";

// Services Provided in the Kiosk
export class eModules {
	moduleID: number;
	moduleName: string;
	operationStart: Date;
	operationEnd: Date;
	enabled: boolean;
	
	constructor(emodule: any){
		this.moduleID = emodule.moduleID;
		this.moduleName = emodule.moduleName;
		this.operationStart = emodule.operationStart;
		this.operationEnd = emodule.operationEnd;
		this.enabled = emodule.enable;
	}
}

// Business Type for i-Saraan
export class businessTypes {
	id: number;
	code: string;
	description: string;

	constructor(type: any){
		this.id = type.id;
		this.code = type.code;
		this.description = type.description;
	}
}

// Adapter Name
export class adapter{
	adapterName: string;
	adapterNameEncrypted: string;

	constructor(adapter: any){
		this.adapterName = adapter.adapterName;
		this.adapterNameEncrypted = adapter.adapterNameEncrypted;
	}
}

// Token
export class Token{
	token_type: string;
	token_access: string;

	constructor(token: any){
		this.token_type = token.token_type;
		this.token_access = token.token_access;
	}
}

export class isFromCheckBalance{
	value: boolean;

	constructor(from: any){
		this.value = from.value;
	}
}


// KioskInformation
export class kioskInformation{
	code: string;
	version: string;
	agentVersion: string;
	downloadAgentVersion: string;
	statusVersion: string;
	description: string;
	ip: string;
	serialNumber: string;
	lastHeartBeat: Date;
	status: string;
	heartbeatInMins: string;
	isActive: string;
	isAllowRegister: string;
	macAddress: string;
	remark: string;
	isDeleted: boolean;
	id: number;

	constructor(kioskInfo: any){
		this.code = kioskInfo.code;
		this.version = kioskInfo.version;
		this.agentVersion = kioskInfo.agentVersion;
		this.downloadAgentVersion = kioskInfo.downloadAgentVersion;
		this.statusVersion = kioskInfo.statusVersion;
		this.description = kioskInfo.description;
		this.ip = kioskInfo.ip;
		this.serialNumber = kioskInfo.serialNumber;
		this.lastHeartBeat = kioskInfo.lastHeartBeat;
		this.status = kioskInfo.status;
		this.heartbeatInMins = kioskInfo.heartbeatInMins;
		this.isActive = kioskInfo.isActive;
		this.isAllowRegister = kioskInfo.isAllowRegister;
		this.macAddress = kioskInfo.macAddress;
		this.remark = kioskInfo.remark;
		this.isDeleted = kioskInfo.isDeleted;
		this.id = kioskInfo.id;
	}
}
