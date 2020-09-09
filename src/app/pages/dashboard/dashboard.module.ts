import { FullComponent } from "./full/full.component";
import { BlockGaurd } from "./../../utils/blockGaurd";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShareModule } from "src/app/share.module";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { DashboardTemplateComponent } from "src/app/templates/dashboard-template/dashboard-template.component";
import { DashboardGuard } from "src/app/utils/dashboardGuard";
import { LinksComponent } from "./links/links.component";
import { UserComponent } from "./user/user.component";
import { TicketService } from "src/app/services/ticket.service";
import { WithdrawsComponent } from "./withdraws/withdraws.component";
import { WithdrawsModifyComponent } from "./withdraws-modify/withdraws-modify.component";
import { LinkDetailComponent } from "./link-detail/link-detail.component";
import { SubsetComponent } from "./subset/subset.component";
import { LinkModifyComponent } from "../../components/link-modify/link-modify.component";
import { TicketComponent } from "./ticket/ticket.component";
import { MessagesComponent } from "./messages/messages.component";
import { TicketDetailComponent } from "./ticket-detail/ticket-detail.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardTemplateComponent,
    canActivate: [DashboardGuard],
    children: [
      { path: "", component: HomeComponent },
      { path: "links", component: LinksComponent },
      { path: "link/:id", component: LinkDetailComponent },
      { path: "profile", component: UserComponent },
      { path: "withdraws", component: WithdrawsComponent },
      { path: "subset", component: SubsetComponent },
      // { path: "full", component: FullComponent },
      { path: "withdraws-modify", component: WithdrawsModifyComponent },
    ],
  },
  {
    path: "support",
    component: DashboardTemplateComponent,
    canActivate: [BlockGaurd],
    children: [
      { path: "", component: TicketComponent },
      { path: "messages", component: MessagesComponent },
      { path: ":id", component: TicketDetailComponent },
    ],
  },
];

@NgModule({
  declarations: [
    DashboardTemplateComponent,
    HomeComponent,
    LinksComponent,
    UserComponent,
    WithdrawsComponent,
    WithdrawsModifyComponent,
    LinkDetailComponent,
    SubsetComponent,
    LinkModifyComponent,
    TicketComponent,
    MessagesComponent,
    TicketDetailComponent,
    FullComponent,
  ],
  imports: [CommonModule, ShareModule, RouterModule.forChild(routes)],
})
export class DashboardModule {}
