import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "price",
})
export class PricePipe implements PipeTransform {
  transform(value: number, format?: string): any {
    try {
      return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } catch (error) {
      return value;
    }
  }
}
