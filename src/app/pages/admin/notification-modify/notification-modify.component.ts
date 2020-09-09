import {Component, Inject, OnInit} from '@angular/core';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationComponent} from '../notification/notification.component';
import {AdsDto} from '../../../models/ads.dto';
import {NotificationDto} from '../../../models/notification.dto';
import {NotificationService} from '../../../services/notification.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-notification-modify',
  templateUrl: './notification-modify.component.html',
  styleUrls: ['./notification-modify.component.scss']
})
export class NotificationModifyComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { notification: NotificationDto; state: string },
    private readonly notificationService: NotificationService
  ) {
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    height: '150px',
    fonts: [{name: 'شبنم', class: 'Shabnam'}],
    toolbarHiddenButtons: [
      [
        'indent',
        'outdent',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'subscript',
        'superscript',
      ],
      ['insertImage', 'insertVideo', 'backgroundColor']
    ]
  };

  async create() {
    try {
      await this.notificationService.create(this.data.notification).pipe(map(res => {
        if (res.notification) {
          this.dialogRef.close({status: true});
        }
      })).toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  async update() {
    try {
      await this.notificationService.update(this.data.notification).pipe(map(res => {
        if (res.notification) {
          this.dialogRef.close({status: true});
        }
      })).toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
  }

}
