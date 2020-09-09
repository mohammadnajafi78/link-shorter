import { CanActivate, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable()
export class BlockGaurd implements CanActivate {
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
      return true;
    } catch (error) {
      this.router.navigate(["/page/not-found"]);
      throw false;
    }
  }
}
