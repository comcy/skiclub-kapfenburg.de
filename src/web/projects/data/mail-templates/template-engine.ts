/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Minimal {{token}} substitution for admin-editable mail text blocks -
// intentionally not a full templating language (no conditionals/loops),
// those stay code (see mail-template-settings-store.ts).
export const renderTemplate = (template: string, values: Record<string, string>): string =>
    template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => values[key] ?? match);
