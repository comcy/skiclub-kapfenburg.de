import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MailTemplateSettings } from '../domain/mail-template-setting';
import { MembershipFeeSetting } from '../domain/membership-fee-setting';
import { NotificationBccSetting } from '../domain/notification-bcc-setting';
import { SepaCreditorSetting } from '../domain/sepa-creditor-setting';
import { SkiCoursePricingSetting } from '../domain/ski-course-pricing-setting';
import { TripPricingSetting } from '../domain/trip-pricing-setting';

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

    getSkiCoursePricing(): Observable<SkiCoursePricingSetting> {
        return this.http.get<SkiCoursePricingSetting>(`${this.apiUrl}/settings/ski-course-pricing`);
    }

    updateSkiCoursePricing(setting: SkiCoursePricingSetting): Observable<SkiCoursePricingSetting> {
        return this.http.put<SkiCoursePricingSetting>(`${this.apiUrl}/settings/ski-course-pricing`, setting);
    }

    getTripPricing(): Observable<TripPricingSetting> {
        return this.http.get<TripPricingSetting>(`${this.apiUrl}/settings/trip-pricing`);
    }

    updateTripPricing(setting: TripPricingSetting): Observable<TripPricingSetting> {
        return this.http.put<TripPricingSetting>(`${this.apiUrl}/settings/trip-pricing`, setting);
    }

    getMailTemplates(): Observable<MailTemplateSettings> {
        return this.http.get<MailTemplateSettings>(`${this.apiUrl}/settings/mail-templates`);
    }

    updateMailTemplates(setting: MailTemplateSettings): Observable<MailTemplateSettings> {
        return this.http.put<MailTemplateSettings>(`${this.apiUrl}/settings/mail-templates`, setting);
    }

    getSepaCreditor(): Observable<SepaCreditorSetting> {
        return this.http.get<SepaCreditorSetting>(`${this.apiUrl}/settings/sepa-creditor`);
    }

    updateSepaCreditor(setting: SepaCreditorSetting): Observable<SepaCreditorSetting> {
        return this.http.put<SepaCreditorSetting>(`${this.apiUrl}/settings/sepa-creditor`, setting);
    }

    getMembershipFee(): Observable<MembershipFeeSetting> {
        return this.http.get<MembershipFeeSetting>(`${this.apiUrl}/settings/membership-fee`);
    }

    updateMembershipFee(setting: MembershipFeeSetting): Observable<MembershipFeeSetting> {
        return this.http.put<MembershipFeeSetting>(`${this.apiUrl}/settings/membership-fee`, setting);
    }
}
