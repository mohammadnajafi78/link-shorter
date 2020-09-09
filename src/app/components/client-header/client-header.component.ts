import { Component, Input, OnInit } from "@angular/core";
import { UserDto } from "../../models/user.dto";
import { UserService } from "../../services/user.service";
import { BreakpointObserver } from "@angular/cdk/layout";
import { SettingService } from "../../services/setting.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-client-header",
  templateUrl: "./client-header.component.html",
  styleUrls: ["./client-header.component.scss"],
})
export class ClientHeaderComponent implements OnInit {
  isSmallScreen = false;
  user: UserDto;

  constructor(
    public userService: UserService,
    private breakpointObserver: BreakpointObserver,
    public settingService: SettingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.isSmallScreen = this.breakpointObserver.isMatched(
      "(max-width: 768px)"
    );
  }

  openLink(commands: any[]) {
    this.router.navigate(commands);
    // this.settingService.drawer$.next(false);
  }
}
