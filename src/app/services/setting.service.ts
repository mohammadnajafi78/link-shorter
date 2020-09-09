import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SettingDto, WithdrawsMethod} from 'src/app/models/setting.model';
import {map} from 'rxjs/operators';

@Injectable()
export class SettingService {
  drawer$: BehaviorSubject<boolean>;
  base = '/api/setting';

  constructor(private readonly http: HttpClient) {
    this.drawer$ = new BehaviorSubject<boolean>(false);
  }

  get() {
    return this.http.get<{ setting: SettingDto[] }>(this.base);
  }

  update(id: string, setting: SettingDto) {
    return this.http.put<{ status: boolean }>(`${this.base}/${id}`, setting);
  }

  findMethod() {
    return this.http.get<{ withdrawsMethod: WithdrawsMethod }>(
      `${this.base}/method`
    );
  }
}
