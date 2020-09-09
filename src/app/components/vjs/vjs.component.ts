import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import videojs from "video.js";
import "videojs-overlay";
import { AdsService } from "../../services/ads.service";
import { AdsDto } from "../../models/ads.dto";
import { environment } from "src/environments/environment";
import "videojs-contrib-ads";
@Component({
  selector: "app-vjs",
  templateUrl: "./vjs.component.html",
  styleUrls: ["./vjs.component.scss"],
})
export class VjsComponent implements OnInit, OnDestroy {
  @ViewChild("target", { static: true }) target: ElementRef;
  @Input() src: string;
  // @Input() ads: string;
  player: videojs.Player;
  ads: AdsDto;
  BASE_URL = environment.url;

  constructor(
    private elementRef: ElementRef,
    private readonly adsService: AdsService
  ) {
    this.ads = {};
  }

  ngOnInit() {
    this.player = videojs(this.target.nativeElement, {
      sources: {
        src: this.src,
        type: "video/mp4",
      },
      controls: true,
      playbackRates: [0.5, 1, 1.5, 2],
    });

    this.player.ready(() => {
      this.showAds();
      this.player.on("play", () => {
        this.showAds();
      });
    });
  }

  async showAds() {
    try {
      await this.adsService.showVideoAds().subscribe((res) => {
        this.ads = res.ads[0];
      });
      this.player.overlay({
        overlays: [
          {
            content: `<a href=${this.ads.link} target='_blank'>
                         <img  class=image  src=${this.BASE_URL}/api/${this.ads.image}>
                      </a>`,
            showBackground: false,
            class: "image",
            start: "pause",
            end: "playing",
            align: "bottom",
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }
}
