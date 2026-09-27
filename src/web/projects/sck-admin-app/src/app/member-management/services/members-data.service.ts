import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../../tile-management/domain/paginated-response';
import { MemberImportApplyResult, MemberImportCollisionOverride, MemberImportPreview } from '../domain/member-import';
import { AnniversaryGroup, Member, MemberCreationParams } from '../domain/member';
import { MembershipApplication } from '../domain/membership-application';
import { NewsletterSignup } from '../domain/newsletter-signup';
import { SepaExportCandidate, SepaExportPreview, SepaSequenceType } from '../domain/sepa-export';

@Injectable({
    providedIn: 'root',
})
export class MembersDataService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.sckApiUrl;

    getMembers(page: number = 1, limit: number = 100): Observable<PaginatedResponse<Member>> {
        return this.http.get<PaginatedResponse<Member>>(`${this.apiUrl}/members`, {
            params: { page: page.toString(), limit: limit.toString() },
        });
    }

    getMember(id: string): Observable<Member> {
        return this.http.get<Member>(`${this.apiUrl}/members/${id}`);
    }

    createMember(params: MemberCreationParams): Observable<Member> {
        return this.http.post<Member>(`${this.apiUrl}/members`, params);
    }

    updateMember(id: string, params: MemberCreationParams): Observable<Member> {
        return this.http.put<Member>(`${this.apiUrl}/members/${id}`, params);
    }

    deleteMember(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/members/${id}`);
    }

    getMembershipApplications(): Observable<MembershipApplication[]> {
        return this.http.get<MembershipApplication[]>(`${this.apiUrl}/members/applications`);
    }

    getAnniversaries(date: string, years: number[]): Observable<AnniversaryGroup[]> {
        return this.http.get<AnniversaryGroup[]>(`${this.apiUrl}/members/anniversaries`, {
            params: { date, years: years.join(',') },
        });
    }

    markHonored(id: string, years: number): Observable<Member> {
        return this.http.post<Member>(`${this.apiUrl}/members/${id}/honor`, { years });
    }

    previewMembersImport(file: File): Observable<MemberImportPreview> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<MemberImportPreview>(`${this.apiUrl}/members/import/preview`, formData);
    }

    applyMembersImport(
        importId: string,
        collisionOverrides: MemberImportCollisionOverride[],
    ): Observable<MemberImportApplyResult> {
        return this.http.post<MemberImportApplyResult>(`${this.apiUrl}/members/import/apply`, {
            importId,
            collisionOverrides,
        });
    }

    getNewsletterSignups(): Observable<NewsletterSignup[]> {
        return this.http.get<NewsletterSignup[]>(`${this.apiUrl}/newsletter/signups`);
    }

    deleteNewsletterSignup(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/newsletter/signups/${id}`);
    }

    getSepaExportCandidates(): Observable<SepaExportCandidate[]> {
        return this.http.get<SepaExportCandidate[]>(`${this.apiUrl}/sepa-export/candidates`);
    }

    previewSepaExport(memberIds: string[]): Observable<SepaExportPreview> {
        return this.http.post<SepaExportPreview>(`${this.apiUrl}/sepa-export/preview`, { memberIds });
    }

    generateSepaExport(memberIds: string[], executionDate: string, sequenceType: SepaSequenceType): Observable<Blob> {
        return this.http.post(
            `${this.apiUrl}/sepa-export/generate`,
            { memberIds, executionDate, sequenceType },
            { responseType: 'blob' },
        );
    }
}
