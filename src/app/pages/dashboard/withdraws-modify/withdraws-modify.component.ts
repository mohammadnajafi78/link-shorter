import {Component, OnInit} from '@angular/core';
import {WithdrawsService} from 'src/app/services/withdraws.service';
import {UserService} from 'src/app/services/user.service';
import {UserDto} from 'src/app/models/user.dto';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {SettingService} from 'src/app/services/setting.service';
import {WithdrawsMethod} from 'src/app/models/setting.model';

@Component({
  selector: 'app-withdraws-modify',
  templateUrl: './withdraws-modify.component.html',
  styleUrls: ['./withdraws-modify.component.scss'],
})
export class WithdrawsModifyComponent implements OnInit {
  user: UserDto;
  amount: number;
  amountController: FormControl;
  method: WithdrawsMethod;

  constructor(
    private readonly withdrawsService: WithdrawsService,
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    private readonly settingService: SettingService
  ) {
    this.user = userService.user$.getValue();
    this.method = {};
    this.findMethod();
  }

  ngOnInit(): void {
    // اگر فرم کاربر تکمیل نیست اجازه دسترسی به صفحه را ندارد
    if (!this.validateUserForm()) {
      this.router.navigate(['/member/dashboard']);
    }

    // مقدار برداشت باید مشحص شود و باید کمتر از درامد کاربر باشد
    this.amountController = new FormControl('', [
      Validators.required,
      Validators.max(this.user.salary),
    ]);
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
      !!this.user.withdrawsType
    ) {
      return true;
    } else {
      this.snackbar.open('ابتدا پروفایل کاربری را تکمیل کنید', null, {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
      return false;
    }
  }

  // پیدا کردن روش برداشت از طریق توکن کاربر
  findMethod() {
    this.settingService.findMethod().subscribe(
      (res) => {
        this.method = res.withdrawsMethod;
        // آیا درامد کاربر به حداقل میزان رسیده است یا خیر
        if (this.method.min > this.user.salary || !this.method) {
          this.snackbar.open('حداقل مقدار برداشت را ندارید', null, {
            duration: 7000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          });
          this.router.navigate(['/member/dashboard']);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // ایجاد برداشت جدید
  async createWithdraws() {
    if (this.amountController.valid) {
      if (this.method.min < this.amount) {
        try {
          await this.withdrawsService.create(this.amount).toPromise();
          this.snackbar.open('درخواست شما با موفقیت ثبت شد', null, {
            duration: 7000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          });
          this.router.navigate(['/member/dashboard']);
        } catch (error) {
          console.log(error);
        }
      } else {
        this.snackbar.open(`حداقل مقدار برداشت ${this.method.min} تومان میباشد`);
      }
    }
  }
}
