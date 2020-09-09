import {Component, OnInit, Inject} from '@angular/core';
import {AdsDto} from 'src/app/models/ads.dto';
import {UploadService} from 'src/app/services/upload.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpEventType} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-ads-modify',
  templateUrl: './ads-modify.component.html',
  styleUrls: ['./ads-modify.component.scss'],
})
export class AdsModifyComponent implements OnInit {
  ads: AdsDto;
  // میزان پیشرفت آپلود
  uploadProgress: number;
  // حواب عکس
  responseImage: any;
  linkControl: FormControl;
  typeControl: FormControl;
  // آدرس اصلی  api برای دریافت عکس
  BASE_URL: string;

  constructor(
    private readonly uploadService: UploadService,
    private readonly snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { ads: AdsDto; state: string },
    public dialogRef: MatDialogRef<AdsModifyComponent>,
  ) {
    this.BASE_URL = environment.url;
    this.ads = data.ads;
    this.uploadProgress = 0;
  }

  ngOnInit(): void {
    this.linkControl = new FormControl('', [
        Validators.required
      ]
    );

    this.typeControl = new FormControl('', [
      Validators.required
    ]);

  }

  // آپلود عمکس
  async openFileChooser() {
    if (this.uploadProgress !== 0) {
      return;
    }
    this.uploadService.openFileChooser().then(
      fileList => this.uploadFile(fileList)
    );
  }

  uploadFile(files: FileList) {
    if (this.uploadProgress !== 0) {
      return;
    }
    const file: File = files[0];
    this.uploadService.upload(file).subscribe(res => {
      switch (res.type) {
        case HttpEventType.UploadProgress:
          const progress = res.loaded / res.total; // 0 - 1
          this.uploadProgress = Math.ceil(progress * 100); // 0 - 100
          break;
        case HttpEventType.Response:
          const {url} = res.body as { url: string };
          this.ads.image = url;
          this.uploadProgress = 0;
          this.snackBar.open('تصویر بارگزاری شد .', null, {
            verticalPosition: 'top',
            horizontalPosition: 'left',
            duration: 3000,
            direction: 'rtl'
          });
      }
    }, err => {
      console.log(err.message);
      this.uploadProgress = 0;
      this.snackBar.open('بارگزاری با مشکل مواجه شد !', null, {
        verticalPosition: 'top',
        horizontalPosition: 'left',
        duration: 3000,
        direction: 'rtl'
      });
    });
  }


  onYesClick() {
    // دیالوگ بسته شود و تبلیغ برگردانده شود
    if (this.linkControl.valid && this.typeControl.valid) {
      this.dialogRef.close(this.ads);
    }
  }

  onNoClick() {
    this.dialogRef.close(null);
  }

}
