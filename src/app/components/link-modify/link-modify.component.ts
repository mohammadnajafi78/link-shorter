import {Component, OnInit} from '@angular/core';
import {LinkDto} from '../../models/link.dto';
import {FormControl, Validators} from '@angular/forms';
import {UserDto} from '../../models/user.dto';
import {UserService} from '../../services/user.service';
import {LinkService} from '../../services/link.service';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-link-modify',
  templateUrl: './link-modify.component.html',
  styleUrls: ['./link-modify.component.scss']
})
export class LinkModifyComponent implements OnInit {
  link: LinkDto;
  mainLink: string;
  showAds: boolean;
  linkController: FormControl;
  user: UserDto;
  url: string;

  constructor(
    private readonly userService: UserService,
    private readonly linkService: LinkService,
    private readonly snackBar: MatSnackBar
  ) {
    userService.user$.subscribe(res => {
      this.user = res;
    });
    this.link = {};
    this.mainLink = '';
    this.showAds = true;
    this.url = environment.url;
  }

  ngOnInit(): void {
    this.linkController = new FormControl('', [
      Validators.required,
      Validators.pattern(
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
      )
    ]);
  }

  openSnackbar() {
    this.snackBar.open('کپی شد', null, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000
    });
  }

  async create() {
    if (this.linkController.valid) {
      if (this.mainLink.includes(this.url.substr(8))) {
        this.snackBar.open('اجازه وارد کردن این دامنه را ندارید', null, {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000
        });
        this.mainLink = '';
      } else {
        try {
          await this.linkService.createLink(
            {mainLink: this.mainLink, showAds: this.showAds, user: this.user._id}
          ).pipe(map(res => {
            this.link = res.link;
          })).toPromise();
          this.mainLink = '';
          this.showAds = true;
        } catch (error) {
          console.log(error);
        }
      }

    }
  }


}
