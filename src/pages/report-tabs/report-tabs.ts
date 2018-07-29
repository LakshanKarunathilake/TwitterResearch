import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ReportTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-tabs',
  templateUrl: 'report-tabs.html',
})
export class ReportTabsPage {
  
  tab1Root = "GraphicalReportPage";
  tab2Root = "DetailedReportPage";
 
  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportTabsPage');
  }

}
