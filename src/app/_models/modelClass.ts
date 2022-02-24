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
