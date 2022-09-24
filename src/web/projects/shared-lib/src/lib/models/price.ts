import { SportType } from './sport-type';

export interface Price {
  id: string;
  sportType?: PriceSplitByBySportType[];
  ageGroup?: PriceSplitByAgeGroup[];
}

export interface PriceSplitByAgeGroup {
  group: PriceAgeGroup;
  clubMemberStatus: PriceSplitPerClubMemberStatus[];
}

export interface PriceSplitPerClubMemberStatus {
  clubMemberStatus: PriceClubMemberStatus;
  value: string;
}

export interface PriceSplitByBySportType {
  type: SportType;
  ageGroup: PriceSplitByAgeGroup[];
}

export enum PriceMapping {
  Pass = 'pass',
  BusAndPass = 'busAndPass',
  Bus = 'bus',
  CourseAtHome = 'courseAtHome',
  CourseOnTravel = 'courseOnTravel',
}

export enum PriceClubMemberStatus {
  Member = 'member',
  All = 'all',
}

export enum PriceAgeGroup {
  All = 'all',
  Adult = 'adult',
  Teenager = 'teenager',
  Child = 'child',
}
