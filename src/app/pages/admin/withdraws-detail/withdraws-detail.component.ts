import {Component, OnInit} from '@angular/core';
import {WithdrawsDto} from 'src/app/models/withdraws.dto';
import {WithdrawsService} from 'src/app/services/withdraws.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-withdraws-detail',
  templateUrl: './withdraws-detail.component.html',
  styleUrls: ['./withdraws-detail.component.scss'],
})
export class WithdrawsDetailComponent implements OnInit {
  withdraws: WithdrawsDto;

  constructor(
    private readonly withdrawsService: WithdrawsService,
    private readonly route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      this.getWithdrawsById(params.get('id'));
    });
    this.withdraws = {};
  }

  ngOnInit(): void {
  }

   getWithdrawsById(id: string) {
    try {
      this.withdrawsService.getWothdrawsById(id).subscribe((res) => {
        this.withdraws = res.withdraws;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
