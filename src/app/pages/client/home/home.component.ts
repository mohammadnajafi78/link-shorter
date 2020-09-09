import { Component, OnInit } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { LinkService } from "src/app/services/link.service";
import { LinkDto } from "src/app/models/link.dto";
import { UserService } from "src/app/services/user.service";
import { UserDto } from "src/app/models/user.dto";
import { map } from "rxjs/operators";
import { FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  isSmallScreen: boolean;
  link: LinkDto;
  newLink: LinkDto;
  user: UserDto;
  url: string = environment.url;
  linkControl = new FormControl("", [
    Validators.required,
    Validators.pattern(
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    ),
  ]);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private readonly linkService: LinkService,
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar
  ) {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.isSmallScreen = false;
    this.link = {};
    this.newLink = {};
  }

  openCopySnack() {
    this.snackbar.open("لینک کپی شد", null, {
      verticalPosition: "top",
      horizontalPosition: "center",
      duration: 1000,
      direction: "rtl",
    });
  }

  // ایجاد لینک کوتاه
  async createLink(captchaResponse: string) {
    if (captchaResponse !== null) {
      try {
        // آیا لینک وارد شده است
        if (this.linkControl.hasError("required")) {
          this.snackbar.open("لینک الزامی است", null, {
            verticalPosition: "bottom",
            horizontalPosition: "center",
            duration: 5000,
            direction: "rtl",
          });
        } else if (this.linkControl.hasError("pattern")) {
          // آیا لینک مشکل الگو دارد؟
          if (this.linkControl.hasError("pattern")) {
            this.snackbar.open("لینک معتبر وارد کنید", null, {
              verticalPosition: "bottom",
              horizontalPosition: "center",
              duration: 5000,
              direction: "rtl",
            });
          }
        } else if (this.link.mainLink.includes(this.url.substr(8))) {
          this.snackbar.open("اجازه وارد کردن این دامنه را ندارید", null, {
            verticalPosition: "bottom",
            horizontalPosition: "center",
            duration: 5000,
            direction: "rtl",
          });
          this.link = {};
        } else if (this.user.status === "block") {
          this.snackbar.open("شما بلاک شده اید", null, {
            verticalPosition: "bottom",
            horizontalPosition: "center",
            duration: 5000,
            direction: "rtl",
          });
          this.link = {};
        } else {
          if (this.user !== null) {
            this.link.user = this.user._id;
            this.link.showAds = true;
          }
          await this.linkService
            .createLink(this.link)
            .pipe(
              map((res) => {
                this.newLink = res.link;
                this.link = {};
              })
            )
            .toPromise();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  resolved(captchaResponse: string, id: string) {
    console.log(captchaResponse);
  }

  ngOnInit(): void {
    this.isSmallScreen = this.breakpointObserver.isMatched(
      "(max-width: 768px)"
    );
  }
}
