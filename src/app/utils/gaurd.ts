import { CanActivate, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable()
export class Guard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      if (!localStorage.getItem("token")) {
        throw false;
      }
      const user = await this.userService
        .profile()
        .pipe(
          map((res) => {
            return res.user;
          })
        )
        .toPromise();

      if (user.role === "admin" && user.status !== "block") {
        return true;
      } else {
        throw false;
      }
    } catch (error) {
      this.router.navigate(["/page/not-found"]);
      throw false;
    }
  }
}
