import { Component, OnInit } from '@angular/core';
import { GymInformationCoreServiceInterface } from 'projects/gym-lib/src/lib/domain';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
})
export class InformationComponent implements OnInit {
  constructor(
    public gymInformationCoreService: GymInformationCoreServiceInterface
  ) {}

  ngOnInit(): void {}
}