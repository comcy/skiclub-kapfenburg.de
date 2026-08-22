/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, ChangeDetectionStrategy, ElementRef, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MaterialColor, SiteHeaderComponent } from '@shared/ui-common';
import { MarkdownRenderService } from '@shared/util-markdown';
import { COURSE_AT_HOME_PRICE_DATA } from '@data';
import { CoursesUiModule } from '@courses-lib';
import { COURSE_LEVEL_TILES } from 'projects/data/static';
import { Price } from 'projects/courses-lib/src/lib/domain/models';
import { InfoTile } from 'projects/shared-lib/src/lib/ui-common/models';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatButtonModule, MatIconModule, CoursesUiModule, SiteHeaderComponent],
})
export class CoursesComponent {
    public title = 'Ski- und Snowboardschule';
    public color: MaterialColor = 'primary';

    public courseAtHomePrice: Price[] = COURSE_AT_HOME_PRICE_DATA;
    public levelTiles = COURSE_LEVEL_TILES;

    public registrationOpen = false;
    public selectedLevel: string | undefined;

    public markdown = inject(MarkdownRenderService);

    @ViewChild('registrationSection') registrationSection?: ElementRef<HTMLElement>;

    public openRegistrationFor(level: InfoTile): void {
        this.selectedLevel = level.title;
        this.registrationOpen = true;
        setTimeout(() => {
            this.registrationSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}
