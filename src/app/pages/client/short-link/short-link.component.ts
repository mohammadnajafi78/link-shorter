// import fetchProgress from "fetch-progress";
import { Component, OnInit, Renderer2, Inject } from "@angular/core";
import { LinkService } from "src/app/services/link.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LinkDto } from "src/app/models/link.dto";
import { map } from "rxjs/operators";
import { browser } from "protractor";
import { AdsService } from "../../../services/ads.service";
import { ShowAdsDto } from "../../../models/ads.dto";
import { environment } from "../../../../environments/environment";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-short-link",
  templateUrl: "./short-link.component.html",
  styleUrls: ["./short-link.component.scss"],
})
export class ShortLinkComponent implements OnInit {
  // لینک دریافت شده
  link: LinkDto = {};
  // لینک کوتاه
  shortLink: string;
  // آیا لینک نمایش داده شود یا خیر
  showLink: boolean;
  // تبلیغات
  ads: ShowAdsDto;
  // فرمت لینک
  format: string;
  // تایمر برای انتظار
  timeLeft = 7;
  // برای تایمر
  interval;
  // آیا پاپ آپ باز شود؟
  openPopup: boolean;
  // دامنه سایت
  BASE_URL = environment.url;
  // فرمت های ویدیو
  videoFormat = [".mp4", ".mkv", ".webm", ".ogg", ".mov", ".mkv", ".avi"];
  // فرمت های فایل
  fileFormat = [
    ".asc",
    ".exe",
    ".doc",
    ".docx",
    ".rtf",
    ".msg",
    ".pdf",
    ".txt",
    ".arc",
    ".arj ",
    ".gz",
    ".hqx",
    ".rar",
    ".sit",
    ".tar",
    ".z",
    ".zip",
  ];
  // نمایش دادن میزان دانلود
  showProgess: boolean;
  // خطای دانلود
  advandeError: boolean;

  constructor(
    private readonly linkService: LinkService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly adsService: AdsService,
    private readonly _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) {
    // برای تست
    this.showLink = false;
    this.format = "";
    this.route.paramMap.subscribe((params) => {
      this.shortLink = params.get("shortLink");
      this.getLinkByShortLink(this.shortLink);
    });
    this.ads = { horizontals: [], verticals: [], popup: [] };
    this.openPopup = false;
    this.showProgess = false;
    this.advandeError = false;
  }

  ngOnInit(): void {
    // دریافت تبلیغات
    this.getAds();
    let script = this._renderer2.createElement("script");
    script.type = `text/javascript`;
    script.text = `
    (function(){
      var now = new Date();
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.async = true;
      var script_address = 'https://cdn.yektanet.com/js/10ad.co/native-10ad.co-9968.js';
      script.src = script_address + '?v=' + now.getFullYear().toString() + '0' + now.getMonth() + '0' + now.getDate() + '0' + now.getHours();
      head.appendChild(script);
      })();
    `;
    this._renderer2.appendChild(this._document.head, script);
  }

  popUp() {
    // آیا پاپ آپ باز شود؟
    if (!this.openPopup && this.link.popUp) {
      // باز کردن پاپ آپ
      const newWindow = window.open(
        this.ads.popup[0].link,
        "bottom",
        "height=600,width=800"
      );
      if (window.focus) {
        newWindow.focus();
      }
      this.openPopup = true;
    }
  }

  findLinkFormat(): string {
    // آیا نوع لینک ویدیو است؟
    let type = this.videoFormat.some((el) => this.link.mainLink.includes(el));
    if (type) {
      return "video";
    } else {
      // آیا نوع لینک فایل است؟
      type = this.fileFormat.some((el) => {
        return this.link.mainLink.includes(el);
      });
      if (type) {
        return "file";
      }
    }
    // نوع خاصی نیست
    return "default";
  }

  // گرفتن لینک با لینک کوتاه
  async getLinkByShortLink(shortLink: string) {
    try {
      await this.linkService
        .getLinkByShortLink(shortLink)
        .pipe(
          map((res) => {
            this.link = res.link;
            if (!this.link.showAds) {
              if (this.link.shortLink.startsWith("http")) {
                window.location.href = this.link.mainLink;
              } else {
                window.location.href = "https://" + this.link.mainLink;
              }
            }
            this.format = this.findLinkFormat();
          })
        )
        .toPromise();
    } catch (error) {
      this.router.navigate(["/page/not-found"]);
      console.log(error);
    }
  }

  goToLink(link: string) {
    if (link.startsWith("http")) {
      window.open(link);
    } else {
      window.open("https://" + link);
    }
  }

  advanceDownload(link: string) {
    this.showProgess = true;
    fetch(link)
      .then((resp) => resp.blob())
      .then((blob) => {
        const objectURL = URL.createObjectURL(blob);
        const element = document.createElement("a");
        element.href = objectURL;
        element.download = "";
        element.click();
      })
      .then((res) => {
        this.showProgess = false;
      })
      .catch((error) => {
        this.advandeError = true;
      });
  }

  async getAds() {
    await this.adsService
      .showAds()
      .pipe(
        map((res) => {
          this.ads = res;
        })
      )
      .toPromise();
  }

  resolved(captchaResponse: string, id: string) {
    if (captchaResponse !== null) {
      this.linkService.createVisit(id).subscribe(
        (res) => {
          this.showLink = res.status;
          this.getAds();
          this.startTimer();
          // this.link.mainLink.some();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
    }, 1000);
  }
}
