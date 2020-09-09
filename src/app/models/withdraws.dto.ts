import { UserDto } from "./user.dto";

export interface WithdrawsDto {
  readonly _id?: string;
  status?: string;
  amount?: number;
  user?: UserDto;
  trackNumber?: number;
  type?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
