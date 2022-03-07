import { formatDate } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  url: any; // Using Alibaba Development Swagger
  receipturl: any;


  constructor(
    private http: HttpClient,
    private router: Router,
    private appConfig: AppConfiguration
    ) {
        this.url = appConfig.AldanDevURL; 
        this.receipturl = appConfig.AldanReceiptURL;
    }

  private handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      signalRConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Service Service]" + ": " + `An error occured: ${error.error.message}.`);
    } 
    else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
        signalRConnection.logsaves.push(formatDate(new Date(), 'M/d/yyyy h:MM:ss a', 'en') + " " + "WebApp Component [Service Service]" + ": " + `Backend returned code: ${error.status}, body was: ${error.error}.`);
    }
    // Return an observable with a user-facing error message.
    // return throwError(
    //   'Something bad happened; please try again later.');
    return throwError(
      error);
  }

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
  MemberRegistration(body: any){
    return this.http.post(
      this.url + 'Registration/MemberRegistration',
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
      this.url + 'Registration/IShariahRegistratione',
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
      this.url + 'Registration/ISaraanRegistration',
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  //i-Akaun Registration
  iAkaunRegistration(body: any){
    return this.http.post(
      this.url + 'Registration/IAkaunRegistration',
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
    return this.http.post(
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

  UpdateFullProfile(body1: any, body2: any){
    const response1 = this.http.post(this.url + 'MemberProfile/MemberProfileContactMaintenance', body1, accessToken.httpOptions);
    const response2 = this.http.post(this.url + 'MemberProfile/MemberProfileAddressMaintenance', body2, accessToken.httpOptions);

    return forkJoin([
      response1.pipe(retry(1), catchError(this.handleError)),
      response2.pipe(delay(3000),retry(1), catchError(this.handleError)),
    ]);
  }

  GetSecureImage(){
    return this.http.get(
      this.url + 'IAkaunActivation/iAkaunAct/GetSecureImage',
      accessToken.httpOptions
      ).pipe(
        retry(1),
        catchError(this.handleError),
      )
  }

  GetTnC(locale: string){
    return this.http.get(
      this.url + 'IAkaunActivation/iAkaunAct/GetTnC' + selectLang.selectedLang,
      accessToken.httpOptions
      ).pipe(
        retry(1),
        catchError(this.handleError),
      )
  }

  ActivateIAkaun(body: any){
    return this.http.put(
      this.url + "IAkaunActivation/iAkaunAct/",
      body,
      accessToken.httpOptions
    ).pipe(
      retry(1),
      catchError(this.handleError),
    )
  }
}
