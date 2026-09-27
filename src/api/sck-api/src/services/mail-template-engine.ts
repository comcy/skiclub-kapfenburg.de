/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Minimal {{token}} substitution for admin-editable mail text blocks -
// intentionally not a full templating language (no conditionals/loops).
// 1:1 port of src/web/projects/data/mail-templates/template-engine.ts, the
// shared piece both the course and trip confirmation mail services use.
export const renderTemplate = (template: string, values: Record<string, string>): string =>
  template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => values[key] ?? match);
