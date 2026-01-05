export interface SkiliftSnowStatus {
    state: SkiliftState;
    text: string;
    lastUpdate: string;
}

export interface SkiliftPrices {
    label: string;
    price: string;
}

export interface SkiliftOpeningHours {
    day: string;
    time: string;
}

export enum SkiliftState {
    CLOSED = 'closed',
    OPEN = 'open',
}
