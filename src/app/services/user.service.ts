import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { UserDto } from "../models/user.dto";

@Injectable({
  providedIn: "root",
})
export class UserService {
  user$: BehaviorSubject<UserDto>;

  constructor(private readonly http: HttpClient) {
    this.user$ = new BehaviorSubject(null);
    if (!!localStorage.getItem("token")) {
      this.profile().subscribe((res) => {
        this.user$.next(res.user);
      });
    }
  }

  base = "/api/users";

  signin(phone: string, identifier?: string) {
    return this.http.post<{ status: boolean }>(`${this.base}/signin`, {
      phone,
      identifier,
    });
  }

  verify(phone: string, key: string) {
    return this.http.post<{ message: string; token: string }>(
      `${this.base}/verify`,
      { phone, key }
    );
  }

  findSubset() {
    return this.http.get<{ users: UserDto[] }>(`${this.base}/subset`);
  }

  profile() {
    return this.http.get<{ user: UserDto }>(`${this.base}/profile`);
  }

  getUserList(params: { skip?: string; limit?: string; search?: string }) {
    return this.http.get<{ users: UserDto[]; count: number }>(this.base, {
      params,
    });
  }

  adminUpdate(user: UserDto) {
    return this.http.put(`${this.base}/${user._id}`, user);
  }

  updateUser(user: UserDto) {
    return this.http.put<{ status: boolean }>(`${this.base}/profile`, user);
  }
}
