import {Injectable} from '@angular/core';
import {NotificationDto} from '../models/notification.dto';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  base = '/api/notification';

  constructor(private readonly http: HttpClient) {
  }

  create(notification: NotificationDto) {
    return this.http.post<{ notification: NotificationDto }>(this.base, notification);
  }

  findAll(params?: {
    status?: string;
  }) {
    return this.http.get<{ notifications: NotificationDto[] }>(this.base, {params});
  }

  update(data: NotificationDto) {
    return this.http.put<{ notification: NotificationDto }>(`${this.base}/${data._id}`, data);
  }

  delete(id: string) {
    return this.http.delete<{ notification: NotificationDto }>(`${this.base}/${id}`);
  }

}
