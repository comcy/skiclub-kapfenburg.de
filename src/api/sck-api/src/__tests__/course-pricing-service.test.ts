import { calculateCoursePrice } from '../services/course-pricing-service.js';
import { SkiCoursePricing } from '../domain/settings.js';

const pricing: SkiCoursePricing = {
  childUntilAge: 16,
  snowboard: { adult: { member: 55, nonMember: 70 }, child: { member: 45, nonMember: 60 } },
  alpine: { adult: { member: 60, nonMember: 75 }, child: { member: 50, nonMember: 65 } },
};
const now = new Date('2026-12-01T12:00:00Z');

describe('calculateCoursePrice', () => {
  it('Kinderpreis nur unter childUntilAge (16 Jahre = Erwachsenenpreis)', () => {
    expect(calculateCoursePrice({ sportType: 'Snowboard', birthday: '2010-12-02', isMember: false }, pricing, now)).toBe(60); // 15
    expect(calculateCoursePrice({ sportType: 'Snowboard', birthday: '2010-12-01', isMember: false }, pricing, now)).toBe(70); // 16 heute
  });

  it('Sportart und Mitgliedschaft waehlen den Preis', () => {
    expect(calculateCoursePrice({ sportType: 'Ski Alpin', birthday: '1990-01-01', isMember: true }, pricing, now)).toBe(60);
    expect(calculateCoursePrice({ sportType: 'Ski Alpin', birthday: '1990-01-01', isMember: false }, pricing, now)).toBe(75);
  });

  it('undefined, wenn Angaben oder Preise fehlen', () => {
    expect(calculateCoursePrice({ sportType: 'Snowboard', isMember: true }, pricing, now)).toBeUndefined();
    expect(calculateCoursePrice({ sportType: 'Snowboard', birthday: 'kaputt', isMember: true }, pricing, now)).toBeUndefined();
    expect(calculateCoursePrice({ sportType: 'Snowboard', birthday: '1990-01-01', isMember: true }, undefined, now)).toBeUndefined();
    expect(calculateCoursePrice({ sportType: 'Snowboard', birthday: '1990-01-01', isMember: true }, {} as SkiCoursePricing, now)).toBeUndefined();
  });
});
