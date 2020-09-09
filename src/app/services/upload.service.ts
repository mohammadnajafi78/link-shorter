import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  base = '/api/upload';

  constructor(private readonly http: HttpClient) {
  }

  // برای ایجاد ورودی فایل
  openFileChooser(): Promise<FileList> {
    return new Promise<FileList>((resolve, reject) => {
      try {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.addEventListener('change', ev => {
          const files: FileList = fileInput.files;

          if (files) {
            resolve(files);
          } else {
            reject(undefined);
          }
        });
        fileInput.click();
      } catch (error) {
        reject();
      }
    });
  }

  // برای آپلود عکس در سرور
  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.base}/image`, formData, {
      // responseType: '',
      // درصد پیشرفت آپلود
      reportProgress: true,
      observe: 'events',
    });
  }
}
