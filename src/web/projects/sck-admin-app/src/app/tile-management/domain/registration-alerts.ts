import { minorState } from './registration-minor';
import { TripRegistration } from './trip-registration';

export type RegistrationAlertKey = 'minors' | 'unverified' | 'noContact' | 'noBoarding' | 'noBirthday' | 'emergency';

export type RegistrationAlerts = Record<RegistrationAlertKey, TripRegistration[]>;

// Unregelmäßigkeiten einer Anmeldeliste (stornierte Anmeldungen zählen nicht).
export const registrationAlerts = (
    registrations: TripRegistration[],
    emergencyIds: Set<string>,
): RegistrationAlerts => {
    const active = registrations.filter((r) => r.status !== 'cancelled');
    const confirmed = active.filter((r) => r.status === 'confirmed');
    return {
        // Minderjährig, aber weder Elternteil dabei noch Einverständnis hinterlegt
        minors: active.filter((r) => minorState(r) === 'open'),
        // Hat im Formular "Mitglied" angegeben, ist aber nicht verifiziert
        unverified: active.filter((r) => r.selfReportedIsMember && !r.isMember),
        // Hauptanmelder ohne E-Mail: bekommt keine Bestätigung (Organisatoren/Lehrteam ausgenommen)
        noContact: active.filter((r) => !r.email && !r.registeredById && !r.participantRole),
        noBoarding: confirmed.filter((r) => !r.boardingId),
        noBirthday: active.filter((r) => !r.birthday),
        emergency: active.filter((r) => emergencyIds.has(r.id)),
    };
};
