export interface PriceByMembership {
    member: number;
    nonMember: number;
}

export interface SkiCoursePricingSetting {
    childUntilAge: number;
    snowboard: { adult: PriceByMembership; child: PriceByMembership };
    alpine: { adult: PriceByMembership; child: PriceByMembership };
}
