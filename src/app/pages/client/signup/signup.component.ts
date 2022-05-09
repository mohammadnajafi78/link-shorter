import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { debounceTime, map } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { UserDto } from "src/app/models/user.dto";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  exist: boolean;
  user: UserDto;
  confirmPassword: string;
  passwordError: boolean;
  emailError: boolean;
  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    this.exist = true;
    this.user = {};
    this.confirmPassword = "";
    this.passwordError = false;
    this.emailError = false;
    userService.user$.subscribe((res) => {
      if (res !== null) {
        this.router.navigate(["/member/dashboard"]);
      }
    });
  }

  ngOnInit(): void {
    this.signUpForm = new FormBuilder().group({
      username: ["", [Validators.required, Validators.minLength(5)]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
    });
    this.inputs.username.valueChanges
      .pipe(debounceTime(300))
      .subscribe((res) => {
        this.userService.usernameExist(res).subscribe((resp) => {
          this.exist = resp;
        });
      });
  }
  get inputs() {
    return this.signUpForm.controls;
  }

  async signUp() {
    try {
      if (this.user.password === this.confirmPassword) {
        const identifier = localStorage.getItem("identifier");
        if (!!identifier) {
          this.user.identifierCode = identifier;
        }
        await this.userService
          .signUp(this.user)
          .pipe(
            map((res) => {
              if (res.status) {
                this.snackBar.open("ثبت نام با موفقیت انجام شد", null, {
                  verticalPosition: "bottom",
                  horizontalPosition: "center",
                  duration: 4000,
                });
                this.router.navigate(["/user/login"]);
              }
            })
          )
          .toPromise();
      } else {
        this.passwordError = true;
      }
    } catch (error) {
      if (!!error.error.message) {
        this.emailError = true;
      }
      console.log(error);
    }
  }
}
