/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { RequestHandler } from 'express';
import { saveEntity, getEntities, getEntityById, updateEntity, deleteEntity } from '../services/data-service.js';
import { Tile } from '../domain/tile.js';

export const createEvent: RequestHandler = async (req, res) => {
    try {
        const eventData = req.body as Tile;
        const savedEvent = await saveEntity('events', eventData);
        res.status(201).json({ message: 'Event erfolgreich erstellt.', data: savedEvent });
    } catch (error: any) {
        console.error('Fehler bei der Erstellung des Events:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};

export const getEvents: RequestHandler = async (req, res) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const events = await getEntities<Tile>('events', page, limit);
        res.status(200).json(events);
    } catch (error: any) {
        console.error('Fehler beim Abrufen der Events:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};

export const getEventById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await getEntityById<Tile>('events', id);
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ message: 'Event nicht gefunden.' });
        }
    } catch (error: any) {
        console.error('Fehler beim Abrufen des Events:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};

export const updateEvent: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const eventData = req.body as Partial<Tile>;
        const updatedEvent = await updateEntity<Tile>('events', id, eventData);
        if (updatedEvent) {
            res.status(200).json({ message: 'Event erfolgreich aktualisiert.', data: updatedEvent });
        } else {
            res.status(404).json({ message: 'Event nicht gefunden.' });
        }
    } catch (error: any) {
        console.error('Fehler bei der Aktualisierung des Events:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};

export const deleteEvent: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await deleteEntity('events', id);
        if (success) {
            res.status(200).json({ message: 'Event erfolgreich gelöscht.' });
        } else {
            res.status(404).json({ message: 'Event nicht gefunden.' });
        }
    } catch (error: any) {
        console.error('Fehler beim Löschen des Events:', error);
        res.status(500).json({
            error: 'Fehler bei der Verarbeitung Ihrer Anfrage.',
            details: error.message,
        });
    }
};
