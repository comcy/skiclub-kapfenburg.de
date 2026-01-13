/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { GymCourseInformation } from '../../domain';

export interface GymCourseDialogData {
    tile: {
        title: string;
        date: string;
        course: GymCourseInformation;
    };
}
