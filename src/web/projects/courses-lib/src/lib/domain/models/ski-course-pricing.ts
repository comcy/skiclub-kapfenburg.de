/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Wire shape of the global "ski-course-pricing" setting (see sck-api's
// domain/settings.ts) - duplicated rather than cross-imported, same
// convention as ApiPilatesCourseDto in course-tiles-api.interface.ts.
export interface PriceByMembership {
    member: number;
    nonMember: number;
}

// Beschriftung inkl. Kursdauer - einzige Stelle, an der die Stundenzahl steht
// (Admin-Preisformular und oeffentliche Preistabelle). ponytail: fest im Code,
// editierbar erst bei wechselnden Stunden/weiteren Kursarten (siehe Issue).
export const SKI_COURSE_TYPE_LABELS = {
    snowboard: 'Snowboard (6 Stunden)',
    alpine: 'Alpin (8 Stunden)',
} as const;

export interface SkiCoursePricing {
    // Age cutoff between "Kinder" and "Erwachsene" pricing, e.g. 16.
    childUntilAge: number;
    snowboard: { adult: PriceByMembership; child: PriceByMembership };
    alpine: { adult: PriceByMembership; child: PriceByMembership };
}
