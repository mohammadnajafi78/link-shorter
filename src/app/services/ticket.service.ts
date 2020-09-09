import { Messages } from "src/app/models/ticket.dto";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TicketDto } from "../models/ticket.dto";

@Injectable({
  providedIn: "root",
})
export class TicketService {
  base = "/api/tickets";

  constructor(private readonly http: HttpClient) {}

  // گرفتن لیست تیکت ها
  getTicketList(params: {
    search?: string;
    skip?: string;
    limit?: string;
    read: string;
  }) {
    return this.http.get<{ tickets: TicketDto[]; count: number }>(
      `${this.base}/all`,
      {
        params,
      }
    );
  }

  // خواندن تیکت
  readTicket(id: string) {
    return this.http.put<{ ticket: TicketDto }>(`${this.base}/${id}`, {});
  }

  // ایجاد لینک کوتاه جدید
  create(ticket: TicketDto) {
    return this.http.post<{ ticket: TicketDto }>(this.base, ticket);
  }

  // گرفتن لینک با آیدی
  getTicketById(id: string) {
    return this.http.get<{ ticket: TicketDto }>(`${this.base}/${id}`);
  }

  // ارسال جواب با تیکت پشتیبانی
  sendResponse(ticket: TicketDto) {
    return this.http.post<{ status: boolean }>(`${this.base}/response`, ticket);
  }

  // لیست تیکت های یک کاربر
  getUserTicket(params: { skip?: string; limit?: string }) {
    return this.http.get<{ tickets: TicketDto[]; count: number }>(this.base, {
      params,
    });
  }
}
