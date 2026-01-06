/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { RequestHandler } from 'express';

import {

    saveEntity,

    readEntities,

    getEntityById,

    updateEntity,

    deleteEntity,

    getEntities,

} from '../services/data-service.js';

import { CourseRegisterFormFields } from '../domain/course-registration.js';



export const createCourseRegistration: RequestHandler = async (req, res) => {

    try {

        const registrationData = req.body as CourseRegisterFormFields;

        const savedRegistration = await saveEntity('registrations', { ...registrationData, type: 'course-registration' });

        res.status(201).json({ message: 'Course registration successfully created.', data: savedRegistration });

    } catch (error: any) {

        console.error('Error creating course registration:', error);

        res.status(500).json({

            error: 'Error processing your request.',

            details: error.message,

        });

    }

};



export const getCourseRegistrations: RequestHandler = async (req, res) => {

    try {

        const page = parseInt(req.query.page as string, 10) || 1;

        const limit = parseInt(req.query.limit as string, 10) || 10;

        const sort = req.query.sort as string | undefined;

        const filter = req.query.filter as string | undefined;

        const sportTypeFilter = req.query.sportType as string | undefined;



        const registrations = await getEntities(

            'registrations',

            page,

            limit,

            sort,

            filter,

            sportTypeFilter,

            'course-registration',

        );



        res.status(200).json(registrations);

    } catch (error: any) {

        console.error('Error getting course registrations:', error);

        res.status(500).json({

            error: 'Error processing your request.',

            details: error.message,

        });

    }

};



export const getCourseRegistrationById: RequestHandler = async (req, res) => {

    try {

        const { id } = req.params;

        const registration = await getEntityById('registrations', id);

        if (registration && (registration as any).type === 'course-registration') {

            res.status(200).json(registration);

        } else {

            res.status(404).json({ message: 'Course registration not found.' });

        }

    } catch (error: any) {

        console.error('Error getting course registration:', error);

        res.status(500).json({

            error: 'Error processing your request.',

            details: error.message,

        });

    }

};



export const updateCourseRegistration: RequestHandler = async (req, res) => {

    try {

        const { id } = req.params;

        const registrationData = req.body as Partial<CourseRegisterFormFields>;

        const updatedRegistration = await updateEntity('registrations', id, registrationData);

        if (updatedRegistration) {

            res.status(200).json({ message: 'Course registration successfully updated.', data: updatedRegistration });

        } else {

            res.status(404).json({ message: 'Course registration not found.' });

        }

    } catch (error: any) {

        console.error('Error updating course registration:', error);

        res.status(500).json({

            error: 'Error processing your request.',

            details: error.message,

        });

    }

};



export const deleteCourseRegistration: RequestHandler = async (req, res) => {

    try {

        const { id } = req.params;

        const success = await deleteEntity('registrations', id);

        if (success) {

            res.status(200).json({ message: 'Course registration successfully deleted.' });

        }

        else {

            res.status(404).json({ message: 'Course registration not found.' });

        }

    } catch (error: any) {

        console.error('Error deleting course registration:', error);

        res.status(500).json({

            error: 'Error processing your request.',

            details: error.message,

        });

    }

};


