import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Member } from '../../domain/member';
import { MembersDataService } from '../../services/members-data.service';
import { TeachingTeamComponent } from './teaching-team.component';

const member = (id: string, extra: Partial<Member> = {}): Member => ({
    id,
    firstName: id,
    lastName: 'Test',
    isFamilyMembership: false,
    status: 'active',
    source: 'manual',
    ...extra,
});

describe('TeachingTeamComponent', () => {
    let fixture: ComponentFixture<TeachingTeamComponent>;
    let component: TeachingTeamComponent;
    let setTeachingTeam: jasmine.Spy;

    beforeEach(async () => {
        setTeachingTeam = jasmine
            .createSpy('setTeachingTeam')
            .and.callFake((m: Member, v: boolean) => of({ ...m, isTeachingTeam: v }));
        await TestBed.configureTestingModule({
            imports: [TeachingTeamComponent],
            providers: [
                provideNoopAnimations(),
                {
                    provide: MembersDataService,
                    useValue: {
                        getMembers: () =>
                            of({ items: [member('anna', { isTeachingTeam: true }), member('ben')], total: 2 }),
                        setTeachingTeam,
                    },
                },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(TeachingTeamComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('listet nur Lehrteam-Mitglieder, Vorschläge enthalten den Rest', () => {
        expect(component.team.map((m) => m.id)).toEqual(['anna']);
        expect(component.suggestions.map((m) => m.id)).toEqual(['ben']);
    });

    it('fügt hinzu und entfernt', () => {
        component.onAdd(member('ben'));
        expect(component.team.map((m) => m.id)).toContain('ben');
        component.onRemove(member('anna', { isTeachingTeam: true }));
        expect(component.team.map((m) => m.id)).not.toContain('anna');
    });
});
