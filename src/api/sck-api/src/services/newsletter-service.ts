/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { randomUUID } from 'node:crypto';
import { db } from '../db/connection.js';
import { NewsletterSignup } from '../domain/newsletter.js';

interface NewsletterSignupRow {
  id: string;
  email: string;
  created_at: string;
}

const rowToSignup = (row: NewsletterSignupRow): NewsletterSignup => ({
  id: row.id,
  email: row.email,
  createdAt: row.created_at,
});

// INSERT OR IGNORE - email has a UNIQUE COLLATE NOCASE constraint, so
// re-signing up with an already-registered address (any casing) is a
// silent no-op rather than an error, matching the public endpoint's
// idempotent "always 201" behavior (see newsletter-controller.ts).
export const createSignup = (email: string): void => {
  db.prepare('INSERT OR IGNORE INTO newsletter_signups (id, email) VALUES (?, ?)').run(randomUUID(), email);
};

export const listSignups = (): NewsletterSignup[] =>
  (
    db.prepare('SELECT * FROM newsletter_signups ORDER BY created_at DESC').all() as unknown as NewsletterSignupRow[]
  ).map(rowToSignup);

export const deleteSignup = (id: string): boolean => {
  const result = db.prepare('DELETE FROM newsletter_signups WHERE id = ?').run(id);
  return result.changes > 0;
};
