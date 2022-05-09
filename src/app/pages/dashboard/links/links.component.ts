import { Component, OnInit } from "@angular/core";
import { LinkDto } from "src/app/models/link.dto";
import { FormControl } from "@angular/forms";
import { LinkService } from "src/app/services/link.service";
import { map, debounceTime } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-links",
  templateUrl: "./links.component.html",
  styleUrls: ["./links.component.scss"],
})
export class LinksComponent implements OnInit {
  links: LinkDto[];
  status: string;
  loading: boolean;
  count: number;
  search: string;
  searchControl = new FormControl();
  skip: number;
  limit: number;
  url: string = environment.url;

  constructor(
    private readonly linkService: LinkService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.links = [];
    this.status = "active";
    this.loading = false;
    this.count = 0;
    this.search = "";
    this.skip = 0;
    this.limit = 10;
  }

  ngOnInit(): void {
    this.getUserLinkList();
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe((val) => {
      this.search = val;
      this.resetPage();
    });
  }

  // صفحه بعد
  nextPage() {
    this.skip += this.limit;
    this.getUserLinkList();
  }

  // صفحه قبل
  prevPage() {
    this.skip -= this.limit;
    this.getUserLinkList();
  }

  resetPage() {
    this.skip = 0;
    this.limit = 10;
    this.getUserLinkList();
  }

  async getUserLinkList() {
    try {
      this.loading = true;
      await this.linkService
        .getUserLinkList({
          search: this.search,
          skip: this.skip.toString(),
          limit: this.limit.toString(),
          status: this.status,
        })
        .pipe(
          map((res) => {
            this.links = res.links;
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

  toggleChange(id: string, showAds: boolean) {
    try {
      this.loading = true;
      this.linkService.update(id, { showAds }).subscribe((res) => {
        this.loading = false;
        if (res.status) {
          this.snackBar.open("با موفقیت انجام شد", null, {
            verticalPosition: "top",
            horizontalPosition: "center",
            duration: 3000,
            direction: "rtl",
          });
        }
      });
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  togglePopUp(id: string, popUp: boolean) {
    try {
      this.loading = true;

      this.linkService.update(id, { popUp }).subscribe((res) => {
        this.loading = false;
        if (res.status) {
          this.snackBar.open("با موفقیت انجام شد", null, {
            verticalPosition: "top",
            horizontalPosition: "center",
            duration: 3000,
            direction: "rtl",
          });
        }
      });
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  goToLink(link: string) {
    if (link.startsWith("http")) {
      window.open(link);
    } else {
      window.open("https://" + link);
    }
  }

  openCopy() {
    this.snackBar.open("لینک کپی شد", null, {
      verticalPosition: "top",
      horizontalPosition: "center",
      duration: 1000,
      direction: "rtl",
    });
  }

  openQuestionDialog(id: string, status: string) {
    this.dialog
      .open(DialogComponent, {
        width: "350px",
        data: { title: "غیر فعال کردن لینک", content: "آیا مطمئن هستید" },
      })
      .afterClosed()
      .subscribe((resp) => {
        if (!!resp) {
          this.linkService.update(id, { status }).subscribe((res) => {
            this.snackBar.open("با موفقیت انجام شد", null, {
              verticalPosition: "top",
              horizontalPosition: "center",
              duration: 3000,
              direction: "rtl",
            });
            this.getUserLinkList();
          });
        }
      });
  }
}
