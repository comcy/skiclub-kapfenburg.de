/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export interface ApiData<T> {
    data: T[];
    limit: number;
    page: number;
    total: number;
    totalPages: number;
}
