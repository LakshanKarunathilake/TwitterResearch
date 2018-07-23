import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TwitterUser } from '../../models/TwitterUsers';

/**
 * Generated class for the TwitterViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-twitter-view',
  templateUrl: 'twitter-view.html',
})
export class TwitterViewPage {

  user: TwitterUser;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
    console.log(this.user);
  }

  
}
