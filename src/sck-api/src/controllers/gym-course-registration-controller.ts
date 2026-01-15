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
import { GymCoursesRegisterFormFields } from '../domain/gym-course-registration.js';

@Tags('Gym Course Registrations')
@Route('gym-course-registrations')
export class GymCourseRegistrationController extends Controller {
    @Post('/')
    public async createGymCourseRegistration(@Body() registrationData: GymCoursesRegisterFormFields): Promise<{ message: string; data: any }> {
        const savedRegistration = await saveEntity('registrations', { ...registrationData, type: 'gym-course-registration' });
        return { message: 'Gym course registration successfully created.', data: savedRegistration };
    }

    @Get('/')
    public async getGymCourseRegistrations(
        @Query() page?: number,
        @Query() limit?: number,
        @Query() sort?: string,
        @Query() filter?: string
    ): Promise<any> {
        return getEntities('registrations', page, limit, sort, filter, undefined, 'gym-course-registration');
    }

    @Get('/{id}')
    public async getGymCourseRegistrationById(@Path() id: string): Promise<any> {
        const registration = await getEntityById('registrations', id);
        if (registration && (registration as any).type === 'gym-course-registration') {
            return registration;
        } else {
            this.setStatus(404);
            return { message: 'Gym course registration not found.' };
        }
    }

    @Put('/{id}')
    public async updateGymCourseRegistration(
        @Path() id: string,
        @Body() registrationData: Partial<GymCoursesRegisterFormFields>
    ): Promise<{ message: string; data: any } | { message: string }> {
        const updatedRegistration = await updateEntity('registrations', id, registrationData);
        if (updatedRegistration) {
            return { message: 'Gym course registration successfully updated.', data: updatedRegistration };
        } else {
            this.setStatus(404);
            return { message: 'Gym course registration not found.' };
        }
    }

    @Delete('/{id}')
    public async deleteGymCourseRegistration(@Path() id: string): Promise<{ message: string }> {
        const success = await deleteEntity('registrations', id);
        if (success) {
            return { message: 'Gym course registration successfully deleted.' };
        } else {
            this.setStatus(404);
            return { message: 'Gym course registration not found.' };
        }
    }
}
