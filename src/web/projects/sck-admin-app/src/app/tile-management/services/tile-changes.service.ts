import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// The tile editor (Ausfahrten and both Kurse flavors) lives behind an aux
// route (modal outlet), decoupled from the list it needs to refresh after a
// save - same reasoning as member-changes.service.ts. Shared by
// TileListComponent (Event-Management) and CourseTileListComponent
// (Sportkurse/Ski-Snowboardkurse) rather than one service per list - it's
// the same "something changed, refresh" signal either way.
@Injectable({
    providedIn: 'root',
})
export class TileChangesService {
    private readonly changed = new Subject<void>();
    public readonly changed$ = this.changed.asObservable();

    notifyChanged(): void {
        this.changed.next();
    }
}
