import { Component, OnInit } from '@angular/core';
import { Tile } from 'projects/shared-lib/src/lib/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  tiles: Tile[] = [
    {
      title: '15.01.2023 - Lermoos',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'Test text',
      actionOne: 'Teilen',
      actionTwo: 'Anmelden',
    },
    {
      title: '15.01.2023 - Lermoos',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'Test text',
      actionOne: 'Teilen',
      actionTwo: 'Anmelden',
    },
    {
      title: '15.01.2023 - Lermoos',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'Test text',
      actionOne: 'Teilen',
      actionTwo: 'Anmelden',
    },
    {
      title: '15.01.2023 - Lermoos',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'Test text',
      actionOne: 'Teilen',
      actionTwo: 'Anmelden',
    },
    {
      title: '15.01.2023 - Lermoos',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'Test text',
      actionOne: 'Teilen',
      actionTwo: 'Anmelden',
    },
  ];

  cards: any[] = [1, 2, 3, 4, 5, 6, 7];

  ngOnInit(): void {}
}
