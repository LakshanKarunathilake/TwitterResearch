import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartViewPage } from './chart-view';

@NgModule({
  declarations: [
    ChartViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ChartViewPage),
  ],
})
export class ChartViewPageModule {}
