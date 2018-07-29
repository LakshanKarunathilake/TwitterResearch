import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailedReportPage } from './detailed-report';

@NgModule({
  declarations: [
    DetailedReportPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailedReportPage),
  ],
})
export class DetailedReportPageModule {}
