import { Injectable } from '@angular/core';
import { AppConfiguration } from './app-configuration';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JsonAppConfigService extends AppConfiguration {

  constructor(private http: HttpClient) {
    super();
  }

  // This function needs to return a promise
  load() {
    return this.http.get<AppConfiguration>('app.config.json')
      .toPromise()
      .then(data => {
        this.AldanAPIURL = data.AldanAPIURL;
        this.AESCrpytKey = data.AESCrpytKey;
        this.idletime = Number(data.idletime);
        this.popuptime = Number(data.popuptime);
      })
      .catch(() => {
        console.error('Could not load configuration');
      });
  }
}

