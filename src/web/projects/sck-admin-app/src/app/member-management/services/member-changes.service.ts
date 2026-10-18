import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// The member editor now lives behind an aux route (modal outlet), decoupled
// from the Mitglieder/Anträge tabs that need to refresh after a save - this
// is the notification channel between them instead of parent-child
// template refs.
@Injectable({
    providedIn: 'root',
})
export class MemberChangesService {
    private readonly changed = new Subject<void>();
    public readonly changed$ = this.changed.asObservable();

    notifyChanged(): void {
        this.changed.next();
    }
}
