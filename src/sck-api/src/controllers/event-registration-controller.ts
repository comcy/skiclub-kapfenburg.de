import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Route,
    Tags,
    Query,
} from 'tsoa';
import {
    saveEntity,
    getEntities,
    getEntityById,
} from '../services/data-service.js';
import { TripRegisterFormValue, SheetDbRow } from '../domain/trip-registration.js';

const calculateAge = (birthday: string): number => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

@Tags('Event Registrations')
@Route('event-registrations')
export class EventRegistrationController extends Controller {
    @Post('/{eventId}')
    public async createEventRegistration(
        @Path() eventId: string,
        @Body() registrationData: TripRegisterFormValue
    ): Promise<{ message: string; data: any } | { error: string }> {
        const { trip, additionalText, participants } = registrationData;

        if (!trip || !participants || !Array.isArray(participants) || participants.length === 0) {
            this.setStatus(400);
            return { error: 'Die Reise und mindestens ein Teilnehmer sind erforderlich.' };
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { availableBoardings, ...tripWithoutBoardings } = trip;

        const sheetDbRows: SheetDbRow[] = participants.map((participant) => {
            return {
                ...tripWithoutBoardings,
                ...participant,
                age: calculateAge(participant.birthday),
                additionalText: additionalText,
                eventId: eventId,
            };
        });

        const savedRecords = [];
        for (const row of sheetDbRows) {
            const savedRecord = await saveEntity('registrations', { ...row, type: 'trip-registration' });
            savedRecords.push(savedRecord);
        }

        return { message: 'Registrierung erfolgreich gespeichert.', data: savedRecords };
    }

    @Get('/{eventId}')
    public async getEventRegistrations(
        @Path() eventId: string,
        @Query() page?: number,
        @Query() limit?: number,
        @Query() sort?: string,
        @Query() filter?: string,
        @Query() sportTypeFilter?: string
    ): Promise<any> {
        return getEntities('registrations', page, limit, sort, `${filter},eventId=${eventId}`, sportTypeFilter);
    }

    @Get('/by-id/{id}')
    public async getEventRegistrationById(@Path() id: string): Promise<any> {
        const registration = await getEntityById('registrations', id);
        if (registration) {
            return registration;
        } else {
            this.setStatus(404);
            return { message: 'Registrierung nicht gefunden.' };
        }
    }
}

@Tags('Trip Registrations')
@Route('trip-registrations')
export class TripRegistrationController extends Controller {
    @Get('/')
    public async getTripRegistrations(
        @Query() page?: number,
        @Query() limit?: number,
        @Query() sort?: string,
        @Query() filter?: string,
        @Query() sportTypeFilter?: string
    ): Promise<any> {
        return getEntities('registrations', page, limit, sort, filter, sportTypeFilter, 'trip-registration');
    }
}