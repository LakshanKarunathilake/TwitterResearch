import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { Page } from '../../models/Page';

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
  
  rootPage = "TabsPage";

  @ViewChild(Nav) nav:Nav;

  pages:Page [] = [
    {title:'Search Page',pageName:'ReportsPage', tabComponent: 'SearchPage',index:0,icon:'search'},
    {title:'Report',pageName:'ReportsPage', tabComponent: 'ReportsPage',index:1,icon:'paper'},
    {title:'User Settings',pageName:'UserSettingsPage',tabComponent:'UserSettingsPage',icon:'settings'}
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onPage(page:Page){
    let params = {};

    if(page.index){
      params = {
        tabIndex: page.index
      }
    }

    if(this.nav.getActiveChildNav() && page.index != undefined){
      this.nav.getActiveChildNav().select(page.index);
    }else{
      this.nav.setRoot(page.tabComponent,params);
    }
  }

  isActive(page:Page){
    let childNav = this.nav.getActiveChildNav();

    if(childNav){
      if(childNav.getSelected() && childNav.getSelected.root === page.tabComponent){
        return 'primary';
      }
     return;
    }

    if(this.nav.getActive() && this.nav.getActive().name === page.pageName){
      return 'primary';
    }
  }

}
