import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { Page } from '../../models/Page';
import { User } from '../../models/User';

/**
 * Generated class for the MainMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main-menu',
  templateUrl: 'main-menu.html',
})
export class MainMenuPage {
  
  rootPage = "InfoPage";
  user_loggedIn: User;

  @ViewChild(Nav) nav:Nav;

  pages:Page [] = [
    {title:'Search Page',component: 'SearchPage',icon:'search'},
    {title:'Report', component: 'ReportsPage',icon:'paper'},
    {title:'User Settings',component:'UserSettingsPage',icon:'settings'},
    
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.user_loggedIn = navParams.data;
    console.log('-----Main MEnu----');
    // console.log(this.user_loggedIn.userId);
  }

  onPage(page:Page){
    this.nav.setRoot(page.component);
    // this.nav.setRoot(page.component,this.user_loggedIn);
  }

  

}
