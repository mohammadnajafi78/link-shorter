import { map } from "rxjs/operators";
import { TicketDto, Messages } from "src/app/models/ticket.dto";
import { TicketService } from "src/app/services/ticket.service";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.scss"],
})
export class MessagesComponent implements OnInit {
  tickets: TicketDto[];
  messages: Messages;
  loading: boolean;
  limit: number;
  skip: number;
  count: number;
  displayedColumns: string[] = [
    "index",
    "phone",
    "name",
    "family",
    "subject",
    "createdAt",
    "action",
  ];
  constructor(
    private readonly ticketService: TicketService,
    private readonly snackBar: MatSnackBar
  ) {
    this.tickets = [];
    this.messages = { from: "user" };
    this.loading = false;
    this.limit = 10;
    this.skip = 0;
    this.count = 0;
  }

  ngOnInit(): void {
    this.getUserTcikets();
  }

  async getUserTcikets() {
    try {
      this.loading = true;
      await this.ticketService
        .getUserTicket({
          skip: this.skip.toString(),
          limit: this.limit.toString(),
        })
        .pipe(
          map((res) => {
            this.tickets = res.tickets;
            this.count = res.count;
          })
        )
        .toPromise();
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  async responseTicket(ticket: TicketDto) {
    try {
      ticket.messages.push(this.messages);
      ticket.read = false;
      await this.ticketService
        .sendResponse(ticket)
        .pipe(
          map((res) => {
            if (res.status) {
              this.snackBar.open("پیام با موفیت ارسال شد", null, {
                verticalPosition: "bottom",
                horizontalPosition: "center",
                duration: 3000,
              });
              this.messages.message = "";
              this.getUserTcikets();
            }
          })
        )
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  // صفحه بعد
  nextPage() {
    if (this.skip + this.limit < this.count) {
      this.skip += this.limit;
      this.getUserTcikets();
    } else {
      this.skip = this.count - this.limit;
      this.getUserTcikets();
    }
  }

  // صفحه قبل
  prevPage() {
    if (this.skip - this.limit > 0) {
      this.skip -= this.limit;
      this.getUserTcikets();
    } else {
      this.skip = 0;
      this.getUserTcikets();
    }
  }
}
