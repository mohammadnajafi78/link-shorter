import { Component, ViewChild } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "src/app/services/user.service";
import { UserDto } from "src/app/models/user.dto";
import { Router } from "@angular/router";
import { LinkModifyComponent } from "../../components/link-modify/link-modify.component";

@Component({
  selector: "app-dashboard-template",
  templateUrl: "./dashboard-template.component.html",
  styleUrls: ["./dashboard-template.component.scss"],
})
export class DashboardTemplateComponent {
  @ViewChild("drawer") drawer;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  routes = [
    { path: "/member/dashboard", title: "داشبورد", icon: "home" },
    { path: "/member/dashboard/links", title: "لینک ها", icon: "link" },
    {
      path: "/member/dashboard/withdraws",
      title: "برداشت ها",
      icon: "attach_money",
    },
    {
      path: "/member/dashboard/subset",
      title: "زیر مجموعه",
      icon: "supervisor_account",
    },
    // {
    //   path: "/member/dashboard/full",
    //   title: "کد جاوا اسکریپت",
    //   icon: "code",
    // },
    { path: "/member/dashboard/profile", title: "پروفایل", icon: "person" },
    {
      path: "/member/dashboard/support",
      title: "پشتیبانی",
      icon: "local_offer",
    },
    {
      path: "/member/dashboard/support/messages",
      title: "پیام ها",
      icon: "mail_outline",
    },
  ];

  user: UserDto = {};

  constructor(
    private breakpointObserver: BreakpointObserver,
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly router: Router
  ) {
    this.user = userService.user$.getValue();
  }

  closeNav() {
    this.isHandset$.subscribe((res) => {
      if (res) {
        this.drawer.close();
      }
    });
  }

  openDialog() {
    if (this.user.status !== "block") {
      this.dialog.open(LinkModifyComponent, {
        width: "400px",
      });
    }
  }

  signOut() {
    localStorage.removeItem("token");
    this.userService.user$.next(null);
    this.router.navigate(["/"]);
  }
}
