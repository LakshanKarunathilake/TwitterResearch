import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the ReportTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-report-tabs",
  templateUrl: "report-tabs.html"
})
export class ReportTabsPage {
  tab1Root = "GraphicalReportPage";
  tab2Root = "DetailedReportPage";

  user_data = { user_docID: "10", twitter_docID: "bc" }; //Dummy data

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user_data = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ReportTabsPage");
  }

  tabClick() {
    console.log("tab clicked");
  }
}
