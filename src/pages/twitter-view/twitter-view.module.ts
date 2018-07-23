import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TwitterViewPage } from './twitter-view';

@NgModule({
  declarations: [
    TwitterViewPage,
  ],
  imports: [
    IonicPageModule.forChild(TwitterViewPage),
  ],
})
export class TwitterViewPageModule {}
