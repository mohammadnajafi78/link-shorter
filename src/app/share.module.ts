import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./material.module";
import { JalaaliPipe } from "./pipes/jalaali.pipe";
import { DialogComponent } from "./components/dialog/dialog.component";
import { PricePipe } from "./pipes/price.pipe";
import { SettingService } from "./services/setting.service";
import { LinkPipe } from "./pipes/link.pipe";
import { VjsComponent } from "./components/vjs/vjs.component";
import {
  RecaptchaModule,
  RECAPTCHA_SETTINGS,
  RecaptchaSettings,
} from "ng-recaptcha";
import { NgCircleProgressModule } from "ng-circle-progress";

const component = [DialogComponent];

@NgModule({
  entryComponents: [...component],
  declarations: [...component, JalaaliPipe, PricePipe, LinkPipe, VjsComponent],
  imports: [FormsModule, ReactiveFormsModule, MaterialModule, RecaptchaModule],
  providers: [
    SettingService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: "6Lem8MEZAAAAALptdpuoMsTnoCaNpbrWv6Yj5MJd",
      } as RecaptchaSettings,
    },
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    JalaaliPipe,
    PricePipe,
    LinkPipe,
    MaterialModule,
    VjsComponent,
    RecaptchaModule,
  ],
})
export class ShareModule {}
