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
  state: "phone" | "key";
  phone: string;
  key: string;
  loading: boolean;
  verifyError: string;

  phoneControl = new FormControl("", [
    Validators.required,
    Validators.pattern(/0?[1-9][0-9]{9}/),
  ]);

  keyControl = new FormControl("", [
    Validators.required,
    Validators.pattern(/[0-9]{6}/),
  ]);

  constructor(
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router
  ) {
    userService.user$.subscribe((res) => {
      if (res !== null) {
        this.router.navigate(["/"]);
      }
    });
    this.phone = "";
    this.key = "";
    this.state = "phone";
    this.loading = false;
    this.verifyError = "";
  }

  ngOnInit(): void {}

  // ارسال شماره همراه برای ارسال کد
  signin() {
    if (this.phoneControl.invalid) {
      return false;
    }
    this.loading = true;
    if (this.phone.startsWith("0")) {
      this.phone = this.phone.substr(1);
    }
    const identifier = localStorage.getItem("identifier");
    this.userService.signin(this.phone, identifier).subscribe(
      (res) => {
        if (res.status) {
          this.state = "key";
          this.loading = false;
        }
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  // اعتبار سنجی کد
  verify() {
    if (this.keyControl.invalid) {
      return false;
    }
    this.loading = true;
    this.userService.verify(this.phone, this.key).subscribe(
      (res) => {
        localStorage.setItem("token", res.token);

        this.snackbar.open(res.message, null, {
          verticalPosition: "bottom",
          horizontalPosition: "center",
          duration: 3000,
          direction: "rtl",
        });
        this.profile();
        this.router.navigate(["/member/dashboard"]);
      },
      (err) => {
        this.loading = false;
        this.verifyError = err.error.message;
        console.log(err.error.message);
      }
    );
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
