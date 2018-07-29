import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportTabsPage } from './report-tabs';

@NgModule({
  declarations: [
    ReportTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportTabsPage),
  ],
})
export class ReportTabsPageModule {}
