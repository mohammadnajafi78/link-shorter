import {Component, OnInit, ElementRef, Input} from '@angular/core';

import {SettingService} from 'src/app/services/setting.service';

import {UserService} from 'src/app/services/user.service';
import {Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {UserDto} from 'src/app/models/user.dto';

@Component({
  selector: 'app-client-template',
  templateUrl: './client-template.component.html',
  styleUrls: ['./client-template.component.scss'],
})
export class ClientTemplateComponent implements OnInit {
  isSmallScreen = false;
  @Input() transparent: boolean;
  user: UserDto;

  constructor(
    public userService: UserService,
    private breakpointObserver: BreakpointObserver,
    public settingService: SettingService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    this.isSmallScreen = this.breakpointObserver.isMatched(
      '(max-width: 768px)'
    );
  }

  openLink(commands: any[]) {
    this.router.navigate(commands);
    this.settingService.drawer$.next(false);
  }
}
