import {
    BUS_ONLY_PRICE_DATA,
    BUS_AND_PASS_PRICE_DATA,
    COURSE_ON_TRAVEL_PRICE_DATA,
    COURSE_AT_HOME_PRICE_DATA,
} from './price-data';
import { PriceMapping, PriceAgeGroup, PriceClubMemberStatus } from 'projects/shared-lib/src/lib/ui-common/models';

describe('Price Data (domain integrity)', () => {
    it('bus only price should have All age group with All club member status', () => {
        const entry = BUS_ONLY_PRICE_DATA.ageGroup?.[0];
        expect(entry?.group).toBe(PriceAgeGroup.All);
        expect(entry?.clubMemberStatus[0].clubMemberStatus).toBe(PriceClubMemberStatus.All);
    });

    it('bus and pass price should expose adult/teenager/child groups', () => {
        const groups = BUS_AND_PASS_PRICE_DATA[0].ageGroup?.map((g) => g.group) ?? [];
        expect(groups).toEqual(
            jasmine.arrayContaining([PriceAgeGroup.Adult, PriceAgeGroup.Teenager, PriceAgeGroup.Child]),
        );
    });

    it('course on travel price mapping id/label should match enum', () => {
        const courseTravel = COURSE_ON_TRAVEL_PRICE_DATA[0];
        expect(courseTravel.id).toBe(PriceMapping.CourseOnTravel);
        expect(courseTravel.label).toBe(PriceMapping.CourseOnTravel);
    });

    it('course at home data should include sport types with time defined', () => {
        const home = COURSE_AT_HOME_PRICE_DATA[0];
        home.sportType?.forEach((st) => {
            expect(st.time).toBeTruthy();
            expect(st.ageGroup.length).toBeGreaterThan(0);
        });
    });
});
