import { UserDto } from "./user.dto";
export interface TicketDto {
  readonly _id?: string;
  name?: string;
  family?: string;
  phone?: string;
  content?: string;
  subject?: string;
  read?: boolean;
  email?: string;
  user?: UserDto;
  messages?: Messages[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
export class Messages {
  from?: string;
  message?: string;
}
