import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AdsDto, ShowAdsDto } from "../models/ads.dto";

@Injectable({
  providedIn: "root",
})
export class AdsService {
  base = "/api/ads";

  constructor(private readonly http: HttpClient) {}

  create(ads: AdsDto) {
    return this.http.post<{ ads: AdsDto }>(this.base, ads);
  }

  getAll(params: {
    search?: string;
    type?: string;
    skip?: string;
    limit?: string;
  }) {
    return this.http.get<{ ads: AdsDto[]; count: number }>(`${this.base}/all`, {
      params,
    });
  }

  showAds() {
    return this.http.get<ShowAdsDto>(this.base);
  }

  update(id: string, ads: AdsDto) {
    return this.http.put<{ ads: AdsDto }>(`${this.base}/${id}`, ads);
  }

  delete(id: string) {
    return this.http.delete<{ ads: AdsDto }>(`${this.base}/${id}`);
  }

  showVideoAds(params: { type: string }) {
    return this.http.get<{ ads: AdsDto[] }>(`${this.base}/video`, { params });
  }
}
