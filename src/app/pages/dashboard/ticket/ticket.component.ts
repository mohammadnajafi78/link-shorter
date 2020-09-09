import { UserDto } from "./../../../models/user.dto";
import { UserService } from "./../../../services/user.service";
import { Component, OnInit } from "@angular/core";
import { TicketDto } from "src/app/models/ticket.dto";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { TicketService } from "src/app/services/ticket.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";

@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.scss"],
})
export class TicketComponent implements OnInit {
  ticket: TicketDto;
  ticketForm: FormGroup;
  user: UserDto;
  constructor(
    private readonly ticketService: TicketService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    private readonly userService: UserService
  ) {
    this.ticket = {};
    this.userService.user$.subscribe((res) => {
      this.user = res;
    });
  }

  ngOnInit(): void {
    this.ticketForm = new FormBuilder().group({
      name: ["", Validators.required],
      family: ["", Validators.required],
      phone: ["", [Validators.required, Validators.pattern(/0?[1-9][0-9]{9}/)]],
      subject: ["", Validators.required],
      email: ["", [Validators.required]],
      content: ["", Validators.required],
    });
  }

  createTicket() {
    try {
      if (this.ticketForm.valid) {
        this.ticket.phone = this.user.phone;
        this.ticketService.create(this.ticket).subscribe((res) => {
          this.snackbar.open("تیکت با موفقیت ارسال شد", null, {
            duration: 5000,
            verticalPosition: "bottom",
            horizontalPosition: "center",
          });
          this.router.navigate(["/"]);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  get inputs() {
    return this.ticketForm.controls;
  }
}
