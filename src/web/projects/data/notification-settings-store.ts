/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Plain module-level cache, not an Angular service - the mail-template
// functions in mail-templates/*.ts are pure functions without DI access.
// Populated once (AppComponent.ngOnInit fetches GET /settings/notification-bcc)
// and read synchronously by getXConfirmationMailBcc() as the middle fallback
// tier between a per-tile override and the hardcoded default list.
let cachedGlobalBccList: string[] | undefined;

export const setGlobalBccList = (list: string[]): void => {
    cachedGlobalBccList = list;
};

export const getGlobalBccList = (): string[] | undefined => cachedGlobalBccList;
