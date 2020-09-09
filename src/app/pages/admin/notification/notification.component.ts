import {Component, OnInit} from '@angular/core';
import {NotificationDto} from '../../../models/notification.dto';
import {NotificationService} from '../../../services/notification.service';
import {map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {NotificationModifyComponent} from '../notification-modify/notification-modify.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogComponent} from '../../../components/dialog/dialog.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  displayedColumns: string[] = [
    'index',
    'title',
    'active',
    'createdAt',
    'action',
  ];
  notifications: NotificationDto[];
  loading: boolean;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.notifications = [];
  }

  ngOnInit(): void {
    this.getAllNotification();
  }

  _openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      horizontalPosition: 'left',
      verticalPosition: 'top',
      duration: 3000
    });
  }

  openCreateDialog() {
    this.dialog.open(NotificationModifyComponent, {
      data: {notification: {active: true}, state: 'create'}
    }).afterClosed().subscribe(res => {
      if (res.status) {
        this._openSnackBar('اطلاعیه با موفقیت ایجادشد');
        this.getAllNotification();
      }
    });
  }

  openEditDialog(notification: NotificationDto) {
    this.dialog.open(NotificationModifyComponent, {
      data: {notification, state: 'edit'}
    }).afterClosed().subscribe(res => {
      if (res.status) {
        this._openSnackBar('ویرایش با موفقیت ثبت شد');
        this.getAllNotification();
      }
    });
  }

  openDeleteDialog(notification: NotificationDto) {
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: {title: `حذف اطلاعیه ${notification.title}`, content: 'آیا مطمئن هستید؟'}
    }).afterClosed().subscribe(res => {
      if (res) {
        this.delete(notification._id);
        this.getAllNotification();
      }
    });
  }

  async delete(id: string) {
    try {
      await this.notificationService.delete(id).pipe(map(res => {
        if (res.notification) {
          this._openSnackBar('حذف با موفقیت انجام شد');
        }
      })).toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  async getAllNotification() {
    try {
      this.loading = true;
      await this.notificationService.findAll().pipe(map(res => {
        this.notifications = res.notifications;
      })).toPromise();
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

}
