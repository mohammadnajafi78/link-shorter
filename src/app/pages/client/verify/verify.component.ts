import { map } from "rxjs/operators";
import { UserService } from "src/app/services/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-verify",
  templateUrl: "./verify.component.html",
  styleUrls: ["./verify.component.scss"],
})
export class VerifyComponent implements OnInit {
  passwordControl = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
  ]);

  confirmPasswordControl = new FormControl("", [Validators.required]);

  password: string;
  confirnPassword: string;
  code: string;
  showForm: boolean;
  loading: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar
  ) {
    this.showForm = false;
    this.route.paramMap.subscribe((params) => {
      this.code = params.get("code");
      this.verifyPassword();
    });
  }

  ngOnInit(): void {}

  async changePassword() {
    try {
      if (this.passwordControl.valid && this.confirmPasswordControl.valid) {
        if (this.password === this.confirnPassword) {
          await this.userService
            .changePassword(this.code, this.password)
            .pipe(
              map((res) => {
                if (res.status) {
                  this.snackbar.open("رمز عبور با موفقیت ویرایش شد", null, {
                    verticalPosition: "bottom",
                    horizontalPosition: "center",
                    duration: 4000,
                  });
                  this.router.navigate(["/"]);
                }
              })
            )
            .toPromise();
        } else {
          this.snackbar.open("رمز عبور و تکرار یکسان نیست", null, {
            verticalPosition: "bottom",
            horizontalPosition: "center",
            duration: 2000,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async verifyPassword() {
    try {
      this.loading = true;
      await this.userService
        .verifyResetPassword(this.code)
        .pipe(
          map((res) => {
            this.showForm = res.status;
          })
        )
        .toPromise();
      this.loading = false;
    } catch (error) {
      this.loading = false;
      if (!!error.error.message) {
        this.snackbar.open(error.error.message, null, {
          verticalPosition: "bottom",
          horizontalPosition: "center",
          duration: 4000,
        });
        this.router.navigate(["/"]);
      }
    }
  }
}
