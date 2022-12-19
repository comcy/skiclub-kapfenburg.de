import { Component, OnInit } from '@angular/core';
import { TRIP_DOWNLOADS } from 'projects/data/downloads';
import { DownloadItem } from 'projects/trips-lib/src/public-api';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
})
export class DownloadsComponent implements OnInit {
  tripDownloads: DownloadItem[] = TRIP_DOWNLOADS;

  constructor() {}

  ngOnInit(): void {}
}
