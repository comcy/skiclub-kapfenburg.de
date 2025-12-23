/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { RequestHandler } from 'express';
import { saveEntity, getEntities, getEntityById, updateEntity, deleteEntity } from '../services/data-service.js';
import { Tile } from '../domain/tile.js';

export const createGymCourse: RequestHandler = async (req, res) => {
    try {
        const courseData = req.body as Tile;
        const savedCourse = await saveEntity('gym-courses', courseData);
        res.status(201).json({ message: 'Gym course erfolgreich erstellt.', data: savedCourse });
    } catch (error: any) {
        console.error('Fehler bei der Erstellung des Gym course:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};

export const getGymCourses: RequestHandler = async (req, res) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const courses = await getEntities<Tile>('gym-courses', page, limit);
        res.status(200).json(courses);
    } catch (error: any) {
        console.error('Fehler beim Abrufen der Gym courses:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};

export const getGymCourseById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await getEntityById<Tile>('gym-courses', id);
        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Gym course nicht gefunden.' });
        }
    } catch (error: any) {
        console.error('Fehler beim Abrufen des Gym course:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};

export const updateGymCourse: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const courseData = req.body as Partial<Tile>;
        const updatedCourse = await updateEntity<Tile>('gym-courses', id, courseData);
        if (updatedCourse) {
            res.status(200).json({ message: 'Gym course erfolgreich aktualisiert.', data: updatedCourse });
        } else {
            res.status(404).json({ message: 'Gym course nicht gefunden.' });
        }
    } catch (error: any) {
        console.error('Fehler bei der Aktualisierung des Gym course:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};

export const deleteGymCourse: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await deleteEntity('gym-courses', id);
        if (success) {
            res.status(200).json({ message: 'Gym course erfolgreich gelöscht.' });
        } else {
            res.status(404).json({ message: 'Gym course nicht gefunden.' });
        }
    } catch (error: any) {
        console.error('Fehler beim Löschen des Gym course:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};
