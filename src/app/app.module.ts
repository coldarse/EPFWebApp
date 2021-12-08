import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SignalRConfiguration, SignalRModule } from 'ng2-signalr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { currentMyKadDetails } from './_models/_currentMyKadDetails';
import { LanguageComponent } from './language/language.component';
import { signalRConnection } from './_models/_signalRConnection';
import { VerifyMyKadComponent } from './verify-my-kad/verify-my-kad.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { JsonAppConfigService } from './config/json-app-config.service';

export function createConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  c.hubName = 'MyMessageHub';
  c.qs = { user: 'aldan' }
  c.url = 'http://localhost:8081/';
  c.logging = true;

  
  // >= v5.0.0
  c.executeEventsInZone = true; // optional, default is true
  c.executeErrorsInZone = false; // optional, default is false
  c.executeStatusChangeInZone = true; // optional, default is true
  return c;
}

// export function initializerFn(jsonAppConfigService: JsonAppConfigService) {
//   return () => {
//     return jsonAppConfigService.load();
//   };
// }

@NgModule({
  declarations: [
    AppComponent,
    LanguageComponent,
    VerifyMyKadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    SignalRModule.forRoot(createConfig),
  ],
  providers: [
    currentMyKadDetails,
    signalRConnection,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/translate/", suffix: ".json" },
  ]);
}
