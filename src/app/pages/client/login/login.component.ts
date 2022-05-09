import { map } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  loading: boolean;
  verifyError: string;
  loginError: boolean;
  usernameControl = new FormControl("", [Validators.required]);

  passwordControl = new FormControl("", [Validators.required]);

  constructor(
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router
  ) {
    userService.user$.subscribe((res) => {
      if (res !== null) {
        this.router.navigate(["/member/dashboard"]);
      }
    });
    this.username = "";
    this.password = "";
    this.loading = false;
    this.verifyError = "";
    this.loginError = false;
  }

  ngOnInit(): void {}

  async login() {
    try {
      if (this.usernameControl.valid && this.passwordControl.valid) {
        await this.userService
          .login(this.username, this.password)
          .pipe(
            map((res) => {
              if (res.status) {
                localStorage.setItem("token", res.token);
                this.profile();
                this.snackbar.open("وارد شدید", null, {
                  verticalPosition: "bottom",
                  horizontalPosition: "center",
                  duration: 4000,
                });
                this.router.navigate(["/member/dashboard"]);
              }
            })
          )
          .toPromise();
      }
    } catch (error) {
      if (!!error.error.message) {
        this.loginError = true;
      }
      console.log(error);
    }
  }

  // گرفتن پروفایل کاربر
  profile() {
    this.userService.profile().subscribe(
      (res) => {
        this.userService.user$.next(res.user);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
