import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permission } from '../../auth/domain/session';
import { Invite } from '../domain/invite';
import { AdminUser } from '../domain/user';
import { UserDirectoryEntry } from '../domain/user-directory-entry';

@Injectable({
    providedIn: 'root',
})
export class UsersDataService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.sckApiUrl;

    getUsers(): Observable<AdminUser[]> {
        return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
    }

    // Lighter than getUsers() (id/email only) - reachable without
    // users:manage, for pickers like the tile-editor's organizer dropdown.
    getUserDirectory(): Observable<UserDirectoryEntry[]> {
        return this.http.get<UserDirectoryEntry[]>(`${this.apiUrl}/users/directory`);
    }

    updateUserPermissions(id: string, permissions: Permission[]): Observable<AdminUser> {
        return this.http.put<AdminUser>(`${this.apiUrl}/users/${id}/permissions`, { permissions });
    }

    getInvites(): Observable<Invite[]> {
        return this.http.get<Invite[]>(`${this.apiUrl}/invites`);
    }

    createInvite(email: string): Observable<{ message: string; email: string }> {
        return this.http.post<{ message: string; email: string }>(`${this.apiUrl}/invites`, { email });
    }
}
