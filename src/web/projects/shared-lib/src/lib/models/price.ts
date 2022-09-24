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
  Pass = 'Skipass',
  BusAndPass = 'Bus und Skipass',
  Bus = 'Bus',
  CourseAtHome = 'Kurse im heimischen Gelände',
  CourseOnTravel = 'Kurse bei den Ausfahrten',
}

export enum PriceClubMemberStatus {
  Member = 'Mitglieder',
  All = 'Nichtmitglieder',
}

export enum PriceAgeGroup {
  All = 'Alle',
  Adult = 'Erwachsene',
  Teenager = 'Jugendliche',
  Child = 'Kinder',
}
