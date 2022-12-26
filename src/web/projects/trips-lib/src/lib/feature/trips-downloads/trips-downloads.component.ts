import { Component, Input, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DownloadItem } from '../../domain';

@Component({
  selector: 'lib-trips-downloads',
  templateUrl: './trips-downloads.component.html',
  styleUrls: ['./trips-downloads.component.scss'],
})
export class TripsDownloadsComponent implements OnInit {
  @Input() downloads: DownloadItem[] = [
    { name: 'asdasd', link: 'https://www.google.de' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
