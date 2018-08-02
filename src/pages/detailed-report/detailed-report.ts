import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetailedReport } from './detailedRepoGen';
import { AngularFirestore } from 'angularfire2/firestore';
import { Tweet_Sentiment } from '../../models/SentimentModels/Tweet_Sentiment';

/**
 * Generated class for the DetailedReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detailed-report',
  templateUrl: 'detailed-report.html',
})
export class DetailedReportPage {
  a:Tweet_Sentiment[] = [];
  user_data;
  repo_gen = new DetailedReport(this.afs);

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.user_data = navParams.data;
    console.log('detailed',this.user_data)
    this.generateReport();
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailedReportPage');
  }

  generateReport(){
    
    this.a = this.repo_gen.sentimentData(this.user_data);
  
    this.a.forEach(obj=>{
      console.log(obj);
    });
    this.repo_gen.getAllSentiment();
    console.log(this.repo_gen.get_all_sentiment());
    //console.log('length',a.length);
    
    //console.log(JSON.stringify(a)); 
    
  }

}
