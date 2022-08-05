import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDialogComponent } from 'projects/shared-lib/src/lib/components/dialogs';
import { Tile } from 'projects/shared-lib/src/lib/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(RegisterDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

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
