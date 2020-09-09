import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "jalali-moment";

@Pipe({
  name: "jalaali",
})
export class JalaaliPipe implements PipeTransform {
  transform(value: any, format?: string): any {
    try {
      if (value === "now") {
        value = Date.now();
      }
      return moment(new Date(value).getTime())
        .locale("fa")
        .format(format || "dddd  jD jMMMM jYYYY ، ساعت HH:mm");
    } catch (error) {
      return value;
    }
  }
}
