// Übungsleiter (Lehrteam-Mitglied) eines Kurses. Bei Ausfahrten: Sportart + Stufe, bei Kurs-Kacheln: Sportart (leer = ganze Kachel).
export interface CourseInstructor {
    sportType: string;
    level: string;
    memberId: string;
    firstName: string;
    lastName: string;
}
