import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// The course-tile editor lives behind an aux route (modal outlet), decoupled
// from the Sportkurse/Ski-Snowboardkurse lists that need to refresh after a
// save - same reasoning as member-changes.service.ts.
@Injectable({
    providedIn: 'root',
})
export class CourseTileChangesService {
    private readonly changed = new Subject<void>();
    public readonly changed$ = this.changed.asObservable();

    notifyChanged(): void {
        this.changed.next();
    }
}
