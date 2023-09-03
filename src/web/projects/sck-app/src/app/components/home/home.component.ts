import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  Tile,
  TileActions,
  TileBehavior,
  TileStatus,
} from 'projects/shared-lib/src/lib/models';
import { PROGRAMM_DOWNLOAD_LINK, PROGRAMM_DOWNLOAD_LINK_SHORT, TRIP_DATA } from '@data';
import { MarkdownRenderService } from 'projects/shared-lib/src/lib/services';
import { TripsRegisterDialogComponent } from '@trips-lib';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public title: string = 'Aktuelles';
  public tileStatusEnum: typeof TileStatus = TileStatus;
  public tileActionsEnum: typeof TileActions = TileActions;
  public tileBehaviorEnum: typeof TileBehavior = TileBehavior;
  public registerLabel: string = 'Anmelden';
  public tiles: Tile[] = [];
  public programmDownloadLink = PROGRAMM_DOWNLOAD_LINK;

  private trips: Tile[] = TRIP_DATA;

  constructor(
    public dialog: MatDialog,
    public markdown: MarkdownRenderService,
  ) {}

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

  public openRegisterDialog(tile: Tile) {
    let dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      tile,
    };

    const dialogRef = this.dialog.open(
      TripsRegisterDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openLink(link: string) {
    window.open(link, "_blank");
  }
}
  //     // TODO: Add a snackbar
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }
// }
