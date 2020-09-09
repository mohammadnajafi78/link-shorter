import { Component, OnInit } from "@angular/core";
import { WithdrawsService } from "src/app/services/withdraws.service";
import { UserService } from "src/app/services/user.service";
import { WithdrawsDto } from "src/app/models/withdraws.dto";
import { UserDto } from "src/app/models/user.dto";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SettingService } from "src/app/services/setting.service";
import { WithdrawsMethod } from "src/app/models/setting.model";

@Component({
  selector: "app-withdraws",
  templateUrl: "./withdraws.component.html",
  styleUrls: ["./withdraws.component.scss"],
})
export class WithdrawsComponent implements OnInit {
  // تمام برداشت های کاربر
  withdraws: WithdrawsDto[];
  // کاربر برای چک کردن فرم
  user: UserDto;
  // برداشت های موفق
  totalSuccess: number;
  // برداشت های در انتظار
  totalWaiting: number;
  // روش های برداشت
  method: WithdrawsMethod;
  limit: number;
  skip: number;
  count: number;

  constructor(
    private readonly withdrawsService: WithdrawsService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
    private readonly settingService: SettingService
  ) {
    this.withdraws = [];
    this.user = userService.user$.getValue();
    this.totalSuccess = 0;
    this.totalWaiting = 0;
    this.limit = 10;
    this.skip = 0;
    this.count = 0;
  }

  displayedColumns: string[] = [
    "index",
    "createdAt",
    "status",
    "amount",
    "withdrawType",
    "trackNumber",
    "accountAddress",
  ];

  ngOnInit(): void {
    this.getUserWithdrawsList();
    this.findMethod();
  }

  // گرفتن لیست برداشت های کاربر
  async getUserWithdrawsList() {
    try {
      await this.withdrawsService
        .getUserWithdrawsList({
          skip: this.skip.toString(),
          limit: this.limit.toString(),
        })
        .pipe(
          map((res) => {
            this.withdraws = res.withdraws;
            this.count = res.count;
            // محاسبه برداشت های موفق و لغو شده
            this.withdraws.forEach((el) => {
              if (el.status === "waiting") {
                this.totalWaiting += el.amount;
              } else if (el.status === "success") {
                this.totalSuccess += el.amount;
              }
            });
          })
        )
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  // کاربر باید ابتدا فرم را تکمیل کند
  validateUserForm(): boolean {
    if (
      !!this.user.name &&
      !!this.user.family &&
      !!this.user.city &&
      !!this.user.state &&
      !!this.user.country &&
      !!this.user.address &&
      !!this.user.accountAddress &&
      this.user.withdrawsType
    ) {
      return true;
    } else {
      this.snackbar.open("ابتدا پروفایل کاربری را تکمیل کنید", null, {
        duration: 5000,
        verticalPosition: "bottom",
        horizontalPosition: "center",
      });
      return false;
    }
  }

  // گرفتن حداقل مقدار
  findMethod() {
    this.settingService.findMethod().subscribe(
      (res) => {
        this.method = res.withdrawsMethod;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // چک کردن داشتن حداقل مقدار برداشت
  validateMin(): boolean {
    if (this.user !== null && this.user.salary > this.method.min) {
      return true;
    } else {
      this.snackbar.open("شما حداقل مقدار برداشت را ندارید", null, {
        duration: 5000,
        verticalPosition: "bottom",
        horizontalPosition: "center",
      });
      return false;
    }
  }

  // رفتن به صفحه برداشت
  goToWithdraws() {
    if (this.validateUserForm() && this.validateMin()) {
      this.router.navigate(["member/dashboard/withdraws-modify"]);
    }
  }

  // صفحه بعد
  nextPage() {
    if (this.skip + this.limit < this.count) {
      this.skip += this.limit;
      this.getUserWithdrawsList();
    } else {
      this.skip = this.count - this.limit;
      this.getUserWithdrawsList();
    }
  }

  // صفحه قبل
  prevPage() {
    if (this.skip - this.limit > 0) {
      this.skip -= this.limit;
      this.getUserWithdrawsList();
    } else {
      this.skip = 0;
      this.getUserWithdrawsList();
    }
  }
}
