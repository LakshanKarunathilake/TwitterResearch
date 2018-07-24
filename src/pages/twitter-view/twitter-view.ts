import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TwitterUser } from '../../models/TwitterUsers';
import { User } from '../../models/User';

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

  twitter_user: TwitterUser;
  user_loggedIn: User;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.twitter_user = this.navParams.data;
    console.log(this.twitter_user);
  }

  

  
}
