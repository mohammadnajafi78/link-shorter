import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {UserDto} from '../../../models/user.dto';
import {UserService} from '../../../services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-subset',
  templateUrl: './subset.component.html',
  styleUrls: ['./subset.component.scss']
})
export class SubsetComponent implements OnInit {
  url: string;
  user: UserDto;
  displayedColumns: string[] = ['fullName', 'createdAt'];
  dataSource = [];
  subsets: UserDto[];

  constructor(
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar
  ) {
    this.url = environment.url;
    userService.user$.subscribe((res) => {
      this.user = res;
    });
    this.subsets = [];
  }

  ngOnInit(): void {
    this.findSubset();
  }

  findSubset() {
    this.userService.findSubset().subscribe((res) => {
      this.subsets = res.users;
    }, (err) => {
      console.log(err);
    });
  }

  openCopySnackBar() {
    this.snackBar.open('کپی شد', null, {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 3000
    });
  }

}
