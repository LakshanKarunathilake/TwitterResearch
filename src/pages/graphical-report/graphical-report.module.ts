import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraphicalReportPage } from './graphical-report';

@NgModule({
  declarations: [
    GraphicalReportPage,
  ],
  imports: [
    IonicPageModule.forChild(GraphicalReportPage),
  ],
})
export class GraphicalReportPageModule {}
