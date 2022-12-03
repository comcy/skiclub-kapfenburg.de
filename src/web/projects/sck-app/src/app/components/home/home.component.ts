import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  ShareDialogComponent,
  TripRegisterDialogComponent,
} from 'projects/shared-lib/src/lib/components/dialogs';
import {
  Tile,
  TileActions,
  TileBehavior,
} from 'projects/shared-lib/src/lib/models';
import { BOARDING_LIST, TRIP_DATA } from '@data';
import { PROGRAMM_DOWNLOAD_LINK } from 'projects/data/downloads';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public title: string = 'Aktuelles';
  public tileActionsEnum: typeof TileActions = TileActions;
  public tileBehaviorEnum: typeof TileBehavior = TileBehavior;
  public registerLabel: string = 'Anmelden';
  public tiles: Tile[] = [];
  public programmDonwloadLink = PROGRAMM_DOWNLOAD_LINK;

  private trips: Tile[] = TRIP_DATA;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.trips.sort((a, b) => {
      return a.order > b.order // Handle order
        ? -1
        : 1 && b.expiration.getTime() - a.expiration.getTime(); // Handle expiration
    });

    // then place expired events at the end
    this.trips.sort((a, b) => {
      if (a.expiration.getTime() < new Date().getTime()) return 1;
      else if (b.expiration.getTime() > new Date().getTime()) return -1;
      else return a.expiration.valueOf() - b.expiration.valueOf();
    });

    this.trips.map((t) => {
      t.expired = t.expiration.getTime() < new Date().getTime() ? true : false;
      t.visible = t.visible === false ? false : true;
    });

    this.tiles = this.trips;
  }

  public openRegisterDialog(tile: Tile, boardingList: string[]) {
    let dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      data: { tile, boardingList },
    };

    const dialogRef = this.dialog.open(
      TripRegisterDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openShareDialog(tile: Tile) {
    let dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      data: { tile },
    };

    const dialogRef = this.dialog.open(ShareDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      // TODO: Add a snackbar
      console.log(`Dialog result: ${result}`);
    });
  }
}
