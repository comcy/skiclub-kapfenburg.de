/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { environment } from '../../../environments/environment';

// Admin-uploaded images are returned by sck-api as a path relative to the API
// host ("/media/xyz.png", see images-controller.ts's upload response) - the
// admin app resolves this itself (TilesDataService.getAbsoluteUrl) before
// previewing it, but sck-app has always rendered tile.image directly, so any
// admin-uploaded image was broken on the public site (still relative to
// sck-app's own origin, which has no /media route). Static asset paths
// ("assets/img/...") never start with /media/ and pass through unchanged.
export function resolveMediaUrl(path: string): string {
    if (!path || !path.startsWith('/media/')) return path;
    return `${environment.sckApiUrl.replace(/\/api$/, '')}${path}`;
}

// Admin's date picker (editable-date.component.ts) stores tile.date as a raw
// ISO string - fine for admin's own tables/previews (they run it through
// Angular's date pipe), but sck-app has always interpolated it directly,
// showing the raw ISO string to visitors. Static tiles' hand-written date
// text (e.g. "14. – 16. November 2026") is never ISO-parseable, so isNaN
// leaves it untouched - this only ever reformats real admin-set dates.
export function formatGermanDate(value: string): string {
    if (!value) return value;
    const date = new Date(value);
    return isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
