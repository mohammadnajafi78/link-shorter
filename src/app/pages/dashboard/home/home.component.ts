import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {NotificationDto} from '../../../models/notification.dto';
import {map} from 'rxjs/operators';
import {LinkService} from '../../../services/link.service';
import {UserService} from '../../../services/user.service';
import {UserDto} from '../../../models/user.dto';
import {VisitChart, VisitDto, VisitTable} from '../../../models/visit.dto';
import * as moment from 'jalali-moment';

const multi = [
  {
    name: 'تعداد کلیک',
    series: [],
  },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  linkCount: number;
  notifications: NotificationDto[];
  user: UserDto;
  visitChart: VisitChart[];
  multi: any[];
  view: any[] = [700, 300];
  visitTable: VisitTable[];
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'تاریخ روزها';
  yAxisLabel = 'تعداد کلیک';
  timeline = true;
  totalVisit: number;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly linkService: LinkService,
    private readonly userService: UserService
  ) {
    this.notifications = [];
    this.linkCount = 0;
    this.visitChart = [];
    Object.assign(this, {multi});
    userService.user$.subscribe(res => {
      this.user = res;
    });
    this.totalVisit = 0;
    this.view = [innerWidth / 1.3, 400];
  }

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };

  ngOnInit(): void {
    this.getAllNotifications();
    this.getLinkCount();
    this.getUserVisit();
  }
  onResize(event) {
    this.view = [event.target.innerWidth / 1.35, 400];
  }
  async getAllNotifications() {
    await this.notificationService.findAll({status: 'true'}).pipe(map(res => {
      this.notifications = res.notifications;
    })).toPromise();
  }

  async getLinkCount() {
    await this.linkService.getUserLinkList({showAds: 'true'}).pipe(map(res => {
      this.linkCount = res.count;
    })).toPromise();
  }

  getUserVisit() {
    try {
      this.linkService.getUserVisit().subscribe(res => {
        this.visitChart = res.visitChart;
        for (const element of res.visitChart) {
          element.name = moment(new Date(element.name).getTime())
            .locale('fa')
            .format('YY/MM/DD');
          this.totalVisit += element.value;
        }
        multi[0].series = res.visitChart;
      });
    } catch (error) {
      console.log(error);
    }
  }

}
