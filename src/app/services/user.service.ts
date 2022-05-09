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

  login(username: string, password: string) {
    return this.http.post<{ token: string; status: boolean }>(
      `${this.base}/login`,
      { username, password }
    );
  }

  signUp(user: UserDto) {
    return this.http.post<{ status: boolean }>(`${this.base}/signup`, user);
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

  usernameExist(username: string) {
    return this.http.post<boolean>(`${this.base}/username`, { username });
  }

  forgetPassword(email: string) {
    return this.http.post<{ status: boolean }>(`${this.base}/forget-password`, {
      email,
    });
  }

  verifyResetPassword(code: string) {
    return this.http.post<{ status: boolean }>(
      `${this.base}/verify/${code}`,
      {}
    );
  }

  changePassword(code: string, password: string) {
    return this.http.post<{ status: boolean }>(`${this.base}/change-password`, {
      code,
      password,
    });
  }
}
