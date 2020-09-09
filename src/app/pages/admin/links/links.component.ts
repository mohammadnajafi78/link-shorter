import {Component, OnInit} from '@angular/core';
import {LinkDto} from 'src/app/models/link.dto';
import {LinkService} from 'src/app/services/link.service';
import {map, debounceTime} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from 'src/app/components/dialog/dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit {
  search: string;
  searchControl = new FormControl();
  limit: number;
  skip: number;
  loading: boolean;
  links: LinkDto[];
  count: number;
  status: string;
  displayedColumns: string[] = [
    'index',
    'phone',
    'status',
    'mainLink',
    'shortLink',
    'showAds',
    'createdAt',
    'action',
  ];

  constructor(
    private readonly linkService: LinkService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.search = '';
    this.limit = 10;
    this.skip = 0;
    this.loading = false;
    this.links = [];
    this.count = 0;
    this.status = 'active';
  }

  ngOnInit(): void {
    this.getLinkList();
    // جست و جو در لینک ها
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((val) => {
      this.search = val;
      this.resetPage();
    });
  }

  goToLink(link: string) {
    if (link.startsWith('http')) {
      window.open(link);
    } else {
      window.open('https://' + link);
    }
  }

  // باز کردن اسنک بار
  _openSnackbar(message: string) {
    this.snackBar.open(message, null, {
      verticalPosition: 'top',
      horizontalPosition: 'left',
      duration: 3000,
      direction: 'rtl',
    });
  }

  selectionChange() {
    this.skip = 0;
    this.getLinkList();
  }

  // باز گزداندن صفحه به حالت اول
  resetPage() {
    this.skip = 0;
    this.limit = 10;
    this.getLinkList();
  }

  // صفحه بعد
  nextPage() {
    if (this.skip + this.limit < this.count) {
      this.skip += this.limit;
      this.getLinkList();
    } else {
      this.skip = this.count - this.limit;
      this.getLinkList();
    }
  }

  // صفحه قبل
  prevPage() {
    if (this.skip - this.limit > 0) {
      this.skip -= this.limit;
      this.getLinkList();
    } else {
      this.skip = 0;
      this.getLinkList();
    }
  }

  // صفحه اول
  firstPage() {
    this.skip = 0;
    this.getLinkList();
  }

  // صفحه آخر
  lastPage() {
    this.skip = this.count - this.limit;
    this.getLinkList();
  }

  // مشکل دار کردن لینک
  setWarning(link: LinkDto) {
    this.dialog
      .open(DialogComponent, {
        data: {
          title: `لینک کوتاه به آدرس ${link.shortLink} مشکل دار است`,
          content: 'آیا مطمئن هستید؟',
        },
        width: '350px',
      })
      .afterClosed()
      .subscribe((status) => {
        if (!!status) {
          this.linkService
            .update(link._id, {status: 'warning'})
            .subscribe((res) => {
              if (res.status) {
                this._openSnackbar('لینک مشکل دار شد');
                this.resetPage();
              }
            });
        }
      });
  }

  // گرفتن لیست لینک ها
  async getLinkList() {
    try {
      this.loading = true;

      await this.linkService
        .getLinkList({
          search: this.search,
          skip: this.skip.toString(),
          limit: this.limit.toString(),
          status: `${this.status}`,
        })
        .pipe(
          map((res) => {
            this.count = res.count;
            this.links = res.links;
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
