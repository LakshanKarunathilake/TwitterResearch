import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetailedReport } from './detailedRepoGen';
import { AngularFirestore } from 'angularfire2/firestore';
import { Tweet_Sentiment } from '../../models/SentimentModels/Tweet_Sentiment';
import { Observable } from 'rxjs';

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
  
  user_data;
  repo_gen = new DetailedReport(this.afs);

  tweets_observable: Observable<Tweet_Sentiment[]>;

  shownGroup = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.user_data = navParams.data;   
    this.generateReport();
  } 

  

  async generateReport(){
    this.tweets_observable= await this.repo_gen.sentimentData(this.user_data);
    this.tweets_observable.subscribe(data=>{
      data.forEach(element => {
        console.log(element)
      });
    })    
   
  }

  toggleGroup(group){
    if(this.isGroupShown(group)){
      this.shownGroup = null;
    }else{
      this.shownGroup = group;
    }
  }

  isGroupShown(group){
    return this.shownGroup === group
  }

}
