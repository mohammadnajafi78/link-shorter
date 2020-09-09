import {Component, OnInit} from '@angular/core';
import {VisitDto, VisitChart, VisitTable} from 'src/app/models/visit.dto';
import {LinkService} from 'src/app/services/link.service';
import {ActivatedRoute} from '@angular/router';
// import { NgxChartsModule } from "@swimlane/ngx-charts";
import * as moment from 'jalali-moment';

const multi = [
  {
    name: 'تعداد کلیک',
    series: [],
  },
];

@Component({
  selector: 'app-link-detail',
  templateUrl: './link-detail.component.html',
  styleUrls: ['./link-detail.component.scss'],
})
export class LinkDetailComponent implements OnInit {
  visits: VisitDto[] = [];
  visitChart: VisitChart[];
  displayedColumns: string[] = ['index', 'country', 'count'];
  multi: any[];
  view: any[] = [700, 300];
  // visit table
  visitTable: VisitTable[];
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'تاریخ روزها';
  yAxisLabel = 'تعداد کلیک';
  timeline = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };

  constructor(
    private readonly linkService: LinkService,
    private readonly route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      this.getVisit(params.get('id'));
    });
    this.visitChart = [];
    Object.assign(this, {multi});
    this.visitTable = [{country: 'ایران', click: 0}, {country: 'خارج', click: 0}];
    this.view = [innerWidth / 1.3, 400];

  }

  ngOnInit(): void {
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.35, 400];
  }

  getVisit(id: string) {
    try {
      this.linkService.getVisit(id).subscribe((res) => {
        this.visits = res.visits;
        this.visitChart = res.visitChart;
        // محاسبه تاریخ شمسی برای نمودار
        for (const element of res.visitChart) {
          element.name = moment(new Date(element.name).getTime())
            .locale('fa')
            .format('YY/MM/DD');
        }
        // محاسبه تعداد کلیک داحلی و خارجی برای جدول
        for (const element of res.visits) {
          if (element.country === 'IR') {
            this.visitTable[0].click++;
          } else {
            this.visitTable[1].click++;
          }
        }
        multi[0].series = res.visitChart;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
