import {Component, OnInit, Inject} from '@angular/core';
import {SettingDto, WithdrawsMethod} from 'src/app/models/setting.model';
import {SettingService} from 'src/app/services/setting.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-withdraw-method',
  templateUrl: './withdraw-method.component.html',
  styleUrls: ['./withdraw-method.component.scss'],
})
export class WithdrawMethodComponent implements OnInit {
  withdrawsMehods: {
    title?: string;
    description?: string;
    min?: number;
    active?: boolean;
  };
  formControl: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<WithdrawsMethod>,
    private readonly settingService: SettingService,
    @Inject(MAT_DIALOG_DATA)
    public data: { WithdrawsMethod: any; state: string }
  ) {
    this.withdrawsMehods = data.WithdrawsMethod;
  }

  ngOnInit(): void {
    this.formControl = new FormBuilder().group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      min: ['', Validators.required],
    });
  }

  onYesClick(): void {
    if (this.formControl.valid) {
      this.dialogRef.close({
        withdrawsMethod: this.withdrawsMehods,
        status: true,
      });
    }
  }

  get inputs() {
    return this.formControl.controls;
  }

  onNoClick(): void {
    this.dialogRef.close({status: false});
  }
}
