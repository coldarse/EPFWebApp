import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageComponent } from './language/language.component';
import { RegisterAccountComponent } from './register-account/register-account.component';
import { VerifyMyKadComponent } from './verify-my-kad/verify-my-kad.component';

const routes: Routes = [
  {path: '', redirectTo: '/language', pathMatch: 'full'},
  {path: 'language', component: LanguageComponent},
  {path: 'verifyMyKad', component: VerifyMyKadComponent},
  {path: 'registerAccount', component: RegisterAccountComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
