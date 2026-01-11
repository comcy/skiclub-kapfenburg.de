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
import { CourseRegisterFormFields } from '../domain/course-registration.js';

@Tags('Course Registrations')
@Route('course-registrations')
export class CourseRegistrationController extends Controller {
    @Post('/')
    public async createCourseRegistration(@Body() registrationData: CourseRegisterFormFields): Promise<{ message: string; data: any }> {
        const savedRegistration = await saveEntity('registrations', { ...registrationData, type: 'course-registration' });
        return { message: 'Course registration successfully created.', data: savedRegistration };
    }

    @Get('/')
    public async getCourseRegistrations(
        @Query() page?: number,
        @Query() limit?: number,
        @Query() sort?: string,
        @Query() filter?: string,
        @Query() sportType?: string
    ): Promise<any> {
        return getEntities('registrations', page, limit, sort, filter, sportType, 'course-registration');
    }

    @Get('/{id}')
    public async getCourseRegistrationById(@Path() id: string): Promise<any> {
        const registration = await getEntityById('registrations', id);
        if (registration && (registration as any).type === 'course-registration') {
            return registration;
        } else {
            this.setStatus(404);
            return { message: 'Course registration not found.' };
        }
    }

    @Put('/{id}')
    public async updateCourseRegistration(
        @Path() id: string,
        @Body() registrationData: Partial<CourseRegisterFormFields>
    ): Promise<{ message: string; data: any } | { message: string }> {
        const updatedRegistration = await updateEntity('registrations', id, registrationData);
        if (updatedRegistration) {
            return { message: 'Course registration successfully updated.', data: updatedRegistration };
        } else {
            this.setStatus(404);
            return { message: 'Course registration not found.' };
        }
    }

    @Delete('/{id}')
    public async deleteCourseRegistration(@Path() id: string): Promise<{ message: string }> {
        const success = await deleteEntity('registrations', id);
        if (success) {
            return { message: 'Course registration successfully deleted.' };
        } else {
            this.setStatus(404);
            return { message: 'Course registration not found.' };
        }
    }
}