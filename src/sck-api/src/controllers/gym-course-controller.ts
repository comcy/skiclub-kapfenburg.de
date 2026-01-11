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

@Tags('Gym Courses')
@Route('gym-courses')
export class GymCourseController extends Controller {
    @Post('/')
    public async createGymCourse(@Body() courseData: Tile): Promise<{ message: string; data: any }> {
        const savedCourse = await saveEntity('gym-courses', courseData);
        return { message: 'Gym course erfolgreich erstellt.', data: savedCourse };
    }

    @Get('/')
    public async getGymCourses(@Query() page?: number, @Query() limit?: number): Promise<any> {
        return getEntities<Tile>('gym-courses', page, limit);
    }

    @Get('/{id}')
    public async getGymCourseById(@Path() id: string): Promise<any> {
        const course = await getEntityById<Tile>('gym-courses', id);
        if (course) {
            return course;
        } else {
            this.setStatus(404);
            return { message: 'Gym course nicht gefunden.' };
        }
    }

    @Put('/{id}')
    public async updateGymCourse(
        @Path() id: string,
        @Body() courseData: Partial<Tile>
    ): Promise<{ message: string; data: any } | { message: string }> {
        const updatedCourse = await updateEntity<Tile>('gym-courses', id, courseData);
        if (updatedCourse) {
            return { message: 'Gym course erfolgreich aktualisiert.', data: updatedCourse };
        } else {
            this.setStatus(404);
            return { message: 'Gym course nicht gefunden.' };
        }
    }

    @Delete('/{id}')
    public async deleteGymCourse(@Path() id: string): Promise<{ message: string }> {
        const success = await deleteEntity('gym-courses', id);
        if (success) {
            return { message: 'Gym course erfolgreich gelöscht.' };
        } else {
            this.setStatus(404);
            return { message: 'Gym course nicht gefunden.' };
        }
    }
}