import { Component, OnInit } from "@angular/core";
import { TicketService } from "src/app/services/ticket.service";
import { TicketDto, Messages } from "src/app/models/ticket.dto";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-ticket-detail",
  templateUrl: "./ticket-detail.component.html",
  styleUrls: ["./ticket-detail.component.scss"],
})
export class TicketDetailComponent implements OnInit {
  ticket: TicketDto = {};
  id: string;
  subjectController: FormControl;
  message: Messages;
  textController: FormControl;

  constructor(
    private readonly ticketService: TicketService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get("id");
      this.getTicket(this.id);
    });
    this.message = { from: "admin" };
  }

  ngOnInit(): void {
    this.subjectController = new FormControl("", [Validators.required]);
    this.textController = new FormControl("", [Validators.required]);
  }

  // خوانده شدن تیکت
  async readTicket() {
    try {
      await this.ticketService
        .readTicket(this.id)
        .pipe(
          map((res) => {
            this.ticket = res.ticket;
          })
        )
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  async responseTicket() {
    try {
      if (this.textController.valid) {
        this.ticket.messages.push(this.message);
        await this.ticketService
          .sendResponse(this.ticket)
          .pipe(
            map((res) => {
              if (res.status) {
                this.snackBar.open("تیکت با موفقیت ارسال شد", null, {
                  verticalPosition: "bottom",
                  horizontalPosition: "center",
                  duration: 3000,
                });
                this.router.navigate(["/admin/dashboard/tickets"]);
              }
            })
          )
          .toPromise();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // گرفتن تیکت با آی دی
  getTicket(id: string) {
    try {
      this.ticketService.getTicketById(id).subscribe((res) => {
        this.ticket = res.ticket;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
