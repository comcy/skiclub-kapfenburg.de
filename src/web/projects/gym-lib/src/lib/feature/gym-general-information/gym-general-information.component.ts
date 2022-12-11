import { Component, Input, OnInit } from '@angular/core';
import { GymInformationCoreServiceInterface } from '../../domain';

@Component({
  selector: 'lib-gym-general-information',
  templateUrl: './gym-general-information.component.html',
  styleUrls: ['./gym-general-information.component.scss'],
})
export class GymGeneralInformationComponent implements OnInit {
  @Input() gymState!: GymInformationCoreServiceInterface;

  constructor() {}

  ngOnInit(): void {}
}
