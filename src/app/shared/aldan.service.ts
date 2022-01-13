import { formatDate } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, map, retry, mergeMap as _observableMergeMap, delay, timeout} from 'rxjs/operators';
import { AppConfiguration } from '../config/app-configuration';
import { accessToken } from '../_models/token';
import { signalRConnection } from '../_models/_signalRConnection';

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

}
