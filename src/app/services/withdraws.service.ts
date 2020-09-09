import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { async } from "@angular/core/testing";
import { WithdrawsDto } from "../models/withdraws.dto";

@Injectable({
  providedIn: "root",
})
export class WithdrawsService {
  base = "/api/withdraws";

  constructor(private readonly http: HttpClient) {}

  // گرفتن لیست همه برداشت ها
  getWithdrawsList(params: {
    skip?: string;
    limit?: string;
    search?: string;
    status: string;
  }) {
    return this.http.get<{ withdraws: WithdrawsDto[]; count: number }>(
      `${this.base}/all`,
      { params }
    );
  }

  // ایجاد یک برداشت
  create(amount: number) {
    return this.http.post<{ withdraws: WithdrawsDto }>(this.base, { amount });
  }

  // گرفتن اطلاعات یک برداشت
  getWothdrawsById(id: string) {
    return this.http.get<{ withdraws: WithdrawsDto }>(`${this.base}/${id}`);
  }

  // کنسل کردن برداشت
  setCancelWithdraws(id: string) {
    return this.http.put<{ withdraws: WithdrawsDto }>(
      `${this.base}/cancel/${id}`,
      {}
    );
  }

  // موفقیت آمیز بودن یک برداشت
  setSuccessWithdraws(id: string, trackNumber: number) {
    return this.http.put<{ withdraws: WithdrawsDto }>(
      `${this.base}/success/${id}`,
      { trackNumber }
    );
  }

  // گرفتن برداشت های یک کاربر
  getUserWithdrawsList(params: { skip?: string; limit?: string }) {
    return this.http.get<{ withdraws: WithdrawsDto[]; count: number }>(
      this.base,
      { params }
    );
  }
}
