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
} from '../services/data-service.js';
import { CourseRegisterFormFields } from '../domain/course-registration.js';

export const createSkiCourseRegistration: RequestHandler = async (req, res) => {
    try {
        const registrationData = req.body as CourseRegisterFormFields;
        const savedRegistration = await saveEntity('registrations', { ...registrationData, type: 'ski-course-registration' });
        res.status(201).json({ message: 'Ski course registration successfully created.', data: savedRegistration });
    } catch (error: any) {
        console.error('Error creating ski course registration:', error);
        res.status(500).json({
            error: 'Error processing your request.',
            details: error.message,
        });
    }
};

export const getSkiCourseRegistrations: RequestHandler = async (req, res) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;

        const allRegistrations = await readEntities<any>('registrations');
        const skiCourseRegistrations = allRegistrations.filter((r) => r.type === 'ski-course-registration');

        const total = skiCourseRegistrations.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const data = skiCourseRegistrations.slice(startIndex, startIndex + limit);

        res.status(200).json({
            data,
            total,
            page,
            limit,
            totalPages,
        });
    } catch (error: any) {
        console.error('Error getting ski course registrations:', error);
        res.status(500).json({
            error: 'Error processing your request.',
            details: error.message,
        });
    }
};

export const getSkiCourseRegistrationById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await getEntityById('registrations', id);
        if (registration && (registration as any).type === 'ski-course-registration') {
            res.status(200).json(registration);
        } else {
            res.status(404).json({ message: 'Ski course registration not found.' });
        }
    } catch (error: any) {
        console.error('Error getting ski course registration:', error);
        res.status(500).json({
            error: 'Error processing your request.',
            details: error.message,
        });
    }
};

export const updateSkiCourseRegistration: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const registrationData = req.body as Partial<CourseRegisterFormFields>;
        const updatedRegistration = await updateEntity('registrations', id, registrationData);
        if (updatedRegistration) {
            res.status(200).json({ message: 'Ski course registration successfully updated.', data: updatedRegistration });
        } else {
            res.status(404).json({ message: 'Ski course registration not found.' });
        }
    } catch (error: any) {
        console.error('Error updating ski course registration:', error);
        res.status(500).json({
            error: 'Error processing your request.',
            details: error.message,
        });
    }
};

export const deleteSkiCourseRegistration: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await deleteEntity('registrations', id);
        if (success) {
            res.status(200).json({ message: 'Ski course registration successfully deleted.' });
        } else {
            res.status(404).json({ message: 'Ski course registration not found.' });
        }
    } catch (error: any) {
        console.error('Error deleting ski course registration:', error);
        res.status(500).json({
            error: 'Error processing your request.',
            details: error.message,
        });
    }
};
