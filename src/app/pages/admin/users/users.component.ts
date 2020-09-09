import { Component, OnInit } from "@angular/core";
import { UserDto } from "src/app/models/user.dto";
import { UserService } from "src/app/services/user.service";
import { map, debounceTime } from "rxjs/operators";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EditUserComponent } from "../edit-user/edit-user.component";
import { log } from "util";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  users: UserDto[];
  limit: number;
  skip: number;
  search: string;
  searchControl = new FormControl();
  count: number;
  loading: boolean;
  displayedColumns: string[] = [
    "index",
    "name",
    "family",
    "phone",
    "status",
    "role",
    "createAt",
    "updateAt",
    "salary",
    "subSalary",
    "action",
  ];

  constructor(
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.users = [];
    this.skip = 0;
    this.limit = 10;
    this.search = "";
    this.count = 0;
    this.loading = false;
  }

  ngOnInit(): void {
    this.getUserList();

    // جست و جو در نام کاربر
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((res) => {
      this.search = res;
      this.resetPage();
    });
  }

  // باز کردن اسنک بار
  _openSnackbar(message: string) {
    this.snackBar.open(message, null, {
      verticalPosition: "top",
      horizontalPosition: "left",
      duration: 3000,
      direction: "rtl",
    });
  }

  selectionChange() {
    this.skip = 0;
    this.getUserList();
  }

  // باز گزداندن صفحه به حالت اول
  resetPage() {
    this.skip = 0;
    this.limit = 10;
    this.getUserList();
  }

  // صفحه بعد
  nextPage() {
    if (this.skip + this.limit < this.count) {
      this.skip += this.limit;
      this.getUserList();
    } else {
      this.skip = this.count - this.limit;
      this.getUserList();
    }
  }

  // صفحه قبل
  prevPage() {
    if (this.skip - this.limit > 0) {
      this.skip -= this.limit;
      this.getUserList();
    } else {
      this.skip = 0;
      this.getUserList();
    }
  }

  // صفحه اول
  firstPage() {
    this.skip = 0;
    this.getUserList();
  }

  // صفحه آخر
  lastPage() {
    this.skip = this.count - this.limit;
    this.getUserList();
  }

  openEditDialog(user: UserDto) {
    this.dialog
      .open(EditUserComponent, {
        width: "500px",
        data: { user },
      })
      .afterClosed()
      .subscribe((resp) => {
        if (typeof resp !== "undefined") {
          this.userService.adminUpdate(resp).subscribe(
            (res) => {
              this.snackBar.open("ویرایش با موفقیت انجام شد", null, {
                horizontalPosition: "left",
                verticalPosition: "top",
                duration: 3000,
              });
            },
            (error) => console.log(error)
          );
        }
      });
  }

  // گرفتن لیست کاربران
  async getUserList() {
    try {
      this.loading = true;
      await this.userService
        .getUserList({
          search: this.search,
          skip: this.skip.toString(),
          limit: this.limit.toString(),
        })
        .pipe(
          map((res) => {
            this.users = res.users;
            this.count = res.count;
          })
        )
        .toPromise();
      this.loading = false;
    } catch (error) {
      console.log(error);
      this.loading = false;
    }
  }
}
