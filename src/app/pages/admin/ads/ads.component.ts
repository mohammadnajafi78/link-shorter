import {Component, Inject, OnInit} from '@angular/core';
import {AdsDto} from 'src/app/models/ads.dto';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AdsModifyComponent} from '../ads-modify/ads-modify.component';
import {AdsService} from '../../../services/ads.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {debounceTime, map} from 'rxjs/operators';
import {DialogComponent} from '../../../components/dialog/dialog.component';
import {FormControl, Validators} from '@angular/forms';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
})
export class AdsComponent implements OnInit {
  limit: number;
  skip: number;
  count: number;
  search: string;
  type: string;
  iran: boolean;
  searchControl = new FormControl();
  loading: boolean;
  displayedColumns: string[] = [
    'index',
    'type',
    'link',
    'active',
    'iran',
    'createdAt',
    'action',
  ];
  ads: AdsDto[];

  constructor(
    private readonly dialog: MatDialog,
    private readonly adsService: AdsService,
    private readonly snackBar: MatSnackBar
  ) {
    this.limit = 10;
    this.skip = 0;
    this.count = 0;
    this.ads = [];
    this.search = '';
    this.type = 'vertical';
    this.iran = false;
    this.loading = false;
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((val) => {
      this.search = val;
      this.resetPage();
    });
    this.getAll();
  }

  _openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      horizontalPosition: 'left',
      verticalPosition: 'top',
      direction: 'rtl',
      duration: 5000
    });
  }

  goToLink(link: string) {
    if (link.startsWith('http')) {
      window.open(link);
    } else {
      window.open('https://' + link);
    }
  }

  // بازکزدن دیالوگ ایجاد تبلیغ
  openCreateDialog() {
    this.dialog.open(AdsModifyComponent, {
      width: '1200px',
      data: {
        ads: {
          // به صورت دیفالت ایران باشد
          iran: true,
          // به صورت دیفالت فعال باشد
          active: true,
        },
        state: 'create',
      },
    }).afterClosed().subscribe((res) => {
      if (res !== null && typeof res !== 'undefined') {
        this.adsService.create(res).subscribe((resp) => {
          this._openSnackBar('تبلیغ با موفقیت ایجاد شد');
          this.resetPage();
        }, (err) => {
          console.log(err);
        });
      }
    });
  }

  // بازکردن دیالوگ ویرایش
  openEditDialog(ads: AdsDto) {
    this.dialog.open(AdsModifyComponent, {
      width: '1200px',
      data: {ads, state: 'edit'}
    }).afterClosed().subscribe((res) => {
      if (res !== null && res !== 'undefined') {
        this.adsService.update(res._id, res).subscribe((resp) => {
            this._openSnackBar('تبلیغ با موفقیت ویرایش شد');
            this.resetPage();
          }, (err) => {
            console.log(err);
          }
        );
      }
    });
  }

  // باز کردن دیالوگ حذف
  openDeleteDialog(ads: AdsDto) {
    this.dialog.open(DialogComponent, {
      width: '250px',
      data: {title: 'حذف تبلیغ', content: 'آیا مطمئن هستید'}
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.adsService.delete(ads._id).subscribe((resp) => {
          this._openSnackBar('حذف با موفیت انجام شد');
          this.resetPage();
        }, (err) => {
          console.log(err);
        });
      }
    });
  }

  // باز کردن پیش نمایش تبلیغ
  openPreview(ads: AdsDto) {
    if (ads.type !== 'popup') {
      this.dialog.open(AdsDialog, {
        data: {image: ads.image, link: ads.link}
      });
    } else {
      // پاپ آپ
      const newWindow = window.open(ads.link, 'bottom', 'height=600,width=800');
      if (window.focus) {
        newWindow.focus();
      }
    }
  }

  // باز گزداندن صفحه به حالت اول
  resetPage() {
    this.skip = 0;
    this.limit = 10;
    this.getAll();
  }

  // گرفتن لیست تبلیغات
  async getAll() {
    try {
      this.loading = true;
      await this.adsService.getAll({
        search: this.search,
        type: this.type,
        skip: this.skip.toString(),
        limit: this.limit.toString()
      }).pipe(map(res => {
        this.ads = res.ads;
        this.count = res.count;
      })).toPromise();
      this.loading = false;

    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }


  // صفحه بعد
  nextPage() {
    if (this.skip + this.limit < this.count) {
      this.skip += this.limit;
      this.getAll();
    } else {
      this.skip = this.count - this.limit;
      this.getAll();
    }
  }

  // صفحه قبل
  prevPage() {
    if (this.skip - this.limit > 0) {
      this.skip -= this.limit;
      this.getAll();
    } else {
      this.skip = 0;
      this.getAll();
    }
  }

  // صفحه اول
  firstPage() {
    this.skip = 0;
    this.getAll();
  }

  // صفحه آخر
  lastPage() {
    this.skip = this.count - this.limit;
    this.getAll();
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ads.dialog',
  templateUrl: 'ads.dialog.html',
  styleUrls: ['./ads.component.scss'],
})
// tslint:disable-next-line: component-class-suffix
export class AdsDialog {
  base: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { image: string, link: string }) {
    this.base = environment.url;
  }
}
