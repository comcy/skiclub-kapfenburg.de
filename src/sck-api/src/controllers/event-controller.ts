import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Route,
    Tags,
    Query,
} from 'tsoa';
import {
    saveEntity,
    getEntities,
    getEntityById,
    updateEntity,
    deleteEntity,
} from '../services/data-service.js';
import { Tile } from '../domain/tile.js';

@Tags('Events')
@Route('events')
export class EventController extends Controller {
    @Post('/')
    public async createEvent(@Body() eventData: Tile): Promise<{ message: string; data: any }> {
        const savedEvent = await saveEntity('events', eventData);
        return { message: 'Event erfolgreich erstellt.', data: savedEvent };
    }

    @Get('/')
    public async getEvents(@Query() page?: number, @Query() limit?: number): Promise<any> {
        return getEntities<Tile>('events', page, limit);
    }

    @Get('/{id}')
    public async getEventById(@Path() id: string): Promise<any> {
        const event = await getEntityById<Tile>('events', id);
        if (event) {
            return event;
        } else {
            this.setStatus(404);
            return { message: 'Event nicht gefunden.' };
        }
    }

    @Put('/{id}')
    public async updateEvent(
        @Path() id: string,
        @Body() eventData: Partial<Tile>
    ): Promise<{ message: string; data: any } | { message: string }> {
        const updatedEvent = await updateEntity<Tile>('events', id, eventData);
        if (updatedEvent) {
            return { message: 'Event erfolgreich aktualisiert.', data: updatedEvent };
        } else {
            this.setStatus(404);
            return { message: 'Event nicht gefunden.' };
        }
    }

    @Delete('/{id}')
    public async deleteEvent(@Path() id: string): Promise<{ message: string }> {
        const success = await deleteEntity('events', id);
        if (success) {
            return { message: 'Event erfolgreich gelöscht.' };
        } else {
            this.setStatus(404);
            return { message: 'Event nicht gefunden.' };
        }
    }
}