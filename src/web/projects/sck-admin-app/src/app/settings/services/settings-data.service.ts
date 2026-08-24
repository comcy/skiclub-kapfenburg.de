import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationBccSetting } from '../domain/notification-bcc-setting';

@Injectable({
    providedIn: 'root',
})
export class SettingsDataService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.sckApiUrl;

    getNotificationBcc(): Observable<NotificationBccSetting> {
        return this.http.get<NotificationBccSetting>(`${this.apiUrl}/settings/notification-bcc`);
    }

    updateNotificationBcc(setting: NotificationBccSetting): Observable<NotificationBccSetting> {
        return this.http.put<NotificationBccSetting>(`${this.apiUrl}/settings/notification-bcc`, setting);
    }
}
