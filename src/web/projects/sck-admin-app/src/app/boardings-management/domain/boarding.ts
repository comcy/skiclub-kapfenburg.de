export interface Boarding {
    id: string;
    name: string;
}

export type BoardingCreationParams = Omit<Boarding, 'id'>;
