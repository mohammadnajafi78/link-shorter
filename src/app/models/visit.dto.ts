import {LinkDto} from './link.dto';

export interface VisitDto {
  readonly _id?: string;
  country?: string;
  link?: LinkDto;
}

export interface VisitChart {
  // readonly _id?: string;
  name?: Date;
  value?: number;
}

export interface VisitTable {
  country?: string;
  click?: number;
}
