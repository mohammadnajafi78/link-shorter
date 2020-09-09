export interface WithdrawsMethod {
  _id?: string;
  title?: string;
  description?: string;
  min?: number;
  active?: boolean;
}

export interface CPCDto {
  first?: number;
  second?: number;
  third?: number;
}

export interface SettingDto {
  readonly _id?: string;
  minWithdraws?: number;
  iranCPC?: CPCDto;
  foreignCPC?: CPCDto;
  withdrawsMethods?: WithdrawsMethod[];
}
