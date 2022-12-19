import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsDownloadsComponent } from './trips-downloads/trips-downloads.component';

@NgModule({
  declarations: [TripsDownloadsComponent],
  imports: [CommonModule],
  exports: [TripsDownloadsComponent],
})
export class TripsFeatureModule {}
