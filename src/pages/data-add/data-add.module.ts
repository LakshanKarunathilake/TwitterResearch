import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataAddPage } from './data-add';

@NgModule({
  declarations: [
    DataAddPage,
  ],
  imports: [
    IonicPageModule.forChild(DataAddPage),
  ],
})
export class DataAddPageModule {}
