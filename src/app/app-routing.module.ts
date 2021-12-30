import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyMyKadComponent } from './verify-my-kad/verify-my-kad.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RegisterMemberComponent } from './register-member/register-member.component';
import { CheckBalanceComponent } from './check-balance/check-balance.component';
import { UpdateTACComponent } from './update-tac/update-tac.component';
import { ThumbprintConfirmationComponent } from './thumbprint-confirmation/thumbprint-confirmation.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { IAkaunRegistrationComponent } from './i-akaun-registration/i-akaun-registration.component';
import { ISaraanShariahSavingsRegistrationComponent } from './i-saraan-shariah-savings-registration/i-saraan-shariah-savings-registration.component';

const routes: Routes = [
  {path: '', redirectTo: '/verifyMyKad', pathMatch: 'full'},
  {path: 'verifyMyKad', component: VerifyMyKadComponent},
  {path: 'mainMenu', component: MainMenuComponent},
  {path: 'registerMember', component: RegisterMemberComponent},
  {path: 'checkBalance', component: CheckBalanceComponent},
  {path: 'updateTAC', component: UpdateTACComponent},
  {path: 'thumbprintConfirmation', component: ThumbprintConfirmationComponent},
  {path: 'personalInformation', component: PersonalInformationComponent},
  {path: 'iAkaunRegistration', component: IAkaunRegistrationComponent},
  {path: 'iSaraanShariahSavingsRegistration', component: ISaraanShariahSavingsRegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
