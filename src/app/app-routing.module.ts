import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageComponent } from './language/language.component';
import { RegisterAccountComponent } from './register-account/register-account.component';
import { VerifyMyKadComponent } from './verify-my-kad/verify-my-kad.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RegisterMemberComponent } from './register-member/register-member.component';
import { CheckBalanceComponent } from './check-balance/check-balance.component';
import { UpdateTACComponent } from './update-tac/update-tac.component';
import { ThumbprintConfirmationComponent } from './thumbprint-confirmation/thumbprint-confirmation.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { IAkaunRegistrationComponent } from './i-akaun-registration/i-akaun-registration.component';

const routes: Routes = [
  {path: '', redirectTo: '/language', pathMatch: 'full'},
  {path: 'language', component: LanguageComponent},
  {path: 'verifyMyKad', component: VerifyMyKadComponent},
  {path: 'registerAccount', component: RegisterAccountComponent},
  {path: 'mainMenu', component: MainMenuComponent},
  {path: 'registerMember', component: RegisterMemberComponent},
  {path: 'checkBalance', component: CheckBalanceComponent},
  {path: 'updateTAC', component: UpdateTACComponent},
  {path: 'thumbprintConfirmation', component: ThumbprintConfirmationComponent},
  {path: 'personalInformation', component: PersonalInformationComponent},
  {path: 'iAkaunRegistration', component: IAkaunRegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
