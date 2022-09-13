import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TripRegisterDialogComponent } from 'projects/shared-lib/src/lib/components/dialogs';
import { Tile, TileActions } from 'projects/shared-lib/src/lib/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public title: string = 'Aktuelles';
  public tileActionsEnum: typeof TileActions = TileActions;
  public registerLabel: string = 'Anmelden';
  public tiles: Tile[] = [
    {
      title: 'Lermoos',
      date: '15.01.2023',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      actions: [TileActions.Register],
      avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
      visible: true,
    },
    {
      title: '15.01.2023 - Lermoos',
      date: '15.01.2023',
      subTitle: 'Tagesausfahrt',
      image:
        'https://cdn.pixabay.com/photo/2014/10/22/18/04/man-498473_960_720.jpg',
      imageDescription: 'sample',
      text: 'orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      actions: [TileActions.Share, TileActions.Register],
      visible: true,
    },
    {
      title: '15.01.2023 - Lermoos',
      date: '15.01.2023',
      subTitle: 'Tagesausfahrt',
      image:
        'https://cdn.pixabay.com/photo/2016/11/18/15/40/boy-1835416_960_720.jpg',
      imageDescription: 'sample',
      text: 'orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      actions: [TileActions.Share, TileActions.Register],
      visible: true,
    },
    {
      title: '15.01.2023 - Lermoos',
      date: '15.01.2023',
      subTitle: 'Tagesausfahrt',
      image:
        'https://cdn.pixabay.com/photo/2020/01/13/23/15/snowboarding-4763731_960_720.jpg',
      imageDescription: 'sample',
      text: 'orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      actions: [TileActions.Share, TileActions.Register],
      visible: true,
    },
    {
      title: '15.01.2023 - Lermoos',
      date: '15.01.2023',
      subTitle: 'Tagesausfahrt',
      image: '../../../../assets/img/cards/skiboers.jpg',
      imageDescription: 'sample',
      text: 'orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      actions: [TileActions.Share, TileActions.Register],
      visible: true,
    },
  ];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  public openRegisterDialog(tile: Tile) {
    let dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      data: { tile },
    };

    const dialogRef = this.dialog.open(
      TripRegisterDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      // TODO: Add a snackbar
      console.log(`Dialog result: ${result}`);
    });
  }

  public openShareDialog() {}
}
