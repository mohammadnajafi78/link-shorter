import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LinkDto } from "../models/link.dto";
import { VisitDto, VisitChart } from "../models/visit.dto";

@Injectable({
  providedIn: "root",
})
export class LinkService {
  constructor(private readonly http: HttpClient) {}

  base = "/api/links";

  // گرفتن لینک های کابر
  getLinkList(params: {
    search?: string;
    skip?: string;
    limit?: string;
    status?: string;
  }) {
    return this.http.get<{ links: LinkDto[]; count: number }>(
      `${this.base}/all`,
      { params }
    );
  }

  // گرفتن لینک های یک کاربر
  getUserLinkList(params: {
    search?: string;
    skip?: string;
    limit?: string;
    status?: string;
    showAds?: string;
  }) {
    return this.http.get<{ links: LinkDto[]; count: number }>(`${this.base}`, {
      params,
    });
  }

  // ایجاد لینک کوتاه جدید
  createLink(newLink: LinkDto) {
    newLink.mainLink = newLink.mainLink.trim();
    return this.http.post<{ link: LinkDto }>(this.base, newLink);
  }

  // ویرایش لینک
  update(id: string, newLink: LinkDto) {
    return this.http.put<{ status: boolean }>(`${this.base}/${id}`, newLink);
  }

  // گرفتن لینک با آیدی
  getVisit(id: string) {
    return this.http.get<{ visits: VisitDto[]; visitChart: any[] }>(
      `${this.base}/visits/${id}`
    );
  }

  getUserVisit() {
    return this.http.get<{ visitChart: any }>(`${this.base}/visit/all`);
  }

  // گرفتن لینک با لینک کوتاه
  getLinkByShortLink(shortLink: string) {
    return this.http.get<{ link: LinkDto }>(`${this.base}/${shortLink}`);
  }

  // ایجاد یک بازدید جدید
  createVisit(id: string) {
    return this.http.post<{ status: boolean }>(`${this.base}/visit`, {
      link: id,
    });
  }
}
