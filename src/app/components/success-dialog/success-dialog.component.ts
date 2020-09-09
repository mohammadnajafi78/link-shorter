import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-success-dialog",
  templateUrl: "./success-dialog.component.html",
  styleUrls: ["./success-dialog.component.scss"],
})
export class SuccessDialogComponent implements OnInit {
  trackNumber: number;
  trackNumberController: FormControl;
  constructor(public dialogRef: MatDialogRef<SuccessDialogComponent>) {}

  ngOnInit(): void {
    this.trackNumberController = new FormControl("", [Validators.required]);
  }
  accept() {
    if (this.trackNumberController.valid) {
      this.dialogRef.close(this.trackNumber);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
