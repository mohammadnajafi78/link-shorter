import {Component, OnInit, Inject} from '@angular/core';
import {SettingService} from 'src/app/services/setting.service';
import {CPCDto, SettingDto} from 'src/app/models/setting.model';
import {map} from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {WithdrawMethodComponent} from '../withdraw-method/withdraw-method.component';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  setting: SettingDto;
  loading: boolean;
  displayedColumns: string[] = [
    'index',
    'title',
    'description',
    'min',
    'active',
    'action',
  ];

  constructor(
    private readonly settingService: SettingService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.setting = {iranCPC: {}, foreignCPC: {}};
  }

  ngOnInit(): void {
    this.get();
  }

  // باز کزدن اسنک بار
  _openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'rtl',
      duration: 3000
    });
  }

  // باز کردن ذیالوگ اضافه کردن روش جدید
  openCreateDialog() {
    this.dialog
      .open(WithdrawMethodComponent, {
        width: '500px',
        data: {WithdrawsMethod: {active: true}, state: 'create'},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res.status) {
          this.setting.withdrawsMethods.push(res.withdrawsMethod);
          // ویرایش تنظیمات با تغییرات جدید
          this.update(this.setting._id);
          this.get();
          this._openSnackBar('ایجاد با موقفیت انجام شد');
        }
      });
  }

  // باز کزدن دیالوگ ویرایش
  openEditDialog(method: any) {
    this.dialog
      .open(WithdrawMethodComponent, {
        width: '500px',
        data: {WithdrawsMethod: method, state: 'edit'},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res.status) {
          // ویرایش تنظیمات با تغییرات جدید
          this.update(this.setting._id);
          this.get();
          this._openSnackBar('ویرایش با موفقیت انجام شد');
        }
      });
  }

  // باز کردن دیالوگ تعرفه کلیک های داخلی
  openIranCPC() {
    this.dialog
      .open(HandleCPC, {
        width: '350px',
        data: {cpc: this.setting.iranCPC, state: 'iran'},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res.status) {
          this.setting.iranCPC = res.cpc;
          this.update(this.setting._id);
          this.get();
          this._openSnackBar('تعرفه داخلی با موفقیت ویرایش شد');
        }
      });
  }

  // باز کردن دیالوگ تعرفه کلیک های خارجی
  openForeignCPC() {
    this.dialog
      .open(HandleCPC, {
        width: '350px',
        data: {cpc: this.setting.foreignCPC, state: 'foreign'},
      })
      .afterClosed()
      .subscribe((res) => {
        if (res.status) {
          this.setting.foreignCPC = res.cpc;
          this.update(this.setting._id);
          this.get();
          this._openSnackBar('تعرفه خارجی با موفقیت ایجاد شد');
        }
      });
  }

  // گرفتن تنظیمات
  async get() {
    try {
      await this.settingService
        .get()
        .pipe(
          map((res) => {
            // فقط تنظیمات شماره یک نیاز است
            this.setting = res.setting[0];
          })
        )
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  // ویرایش تنظیمات
  async update(id: string) {
    try {
      await this.settingService
        .update(id, this.setting)
        .pipe(map((res) => {
          this.get();
        }))
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'cpc-handle',
  templateUrl: 'cpc-handle.html',
  styleUrls: ['./setting.component.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class HandleCPC {
  constructor(
    public dialogRef: MatDialogRef<HandleCPC>,
    @Inject(MAT_DIALOG_DATA) public data: { cpc: CPCDto; state: string }
  ) {
  }

  firstCPC = new FormControl('', Validators.required);
  secondCPC = new FormControl('', Validators.required);
  thirdCPC = new FormControl('', Validators.required);

  onYesClick() {
    if (this.firstCPC.valid && this.secondCPC.valid && this.thirdCPC.valid) {
      this.dialogRef.close({cpc: this.data.cpc, status: true});
    }
  }

  onNoClick(): void {
    this.dialogRef.close({status: false});
  }
}
