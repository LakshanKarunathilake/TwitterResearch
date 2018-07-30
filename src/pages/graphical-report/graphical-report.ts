import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GraphicalReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-graphical-report',
  templateUrl: 'graphical-report.html',
})
export class GraphicalReportPage {
  
  user_data;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user_data = navParams.data;
    console.log(this.user_data)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraphicalReportPage');
  }

}
