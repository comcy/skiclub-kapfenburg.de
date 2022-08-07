import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TripRegisterDialogComponent } from 'projects/shared-lib/src/lib/components/dialogs';
import { TripRegistrationFormServiceInterface } from 'projects/shared-lib/src/lib/components/forms';
import { Tile } from 'projects/shared-lib/src/lib/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  tiles: Tile[] = [
    {
      title: '15.01.2023 - Lermoos',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      actionOne: 'Teilen',
      actionTwo: 'Anmelden',
    },
    {
      title: '15.01.2023 - Lermoos',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      actionOne: 'Teilen',
      actionTwo: 'Anmelden',
    },
    {
      title: '15.01.2023 - Lermoos',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      actionOne: 'Teilen',
      actionTwo: 'Anmelden',
    },
    {
      title: '15.01.2023 - Lermoos',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      actionOne: 'Teilen',
      actionTwo: 'Anmelden',
    },
    {
      title: '15.01.2023 - Lermoos',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      actionOne: 'Teilen',
      actionTwo: 'Anmelden',
    },
  ];

  cards: any[] = [1, 2, 3, 4, 5, 6, 7];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  public openRegisterDialog(tile: Tile) {
    const dialogRef = this.dialog.open(TripRegisterDialogComponent, {
      data: { tile },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // TODO: Add a snackbar
      console.log(`Dialog result: ${result}`);
    });
  }

  public openShareDialog() {}
}
