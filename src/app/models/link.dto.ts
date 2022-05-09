import { UserDto } from "./user.dto";

export interface LinkDto {
  readonly _id?: string;
  mainLink?: string;
  shortLink?: string;
  active?: boolean;
  status?: string;
  user?: UserDto | string;
  showAds?: boolean;
  popUp?: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
