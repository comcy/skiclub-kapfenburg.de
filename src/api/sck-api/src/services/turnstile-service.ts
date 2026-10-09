/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import dotenv from 'dotenv';

dotenv.config();

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '';
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileVerifyResponse {
  success: boolean;
}

// Verifies a Cloudflare Turnstile widget token server-side before accepting
// a public form submission - the widget itself only stops naive/non-browser
// bots on the client, this is what makes that check trustworthy.
export const verifyTurnstileToken = async (token: string, remoteIp?: string): Promise<boolean> => {
  if (!token) return false;

  const body = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body });
    const data = (await res.json()) as TurnstileVerifyResponse;
    return data.success === true;
  } catch (error) {
    console.error('Fehler bei der Turnstile-Verifikation:', error);
    return false;
  }
};
