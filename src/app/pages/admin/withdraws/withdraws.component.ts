import {Component, OnInit} from '@angular/core';
import {WithdrawsDto} from 'src/app/models/withdraws.dto';
import {FormControl} from '@angular/forms';
import {WithdrawsService} from 'src/app/services/withdraws.service';
import {map, debounceTime} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from 'src/app/components/dialog/dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SuccessDialogComponent} from 'src/app/components/success-dialog/success-dialog.component';

@Component({
  selector: 'app-withdraws',
  templateUrl: './withdraws.component.html',
  styleUrls: ['./withdraws.component.scss'],
})
export class WithdrawsComponent implements OnInit {
  withdraws: WithdrawsDto[];
  loading: boolean;
  search: string;
  searchControl = new FormControl();
  limit: number;
  skip: number;
  status: string;
  count: number;

  displayedColumns: string[] = [
    'index',
    'name',
    'family',
    'phone',
    'status',
    'amount',
    'type',
    'account',
    'trackNumber',
    'createdAt',
    'updatedAt',
    'action',
  ];

  constructor(
    private readonly withdrawsService: WithdrawsService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.withdraws = [];
    this.search = '';
    this.limit = 10;
    this.skip = 0;
    this.loading = false;
    this.status = 'waiting';
    this.count = 0;
  }

  ngOnInit(): void {
    this.getWithdrawsList();

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((val) => {
      this.search = val;
      this.resetPage();
    });
  }

  selectionChange() {
    this.skip = 0;
    this.getWithdrawsList();
  }

  // باز گزداندن صفحه به حالت اول
  resetPage() {
    this.skip = 0;
    this.limit = 10;
    this.getWithdrawsList();
  }

  // صفحه بعد
  nextPage() {
    if (this.skip + this.limit < this.count) {
      this.skip += this.limit;
      this.getWithdrawsList();
    } else {
      this.skip = this.count - this.limit;
      this.getWithdrawsList();
    }
  }

  // صفحه قبل
  prevPage() {
    if (this.skip - this.limit > 0) {
      this.skip -= this.limit;
      this.getWithdrawsList();
    } else {
      this.skip = 0;
      this.getWithdrawsList();
    }
  }

  // صفحه اول
  firstPage() {
    this.skip = 0;
    this.getWithdrawsList();
  }

  // صفحه آخر
  lastPage() {
    this.skip = this.count - this.limit;
    this.getWithdrawsList();
  }

  _openSnackbar(message: string) {
    this.snackBar.open(message, null, {
      verticalPosition: 'top',
      horizontalPosition: 'left',
      duration: 3000,
      direction: 'rtl',
    });
  }

  // لغو کردن یک برداشت
  setCancel(withdraws: WithdrawsDto) {
    this.dialog
      .open(DialogComponent, {
        data: {
          title: `لغو پرداخت ${withdraws.user.name} ${withdraws.user.family} به مبلغ ${withdraws.amount} تومان`,
          content: 'آیا مطمئن هستید؟',
        },
        width: '350px',
      })
      .afterClosed()
      .subscribe((status) => {
        if (!!status) {
          this.withdrawsService
            .setCancelWithdraws(withdraws._id)
            .subscribe((res) => {
              this._openSnackbar(`پرداخت لغو شد`);
              this.getWithdrawsList();
            });
        }
      });
  }

  // تائید یک برداشت
  setSuccess(withdraws: WithdrawsDto) {
    this.dialog
      .open(SuccessDialogComponent, {
        width: '400px',
      })
      .afterClosed()
      .subscribe((res) => {
        // console.log(res);
        this.withdrawsService
          .setSuccessWithdraws(withdraws._id, res)
          .subscribe((resp) => {
            this._openSnackbar(`پرداخت  موفق بود`);
            this.resetPage();
          });
      });
  }

  // گرفتن لیست برداشت ها
  async getWithdrawsList() {
    try {
      this.loading = true;
      await this.withdrawsService
        .getWithdrawsList({
          search: this.search,
          skip: this.skip.toString(),
          limit: this.limit.toString(),
          status: this.status,
        })
        .pipe(
          map((res) => {
            this.count = res.count;
            this.withdraws = res.withdraws;
          })
        )
        .toPromise();
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    } finally {
      this.loading = false;
    }
  }
}
