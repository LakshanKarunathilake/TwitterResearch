import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportMainPage } from './report-main';

@NgModule({
  declarations: [
    ReportMainPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportMainPage),
  ],
})
export class ReportMainPageModule {}
