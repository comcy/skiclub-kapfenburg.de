/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { DownloadItem } from 'projects/trips-lib/src/lib/domain/models';

export const PROGRAMM_DOWNLOAD_LINK = 'https://1drv.ms/b/s!AlpybhuWN2nhguFe6RiXvo_jjiU0eg?e=qdC0Gu';

export const PROGRAMM_DOWNLOAD_LINK_SHORT = '';

const EINVERSTAENDNIS_U18_LINK = 'https://1drv.ms/b/s!AlpybhuWN2nhgehuhqZdmNmjn_77xw?e=nVR9fH';

// const EINVERSTAENDNIS_U16_LINK = 'https://1drv.ms/b/s!AlpybhuWN2nhgehj5gkhO4WxZOJDxg?e=VJo765';

const MITGLIEDSANTRAG = 'https://1drv.ms/b/s!AlpybhuWN2nhge8cEZzZ36UQ89Ixaw?e=XsGgvZ';

export const TRIP_DOWNLOADS: DownloadItem[] = [
    {
        name: 'Download für Einverständniserklärung für Reiseteilnehmer unter 18 Jahren',
        link: EINVERSTAENDNIS_U18_LINK,
    },
    {
        name: 'Mitgliedsantrag',
        link: MITGLIEDSANTRAG,
    },
];
