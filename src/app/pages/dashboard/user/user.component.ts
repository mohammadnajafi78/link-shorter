import {Component, OnInit} from '@angular/core';
import {UserDto} from 'src/app/models/user.dto';
import {UserService} from 'src/app/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SettingService} from 'src/app/services/setting.service';
import {SettingDto} from 'src/app/models/setting.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  loading: boolean;
  user: UserDto = {};
  setting: SettingDto;

  constructor(
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar,
    private readonly settingService: SettingService
  ) {
    this.user = {};
    this.setting = {};
  }

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      Object.assign(this.user, user);
    });
    this.getSetting();
  }

  getSetting() {
    this.settingService.get().subscribe(
      (res) => {
        this.setting = res.setting[0];
        this.setting.withdrawsMethods = this.setting.withdrawsMethods.filter(
          (el) => el.active
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateProfile() {
    this.userService.updateUser(this.user).subscribe((resp) => {
      if (resp.status) {
        this.userService.user$.next(this.user);
        const message = 'کاربری بروزرسانی شد';
        this.snackBar.open(message, null, {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000,
          direction: 'rtl',
        });
      }
    });
  }
}
