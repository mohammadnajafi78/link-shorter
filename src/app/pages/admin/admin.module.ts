import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ShareModule } from "../../share.module";
import { AdminTemplateComponent } from "../../templates/admin-template/admin-template.component";
import { UsersComponent } from "./users/users.component";
import { LinksComponent } from "./links/links.component";
import { WithdrawsComponent } from "./withdraws/withdraws.component";
import { TicketsComponent } from "./tickets/tickets.component";
import { HomeComponent } from "./home/home.component";
import { AdsComponent, AdsDialog } from "./ads/ads.component";
import { TicketDetailComponent } from "./ticket-detail/ticket-detail.component";
import { WithdrawsDetailComponent } from "./withdraws-detail/withdraws-detail.component";
import { Guard } from "src/app/utils/gaurd";
import { SuccessDialogComponent } from "src/app/components/success-dialog/success-dialog.component";
import { SettingComponent, HandleCPC } from "./setting/setting.component";
import { WithdrawMethodComponent } from "./withdraw-method/withdraw-method.component";
import { AdsModifyComponent } from "./ads-modify/ads-modify.component";
import { NotificationComponent } from "./notification/notification.component";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { NotificationModifyComponent } from "./notification-modify/notification-modify.component";
import { NotFoundComponent } from "../client/not-found/not-found.component";
import { EditUserComponent } from "./edit-user/edit-user.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [Guard],
    component: AdminTemplateComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: "users", component: UsersComponent },
      { path: "links", component: LinksComponent },
      { path: "withdraws", component: WithdrawsComponent },
      { path: "withdraws/:id", component: WithdrawsDetailComponent },
      { path: "tickets", component: TicketsComponent },
      { path: "ticket/:id", component: TicketDetailComponent },
      { path: "ads", component: AdsComponent },
      { path: "setting", component: SettingComponent },
      { path: "notifications", component: NotificationComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AdminTemplateComponent,
    UsersComponent,
    HomeComponent,
    LinksComponent,
    WithdrawsComponent,
    WithdrawsDetailComponent,
    TicketsComponent,
    TicketDetailComponent,
    AdsComponent,
    SuccessDialogComponent,
    SettingComponent,
    WithdrawMethodComponent,
    HandleCPC,
    AdsModifyComponent,
    AdsDialog,
    NotificationComponent,
    NotificationModifyComponent,
    EditUserComponent,
  ],

  imports: [
    AngularEditorModule,
    CommonModule,
    ShareModule,
    RouterModule.forChild(routes),
  ],
})
export class AdminModule {}
