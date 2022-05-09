import { map } from "rxjs/operators";
import { UserService } from "src/app/services/user.service";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"],
})
export class ForgetPasswordComponent implements OnInit {
  emailControl = new FormControl("", [
    Validators.required,
    Validators.pattern(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ),
  ]);
  email: string;
  emailError: boolean;
  emailSuccess: boolean;
  loading: boolean;
  constructor(private readonly userService: UserService) {
    this.email = "";
    this.emailError = false;
    this.emailSuccess = false;
    this.loading = false;
  }

  ngOnInit(): void {}

  async forgetPassword() {
    try {
      if (this.emailControl.valid) {
        this.loading = true;
        await this.userService
          .forgetPassword(this.email)
          .pipe(
            map((res) => {
              if (res.status) {
                this.emailSuccess = res.status;
                this.emailError = false;
                this.email = "";
              }
            })
          )
          .toPromise();
        this.loading = false;
      }
    } catch (error) {
      this.loading = false;
      if (!!error.error.message) {
        this.emailError = true;
        this.emailSuccess = false;
      }
      console.log(error);
    }
  }
}
