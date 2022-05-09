import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ShareModule } from "../../share.module";
import { HomeComponent } from "./home/home.component";
import { ClientTemplateComponent } from "src/app/templates/client-template/client-template.component";
import { ShortLinkComponent } from "./short-link/short-link.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ClientHeaderComponent } from "../../components/client-header/client-header.component";
import { RefComponent } from "./ref/ref.component";
import { ClientFooterComponent } from "../../components/client-footer/client-footer.component";
import { RulesComponent } from "./rules/rules.component";
import { NgCircleProgressModule } from "ng-circle-progress";
import { SignupComponent } from "./signup/signup.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { VerifyComponent } from "./verify/verify.component";

const routes: Routes = [
  {
    path: "",
    component: ClientTemplateComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: ":shortLink", component: ShortLinkComponent },
      { path: "user/rules", component: RulesComponent },
      { path: "page/not-found", component: NotFoundComponent },
    ],
  },
  { path: "user/login", component: LoginComponent },
  { path: "user/signup", component: SignupComponent },
  { path: "ref/:identifier", component: RefComponent },
  { path: "user/forget-password", component: ForgetPasswordComponent },
  { path: "email/verify/:code", component: VerifyComponent },
];

@NgModule({
  declarations: [
    ClientTemplateComponent,
    LoginComponent,
    HomeComponent,
    ShortLinkComponent,
    NotFoundComponent,
    ClientHeaderComponent,
    RefComponent,
    ClientFooterComponent,
    RulesComponent,
    SignupComponent,
    ForgetPasswordComponent,
    VerifyComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ShareModule,
    NgCircleProgressModule.forRoot(),
  ],
})
export class ClientModule {}
