import { calculateParticipantPrice, PriceableParticipant } from '../services/trip-pricing-service.js';
import { TripPricing } from '../domain/settings.js';

const pricing: TripPricing = {
  busLift: {
    adult: { member: 20, nonMember: 30 },
    youthUntil16: { member: 15, nonMember: 25 },
    childUntil6: { member: 5, nonMember: 10 },
  },
  busOnly: { member: 10, nonMember: 15 },
  addons: {
    snowshoes: { member: 8, nonMember: 12 },
    technikHalf: { member: 20, nonMember: 25 },
    technikFull: { member: 35, nonMember: 40 },
    courseBeginner: { member: 18, nonMember: 22 },
    courseAdvanced: { member: 24, nonMember: 28 },
  },
};

const base = (overrides: Partial<PriceableParticipant>): PriceableParticipant => ({
  busOnly: false,
  snowshoes: false,
  courseRequested: false,
  level: undefined,
  ageCategory: 'adult',
  isMember: false,
  ...overrides,
});

describe('calculateParticipantPrice', () => {
  it('busOnly: nutzt busOnly-Preis statt Alters-Staffel', () => {
    expect(calculateParticipantPrice(base({ busOnly: true, isMember: false }), pricing)).toBe(15);
    expect(calculateParticipantPrice(base({ busOnly: true, isMember: true }), pricing)).toBe(10);
  });

  it('busLift: gestaffelt nach Alterskategorie', () => {
    expect(calculateParticipantPrice(base({ ageCategory: 'adult' }), pricing)).toBe(30);
    expect(calculateParticipantPrice(base({ ageCategory: 'youthUntil16' }), pricing)).toBe(25);
    expect(calculateParticipantPrice(base({ ageCategory: 'childUntil6' }), pricing)).toBe(10);
  });

  it('Mitglied vs. Nicht-Mitglied bei busLift', () => {
    expect(calculateParticipantPrice(base({ ageCategory: 'adult', isMember: true }), pricing)).toBe(20);
    expect(calculateParticipantPrice(base({ ageCategory: 'adult', isMember: false }), pricing)).toBe(30);
  });

  it('Schneeschuhe-Zuschlag kommt zum Grundpreis dazu', () => {
    expect(calculateParticipantPrice(base({ ageCategory: 'adult', isMember: true, snowshoes: true }), pricing)).toBe(28);
  });

  it('Kurs-/Technik-Zuschlag je nach level-String', () => {
    expect(
      calculateParticipantPrice(
        base({ ageCategory: 'adult', isMember: true, courseRequested: true, level: 'Anfängerkurs' }),
        pricing,
      ),
    ).toBe(38);
    expect(
      calculateParticipantPrice(
        base({ ageCategory: 'adult', isMember: true, courseRequested: true, level: 'Techniktraining (ganzer Tag)' }),
        pricing,
      ),
    ).toBe(55);
  });

  it('kombiniert busLift + Schneeschuhe + Kurs-Zuschlag', () => {
    expect(
      calculateParticipantPrice(
        base({ ageCategory: 'youthUntil16', isMember: false, snowshoes: true, courseRequested: true, level: 'Fortgeschrittenenkurs' }),
        pricing,
      ),
    ).toBe(25 + 12 + 28);
  });

  it('fehlende Preis-Konfiguration ergibt 0', () => {
    expect(calculateParticipantPrice(base({}), {})).toBe(0);
  });
});
