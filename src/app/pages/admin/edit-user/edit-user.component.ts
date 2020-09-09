import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserDto} from '../../../models/user.dto';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user: UserDto;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: UserDto },
    public dialogRef: MatDialogRef<EditUserComponent>
  ) {
    this.user = data.user;
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(this.user);
  }

}
