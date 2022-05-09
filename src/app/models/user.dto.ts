export interface UserDto {
  readonly _id?: string;
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  family?: string;
  address?: string;
  avatar?: string;
  state?: string;
  city?: string;
  country?: string;
  phone?: string;
  salary?: number;
  status?: string;
  role?: string;
  withdrawsType?: string;
  accountAddress?: string;
  identifierCode?: string;
  subsetSalary?: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
