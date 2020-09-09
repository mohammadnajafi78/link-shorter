import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { TicketDto } from "src/app/models/ticket.dto";
import { TicketService } from "src/app/services/ticket.service";
import { map, debounceTime } from "rxjs/operators";
import { pipe } from "rxjs";

@Component({
  selector: "app-tickets",
  templateUrl: "./tickets.component.html",
  styleUrls: ["./tickets.component.scss"],
})
export class TicketsComponent implements OnInit {
  tickets: TicketDto[];
  search: string;
  searchControl = new FormControl();
  limit: number;
  skip: number;
  loading: boolean;
  count: number;
  read: boolean;
  displayedColumns: string[] = [
    "index",
    "phone",
    "name",
    "family",
    "subject",
    "createdAt",
    "updatedAt",
    "action",
  ];

  constructor(private readonly ticketService: TicketService) {
    this.tickets = [];
    this.search = "";
    this.limit = 10;
    this.skip = 0;
    this.loading = false;
    this.count = 0;
    this.read = false;
  }

  ngOnInit(): void {
    this.getTicketList();

    // جست و جو در موضوع تیکت
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((val) => {
      this.search = val;
      this.resetPage();
    });
  }

  selectionChange() {
    this.skip = 0;
    this.resetPage();
  }

  // باز گزداندن صفحه به حالت اول
  resetPage() {
    this.skip = 0;
    this.limit = 10;
    this.getTicketList();
  }

  // صفحه بعد
  nextPage() {
    if (this.skip + this.limit < this.count) {
      this.skip += this.limit;
      this.getTicketList();
    } else {
      this.skip = this.count - this.limit;
      this.getTicketList();
    }
  }

  // صفحه قبل
  prevPage() {
    if (this.skip - this.limit > 0) {
      this.skip -= this.limit;
      this.getTicketList();
    } else {
      this.skip = 0;
      this.getTicketList();
    }
  }

  // صفحه اول
  firstPage() {
    this.skip = 0;
    this.getTicketList();
  }

  // صفحه آخر
  lastPage() {
    this.skip = this.count - this.limit;
    this.getTicketList();
  }

  // گرفتن لیست تیکت ها
  async getTicketList() {
    try {
      this.loading = true;
      await this.ticketService
        .getTicketList({
          search: this.search,
          skip: this.skip.toString(),
          limit: this.limit.toString(),
          read: `${this.read}`,
        })
        .pipe(
          map((res) => {
            this.count = res.count;
            this.tickets = res.tickets;
          })
        )
        .toPromise();
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    } finally {
      this.loading = false;
    }
  }
}
