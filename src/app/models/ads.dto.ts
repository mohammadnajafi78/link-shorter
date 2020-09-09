export interface AdsDto {
  readonly _id?: string;
  image?: string;
  link?: string;
  active?: boolean;
  type?: string;
  iran?: boolean;
  readonly createdAt?: Date;
}

export interface ShowAdsDto {
  verticals?: AdsDto[];

  horizontals?: AdsDto[];

  popup?: AdsDto[];
}
