import { formatDate, getLocaleDayNames } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map, retry, mergeMap as _observableMergeMap, delay, timeout} from 'rxjs/operators';
import { AppConfiguration } from '../config/app-configuration';
import { accessToken } from '../_models/token';
import { signalRConnection } from '../_models/_signalRConnection';
import { selectLang } from '../_models/language';

@Injectable({ 
  providedIn: 'root'
})
export class AldanService {

  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  // KMS API Url
  url: any; 
  // For getting token
  clientid: any;
  clientsecret: any;
  granttype: any;
  

  constructor(
    private http: HttpClient,
    private router: Router,
    private appConfig: AppConfiguration
    ) {
        this.url = appConfig.AldanAPIURL;
        this.clientid = appConfig.Client_Id;
        this.clientsecret = appConfig.Client_Secret;
        this.granttype = appConfig.Grant_Type;
    }

  private handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      //signalRConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:mm:ss a', 'en') + " " + "WebApp Component [Service Service]" + ": " + `An error occured: ${error.error.message}.`);
    } 
    else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
        //signalRConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Service Service]" + ": " + `Backend returned code: ${error.status}, body was: ${error.error}.`);
    }
    // Return an observable with a user-facing error message.
    // return throwError(
    //   'Something bad happened; please try again later.');
    return throwError(
      error);
  }


  //--------------* FOR EXAMPLE PURPOSES *--------------//

  //POST Example
  postExample(body: any){
    return this.http.post(
      this.url + "services/app/Example/ExamplePost",
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //GET Example
  getExample(code: string){
    return this.http.get(
      this.url + `services/app/Example/ExampleGet?Code=${code}`,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //PUT Example
  putExample(body: any)
  {
    return this.http.put(
      this.url + "services/app/Example/ExamplePut",
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //--------------* EXAMPLE ENDS *--------------//


  //--------------* FOR KIOSK INITIALIZATION *--------------//

  getToken(computerName: string, adapterName: string){
    // const header = new Headers();
    // header.append('Content-Type', 'application/x-www-form-urlencoded');
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});

    let body = `client_id=${this.clientid}&client_secret=${this.clientsecret}&grant_type=${this.granttype}&username=${computerName}&password=${adapterName}`;

    let Options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    };

    let authUrl = this.url.replace("api/", "");
    

    return this.http.post(
      authUrl + 'connect/token', 
      body,
      Options
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  verifyKiosk(kioskCode: string){
    return this.http.get(
      this.url + `app/kiosks/Verify/${kioskCode}`,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  registerKiosk(kioskid: string, body: any){
    return this.http.post(
      this.url + `app/kiosks/Register/${kioskid}`,
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  changePassword(body: any){

    const Options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + accessToken.token
      }),
      observe: 'response' as 'body'
    };
    return this.http.post(
      this.url + 'identity/my-profile/change-password',
      body,
      Options
    ).pipe(
      map(data => {
        return data
      })
    )
  }

  //--------------* KIOSK INITIALIZATION END *--------------//



  //--------------* API FUNCTIONS *--------------//

  //GetTranslations
  getTranslations(){
    return this.http.get(
      this.url + 'app/application-translations?FilterText=%20&Key=%20&Translation1=%20&Translation2=%20&Sorting=%20&SkipCount=0&MaxResultCount=1000',
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Create Session
  CreateSession(body: any){
    return this.http.post(
      this.url + 'app/client-sessions',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //End Session
  EndSession(sessionid: number, body: any){
    return this.http.put(
      this.url + 'app/client-sessions/' + sessionid,
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }
  
  //Member CIF Details
  MemberCIFDetailsCheck(body: any){
    return this.http.post(
      this.url + 'MemberDetailInquiry/CIF',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Member Registration
  MemberRegistration(body: any, language: string){
    return this.http.post(
      this.url + 'Registration/MemberRegistration?language=' + language,
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Prepare PDF Report
  PreparePDF(body: any){
    return this.http.post(
      this.url + 'Registration/MemberRegistration/DataSetMemberRegistration',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //i-Shariah Registration
  iShariahRegistration(body: any){
    return this.http.post(
      this.url + 'IShariahRegistration/iShariahReg',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //i-Saraan Registration
  iSaraanRegistration(body: any){
    return this.http.post(
      this.url + 'ISaraanRegistration/ISaraanReg',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      map(data => {
        return data
      }),
      catchError(this.handleError),
    )
  }

  //i-Akaun Registration
  iAkaunRegistration(icno: string, custName: string, mobilePhone: string, emailAdd: string, language: string, body: any){
    return this.http.post(
      this.url + `IAkaunRegistration/IAkaunReg?IdNum=${icno}&custName=${custName}&mobilePhone=${mobilePhone}&emailAdd=${emailAdd}&language=${language}`,
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Member Statement
  MemberStatement(body: any){
    return this.http.post(
      this.url + 'MemberAccount/MemberStatement',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Member Summary Statement
  MemberSummaryStatement(body: any){
    return this.http.post(
      this.url + 'MemberAccount/MemberSummaryStatement',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Email for Member Statement
  EmailForMemberStatement(emailAdd: string, sessionid: number, body: any){
    return this.http.post(
      this.url + `MemberAccount/MemberStatement/EmailForMemberStatement?emailAdd=${emailAdd}&sessionID=${sessionid}`,
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Member Profile Info
  MemberProfileInfo(body: any){
    return this.http.post(
      this.url + 'MemberProfile/MemberProfileInfo',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Member Profile Contact Maintenance
  MemberProfileContactMaintenance(body: any){
    return this.http.post(
      this.url + 'MemberProfile/MemberProfileContactMaintenance',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Member Profile Address Maintenance
  MemberProfileAddressMaintenance(body: any){
    return this.http.post(
      this.url + 'MemberProfile/MemberProfileAddressMaintenance',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Add TAC
  AddTAC(body: any){
    return this.http.post(
      this.url + 'TAC/AddTAC',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Update TAC
  UpdateTAC(body: any){
    return this.http.post(
      this.url + 'TAC/UpdateTAC',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Get Operation Time
  GetOperationTime(kioskCode: string){
    return this.http.post(
      this.url + `app/operation-settings/GetOperation?KioskCode=${kioskCode}`,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Get Service Operation
  GetServiceOperation(kioskCode: string){
    return this.http.get(
      this.url + `app/services/GetServiceOperation?KioskCode=${kioskCode}`,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Get Business Types List
  GetBusinessTypes(){
    return this.http.get(
      this.url + 'app/business-types/GetAllList',
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //Get Client Settings from KMS
  GetClientSettings(){
    const response1 = this.http.get(this.url + 'app/client-settings/1', accessToken.httpOptions); //Get Thumbprint Retry
    const response2 = this.http.get(this.url + 'app/client-settings/2', accessToken.httpOptions); //Get number of IAkaun Activation Per Day
    const response3 = this.http.get(this.url + 'app/client-settings/9', accessToken.httpOptions); //Get min chars for password
    const response4 = this.http.get(this.url + 'app/client-settings/24', accessToken.httpOptions); //Get number of Update TAC per month
    const response5 = this.http.get(this.url + 'app/client-settings/57', accessToken.httpOptions); //Get number of years for statements

    return forkJoin([
      response1.pipe(retry(1), catchError(this.handleError)),
      response2.pipe(delay(3000),retry(1), catchError(this.handleError)),
      response3.pipe(delay(3000),retry(1), catchError(this.handleError)),
      response4.pipe(delay(3000),retry(1), catchError(this.handleError)),
      response5.pipe(delay(3000),retry(1), catchError(this.handleError)),
    ])
  }

  UpdateFullProfile(body1: any, body2: any){
    const response1 = this.http.post(this.url + 'MemberProfile/MemberProfileContactMaintenance', body1, accessToken.httpOptions);
    const response2 = this.http.post(this.url + 'MemberProfile/MemberProfileAddressMaintenance', body2, accessToken.httpOptions);

    return forkJoin([
      response1.pipe(retry(1), catchError(this.handleError)),
      response2.pipe(delay(3000),retry(1), catchError(this.handleError)),
    ]);
  }

  GetSecureImage(sessionid: number){
    return this.http.get(
      this.url + `IAkaunActivation/iAkaunAct/GetSecureImage?SessionId=${sessionid}`,
      accessToken.httpOptions
      ).pipe(
        retry(1),
        catchError(this.handleError),
      )
  }

  GetTnC(locale: string, sessionid: number){
    return this.http.get(
      this.url + `IAkaunActivation/iAkaunAct/GetTnC?SessionId=${sessionid}&locale=${locale}`,
      accessToken.httpOptions
      ).pipe(
        retry(1),
        catchError(this.handleError),
      )
  }

  ActivateIAkaun(body: any){
    return this.http.post(
      this.url + `IAkaunActivation/iAkaunAct`,
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  GetContract(locale: string, sessionid: number){
    return this.http.get(
      this.url + `IShariahRegistration/iShariahReg/GetContract?SessionId=${sessionid}&locale=${locale}`,
      accessToken.httpOptions
      ).pipe(
        retry(1),
        catchError(this.handleError),
      )
  }


  //--------------* API FUNCTIONS END *--------------//
}
