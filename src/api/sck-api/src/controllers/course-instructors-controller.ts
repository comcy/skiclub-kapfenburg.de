/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { RequestHandler } from 'express';
import * as service from '../services/course-instructors-service.js';
import { getTile } from '../services/tiles-service.js';

export const listCourseInstructors: RequestHandler = (req, res) => {
  const tileId = String(req.params.tileId);
  if (!getTile(tileId)) {
    res.status(404).json({ error: 'Kachel nicht gefunden.' });
    return;
  }
  res.status(200).json(service.listInstructors(tileId));
};

// Body: { sportType?: string, level?: string, memberIds: string[] } - ersetzt die Übungsleiter dieses Kurses.
export const setCourseInstructors: RequestHandler = (req, res) => {
  const tileId = String(req.params.tileId);
  const { sportType = '', level = '', memberIds } = req.body ?? {};
  if (!getTile(tileId)) {
    res.status(404).json({ error: 'Kachel nicht gefunden.' });
    return;
  }
  if (
    typeof sportType !== 'string' ||
    typeof level !== 'string' ||
    !Array.isArray(memberIds) ||
    !memberIds.every((id) => typeof id === 'string')
  ) {
    res.status(400).json({ error: 'sportType, level und memberIds sind ungültig.' });
    return;
  }
  // Ausfahrten: nur Lehrteam-Personen, die selbst teilnehmen (bereits Eingetragene bleiben bestehen).
  const tile = getTile(tileId);
  if (tile?.type === 'event') {
    const allowed = service.listParticipantMemberIds(tileId);
    for (const i of service.listInstructors(tileId)) {
      if (i.sportType === sportType && i.level === level) allowed.add(i.memberId);
    }
    if (!memberIds.every((id: string) => allowed.has(id))) {
      res.status(400).json({ error: 'Übungsleiter einer Ausfahrt müssen an der Ausfahrt teilnehmen.' });
      return;
    }
  }
  if (!service.setInstructors(tileId, sportType, level, memberIds)) {
    res.status(400).json({ error: 'Nur aktive Lehrteam-Mitglieder können Übungsleiter sein.' });
    return;
  }
  res.status(200).json(service.listInstructors(tileId));
};
