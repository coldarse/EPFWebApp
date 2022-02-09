import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SignalRConfiguration, SignalRModule } from 'ng2-signalr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { currentMyKadDetails } from './_models/_currentMyKadDetails';
import { signalRConnection } from './_models/_signalRConnection';
import { VerifyMyKadComponent } from './verify-my-kad/verify-my-kad.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RegisterMemberComponent } from './register-member/register-member.component';
import { CheckBalanceComponent } from './check-balance/check-balance.component';
import { UpdateTACComponent } from './update-tac/update-tac.component';
import { ThumbprintConfirmationComponent } from './thumbprint-confirmation/thumbprint-confirmation.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { IAkaunRegistrationComponent } from './i-akaun-registration/i-akaun-registration.component';
import { ISaraanShariahSavingsRegistrationComponent } from './i-saraan-shariah-savings-registration/i-saraan-shariah-savings-registration.component';

import { AppConfiguration } from './config/app-configuration';
import { JsonAppConfigService } from './config/json-app-config.service';
import { accessToken } from './_models/token';
import { ScreensaverComponent } from './screensaver/screensaver.component';
// import { JsonAppConfigService } from './config/json-app-config.service';

export function createConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  c.hubName = 'MyMessageHub';
  c.qs = { user: 'aldan' }
  //c.url = 'http://localhost:44373';
  c.url = 'http://localhost:8081/';
  c.logging = true;
  

  
  // >= v5.0.0
  c.executeEventsInZone = true; // optional, default is true
  c.executeErrorsInZone = false; // optional, default is false
  c.executeStatusChangeInZone = true; // optional, default is true
  return c;
}

export function initializerFn(jsonAppConfigService: JsonAppConfigService) {
  return () => {
    return jsonAppConfigService.load();
  };
}
@NgModule({
  declarations: [
    AppComponent,
    VerifyMyKadComponent,
    MainMenuComponent,
    RegisterMemberComponent,
    CheckBalanceComponent,
    UpdateTACComponent,
    ThumbprintConfirmationComponent,
    PersonalInformationComponent,
    IAkaunRegistrationComponent,
    ISaraanShariahSavingsRegistrationComponent,
    ScreensaverComponent,
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
    accessToken,
    {
      provide: AppConfiguration,
      deps: [HttpClient],
      useExisting: JsonAppConfigService
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [JsonAppConfigService],
      useFactory: initializerFn
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/translate/", suffix: ".json" },
  ]);
}
