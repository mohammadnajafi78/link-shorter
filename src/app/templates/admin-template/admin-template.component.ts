import { Component } from "@angular/core";

@Component({
  selector: "app-admin-template",
  templateUrl: "./admin-template.component.html",
  styleUrls: ["./admin-template.component.scss"],
})
export class AdminTemplateComponent {
  routes = [
    { title: "داشبورد", path: "/admin/dashboard", icon: "home" },
    { title: "کاربران", path: "/admin/dashboard/users", icon: "person" },
    { title: "لینک ها", path: "/admin/dashboard/links", icon: "links" },
    {
      title: "برداشت ها",
      path: "/admin/dashboard/withdraws",
      icon: "attach_money",
    },
    { title: "تبلیغات", path: "/admin/dashboard/ads", icon: "money" },
    {
      title: "اطلاعیه ها",
      path: "/admin/dashboard/notifications",
      icon: "notification_important",
    },
    { title: "تیکت ها", path: "/admin/dashboard/tickets", icon: "local_offer" },
    { title: "تنظیمات", path: "/admin/dashboard/setting", icon: "settings" },
  ];

  constructor() {}
}
