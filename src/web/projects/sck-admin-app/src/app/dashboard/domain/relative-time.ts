export function relativeTime(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return 'gerade eben';
    if (minutes < 60) return `vor ${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `vor ${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`;

    const days = Math.floor(hours / 24);
    return `vor ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
}
