import { BlockGaurd } from "./utils/blockGaurd";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { APP_BASE_HREF } from "@angular/common";
import { environment } from "../environments/environment";
import { MyHttpInterceptor } from "./utils/http.interceptor";
import { UserService } from "./services/user.service";
import { LinkService } from "./services/link.service";
import { WithdrawsService } from "./services/withdraws.service";
import { TicketService } from "./services/ticket.service";
import { Guard } from "./utils/gaurd";
import { DashboardGuard } from "./utils/dashboardGuard";
import { SettingService } from "./services/setting.service";
import { UploadService } from "./services/upload.service";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // RecaptchaModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: environment.base },
    { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true },
    Guard,
    DashboardGuard,
    BlockGaurd,
    LinkService,
    WithdrawsService,
    TicketService,
    UserService,
    SettingService,
    UploadService,
  ],
  // exports: [RecaptchaModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
