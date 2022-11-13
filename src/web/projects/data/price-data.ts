// Prices

import {
  Price,
  PriceAgeGroup,
  PriceClubMemberStatus,
  PriceMapping,
  SportType,
} from 'projects/shared-lib/src/lib/domain-models';

export const BUS_ONLY_PRICE_DATA: Price = {
  // Nur Busfahrt
  id: PriceMapping.Bus,
  label: PriceMapping.Bus,
  ageGroup: [
    {
      // Alle Altersgruppen
      group: PriceAgeGroup.All,
      clubMemberStatus: [
        {
          // Nichtmitgled / Alle
          clubMemberStatus: PriceClubMemberStatus.All,
          value: '30 EURO',
        },
      ],
    },
  ],
};

export const BUS_AND_PASS_PRICE_DATA: Price[] = [
  {
    // Busfahrt und Skipass
    id: PriceMapping.BusAndPass,
    label: PriceMapping.BusAndPass,
    ageGroup: [
      {
        group: PriceAgeGroup.Adult,
        clubMemberStatus: [
          {
            // Mitgled
            clubMemberStatus: PriceClubMemberStatus.Member,
            value: '75 EURO',
          },
          {
            // Nichtmitgled / Alle
            clubMemberStatus: PriceClubMemberStatus.All,
            value: '85 EURO',
          },
        ],
      },
      {
        group: PriceAgeGroup.Teenager,
        clubMemberStatus: [
          {
            // Mitgled
            clubMemberStatus: PriceClubMemberStatus.Member,
            value: '65 EURO',
          },
          {
            // Nichtmitgled / Alle
            clubMemberStatus: PriceClubMemberStatus.All,
            value: '75 EURO',
          },
        ],
      },
      {
        group: PriceAgeGroup.Child,
        clubMemberStatus: [
          {
            // Mitgled
            clubMemberStatus: PriceClubMemberStatus.Member,
            value: '50 EURO',
          },
          {
            // Nichtmitgled / Alle
            clubMemberStatus: PriceClubMemberStatus.All,
            value: '55 EURO',
          },
        ],
      },
    ],
  },
];

export const COURSE_ON_TRAVEL_PRICE_DATA: Price[] = [
  // Kurspreise bei Ausfahrten
  {
    id: PriceMapping.CourseOnTravel,
    label: PriceMapping.CourseOnTravel,
    ageGroup: [
      {
        // Alle
        group: PriceAgeGroup.All,
        clubMemberStatus: [
          {
            // Mitgled
            clubMemberStatus: PriceClubMemberStatus.Member,
            value: '35 EURO',
          },
          {
            // Nichtmitgled / Alle
            clubMemberStatus: PriceClubMemberStatus.All,
            value: '40 EURO',
          },
        ],
      },
    ],
  },
];

export const COURSE_AT_HOME_PRICE_DATA: Price[] = [
  // Kurspreise bei Ausfahrten
  {
    id: PriceMapping.CourseAtHome,
    label: PriceMapping.CourseAtHome,
    sportType: [
      {
        // Snowboard
        type: SportType.Snowboard,
        ageGroup: [
          {
            // Erwachsene
            group: PriceAgeGroup.Adult,
            clubMemberStatus: [
              {
                // Mitgled
                clubMemberStatus: PriceClubMemberStatus.Member,
                value: '45 EURO',
              },
              {
                // Nichtmitgled / Alle
                clubMemberStatus: PriceClubMemberStatus.All,
                value: '55 EURO',
              },
            ],
          },
          {
            // Kinder
            group: PriceAgeGroup.Child,
            clubMemberStatus: [
              {
                // Mitgled
                clubMemberStatus: PriceClubMemberStatus.Member,
                value: '35 EURO',
              },
              {
                // Nichtmitgled / Alle
                clubMemberStatus: PriceClubMemberStatus.All,
                value: '45 EURO',
              },
            ],
          },
        ],
      },
      {
        // Alpin
        type: SportType.Alpin,
        ageGroup: [
          {
            // Erwachsene
            group: PriceAgeGroup.Adult,
            clubMemberStatus: [
              {
                // Mitgled
                clubMemberStatus: PriceClubMemberStatus.Member,
                value: '50 EURO',
              },
              {
                // Nichtmitgled / Alle
                clubMemberStatus: PriceClubMemberStatus.All,
                value: '60 EURO',
              },
            ],
          },
          {
            // Kinder
            group: PriceAgeGroup.Child,
            clubMemberStatus: [
              {
                // Mitgled
                clubMemberStatus: PriceClubMemberStatus.Member,
                value: '40 EURO',
              },
              {
                // Nichtmitgled / Alle
                clubMemberStatus: PriceClubMemberStatus.All,
                value: '50 EURO',
              },
            ],
          },
        ],
      },
    ],
  },
];
