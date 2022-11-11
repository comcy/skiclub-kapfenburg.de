import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  ShareDialogComponent,
  TripRegisterDialogComponent,
} from 'projects/shared-lib/src/lib/components/dialogs';
import { Tile, TileActions } from 'projects/shared-lib/src/lib/models';
import { BOARDING_LIST, TRIP_DATA } from '../../trip-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public title: string = 'Aktuelles';
  public tileActionsEnum: typeof TileActions = TileActions;
  public registerLabel: string = 'Anmelden';
  public tiles: Tile[] = [];
  public boardings: string[] = BOARDING_LIST;

  private trips: Tile[] = TRIP_DATA;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.trips.sort(
      (a, b) => b.expiration.getTime() - a.expiration.getTime(),
    );
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
