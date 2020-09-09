import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "link",
})
export class LinkPipe implements PipeTransform {
  transform(value: string, format?: string): any {
    try {
      const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/;
      return value.match(regex)[1];
    } catch (error) {
      return value;
    }
  }
}
