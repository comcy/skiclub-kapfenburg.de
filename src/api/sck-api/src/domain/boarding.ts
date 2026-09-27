/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

export interface Boarding {
  id: string;
  name: string;
}

export type BoardingCreationParams = Omit<Boarding, 'id'>;
