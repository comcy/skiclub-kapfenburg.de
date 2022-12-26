import { DownloadItem } from 'projects/trips-lib/src/lib/domain/models';

export const PROGRAMM_DOWNLOAD_LINK =
  'https://1drv.ms/b/s!AlpybhuWN2nhgeg84qHJtnqsYKL8gg?e=drhRrK';
export const PROGRAMM_DOWNLOAD_LINK_SHORT =
  'https://1drv.ms/b/s!AlpybhuWN2nhgeg7YtsNP_zGVbajHQ?e=PlqvTX';

const EINVERSTAENDNIS_U18_LINK =
  'https://1drv.ms/b/s!AlpybhuWN2nhgehkNdgAeNHCcmp19A?e=Ceunb5';

const EINVERSTAENDNIS_U16_LINK =
  'https://1drv.ms/b/s!AlpybhuWN2nhgehj5gkhO4WxZOJDxg?e=VJo765';

export const TRIP_DOWNLOADS: DownloadItem[] = [
  {
    name: 'Download für Einverständniserklärung für Reiseteilnehmer unter 18 Jahren',
    link: EINVERSTAENDNIS_U18_LINK,
  },
];
