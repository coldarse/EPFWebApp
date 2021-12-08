export class myKadData{
    Name : string;
    ICNo : string;
    OldICNo : string;
    DOB : Date;
    POB : string;
    Gender : string;
    Citizenship : string;
    IssueDate : Date;
    Race : string;
    Religion : string;
    Address1 : string;
    Address2 : string;
    Address3 : string;
    PostCode : string;
    City : string;
    State : string;
    Country : string;
    Address : string;
    RJ : string;
    KT : string;
    GreenCardNationality : string;
    GreenCardExpiryDate : Date;
    CardVersion : string;
    OtherID : string;
    CategoryType : string;

    constructor(data: any){
        this.Name = data.Name;
        this.ICNo = data.ICNo;
        this.OldICNo = data.OldICNo;
        this.DOB = data.DOB;
        this.POB = data.POB;
        this.Gender = data.Gender;
        this.Citizenship = data.Citizenship;
        this.IssueDate = data.IssueDate;
        this.Race = data.Race;
        this.Religion = data.Religion;
        this.Address1 = data.Address1;
        this.Address2 = data.Address2;
        this.Address3 = data.Address3;
        this.PostCode = data.PostCode;
        this.City = data.City;
        this.State = data.State;
        this.Country = data.Country;
        this.Address = data.Address;
        this.RJ = data.RJ;
        this.KT = data.KT;
        this.GreenCardNationality = data.GreenCardNationality;
        this.GreenCardExpiryDate = data.GreenCardExpiryDate;
        this.CardVersion = data.CardVersion;
        this.OtherID = data.OtherID;
        this.CategoryType = data.CategoryType;
	}
}