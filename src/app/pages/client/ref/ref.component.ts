import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-ref",
  templateUrl: "./ref.component.html",
  styleUrls: ["./ref.component.scss"],
})
export class RefComponent implements OnInit {
  identifier: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.route.paramMap.subscribe((params) => {
      this.identifier = params.get("identifier");
    });
    localStorage.setItem("identifier", this.identifier);
    this.router.navigate(["/"]);
  }

  ngOnInit(): void {}
}
